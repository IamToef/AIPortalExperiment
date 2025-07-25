import cv2, os, copy
import numpy as np
import onnxruntime as ort
from utils import convert_webp_to_jpg
from config import threshold_table
from models import BoundingBox
from indices import get_indices

def letterbox(im, new_shape=(640, 640), color=(114, 114, 114), auto=True, scaleup=True, stride=32):
    # Resize and pad image while meeting stride-multiple constraints
    shape = im.shape[:2]  # current shape [height, width]
    if isinstance(new_shape, int):
        new_shape = (new_shape, new_shape)

    # Scale ratio (new / old)
    r = min(new_shape[0] / shape[0], new_shape[1] / shape[1])
    if not scaleup:  # only scale down, do not scale up (for better val mAP)
        r = min(r, 1.0)

    # Compute padding
    new_unpad = int(round(shape[1] * r)), int(round(shape[0] * r))
    dw, dh = new_shape[1] - new_unpad[0], new_shape[0] - new_unpad[1]  # wh padding

    if auto:  # minimum rectangle
        dw, dh = np.mod(dw, stride), np.mod(dh, stride)  # wh padding

    dw /= 2  # divide padding into 2 sides
    dh /= 2

    if shape[::-1] != new_unpad:  # resize
        im = cv2.resize(im, new_unpad, interpolation=cv2.INTER_LINEAR)
    top, bottom = int(round(dh - 0.1)), int(round(dh + 0.1))
    left, right = int(round(dw - 0.1)), int(round(dw + 0.1))
    im = cv2.copyMakeBorder(im, top, bottom, left, right, cv2.BORDER_CONSTANT, value=color)  # add border
    return im, r, (dw, dh)

def extract(img_list):
  detections = {}
  session = ort.InferenceSession('abbott0229.onnx')
  for img_path in img_list:
    if img_path.lower().endswith(('.png', '.jpg', '.jpeg')):
      img0 = cv2.imread(img_path)
    else:
      img0 = convert_webp_to_jpg(img_path)

    img = cv2.cvtColor(img0, cv2.COLOR_BGR2RGB)
    H, W, C = img.shape
    img, ratio, dwdh = letterbox(img, auto=False)
    img = img.transpose(2, 0, 1)
    img = np.expand_dims(img, 0)
    img = np.ascontiguousarray(img)
    img = img.astype(np.float32)
    img /= 255.0  # 0 - 255 to 0.0 - 1.0
    conf_thres = 0.25
    onnx_inputs = {session.get_inputs()[0].name: img}
    onnx_outputs = session.run(None, onnx_inputs)[0]
    boxes = []
    for _, (idx, x0, y0, x1, y1, cls_id, score) in enumerate(onnx_outputs):
      score = round(float(score),3)
      if score < conf_thres: continue
      box = np.array([x0,y0,x1,y1])
      box -= np.array(dwdh*2)
      box /= ratio
      box = box.round().astype(np.int32).tolist()
      cls_id = int(cls_id)
      box = [max(0,box[0]),max(0,box[1]),min(W,box[2]),min(H,box[3]), score, cls_id]
      boxes.append(box)
  
    detections[os.path.basename(img_path)] = boxes
  return detections

def compare_threshold(index_dict, classes):
  count_items = {}
  for type in index_dict:
      count_items.update({type: len(index_dict[type])})
  print("COUNT: ", count_items)

  def check_all_greater(real, standard):
      if len(real) < len(standard):
          return False
      elif len(real) > len(standard):
          raise Exception("Real detection has more values than in table")
      else:
          for ir, r in enumerate(real):
              if r < standard[ir]:
                  return False 
          return True

  returned_level = -1
  for level, threshold in enumerate(reversed(threshold_table)):
      if check_all_greater(list(count_items.values()), threshold):
          returned_level = level
  if returned_level==-1:
      result = 0
      msg = "PHOTOINVALID: Hình chưa đạt mức trưng bày tối thiểu.\nVui lòng trưng bày theo tiêu chí\n "
      for i, cl in enumerate(classes):
          msg += f"{cl}={threshold_table[-1][i]}\n"
  else:
      result = 1
      msg = f"OK: Hình đạt mức {returned_level+1}."
  return result, msg

def get_boxes_and_indices(detections):
    boxes = []
    for box in detections:
        boxes.append( BoundingBox(box[0], box[1], box[2], box[3], box[4], box[-1]) )
    index_dict = get_indices(boxes)
    return boxes, index_dict