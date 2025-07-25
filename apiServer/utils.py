import cv2, os
from PIL import Image, ImageDraw
import numpy as np

def hex2int(hex_str):
  return (int(hex_str[1:3], 16), int(hex_str[3:5], 16), int(hex_str[5:7], 16))

def extract_image(imgPath, detection, classes):
  classList = [cl['className'] for cl in classes]
  colorList = [cl['color'] for cl in classes]
  count = [0 for _ in classList]
  img = Image.open(imgPath)
  draw = ImageDraw.Draw(img)
  
  for det in detection:
    cl = det[-1]
    count[cl] = count[cl] + 1
    draw.rectangle([det[0], det[1], det[2], det[3]], width=3, outline=colorList[cl]) 
  
  msgs, colors = [], []
  numeric = []
  for i, c in enumerate(count):
    if c==0: continue
    msgs.append(f"{classList[i]}: {count[i]}")
    colors.append(colorList[i])
    numeric.append({
      "product": classList[i],
      "count": count[i]
    })

  for i, msg in enumerate(msgs):
    loc = (20, 20*(i+1))
    bbox = draw.textbbox(loc, msg)
    draw.rectangle(bbox, fill=(0,255,255))
    draw.text(loc, msg, fill=colors[i])

  return img, numeric

def convert_webp_to_jpg(inp_file):
  img = Image.open(inp_file)
  img = img.convert('RGB')
  return np.array(img)
