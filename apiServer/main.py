from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn, os, cv2
from typing import List
from pydantic import BaseModel
from evaluate import extract, compare_threshold, get_boxes_and_indices
from utils import extract_image

class ImagesInfo(BaseModel):
    paths: List[str]
    classes: List[dict]

app = FastAPI()
origins = ["*"]
app.add_middleware(CORSMiddleware, 
                   allow_origins=origins, 
                   allow_credentials=True, 
                   allow_methods=["*"],
                   allow_headers=["*"])


@app.get("/")
async def root():
    return {"message": "Inner ML API"}

dataPath="D:/Minh/Projects/AIPortal/server/public/"
# dataPath="/app/server/public/"

@app.post('/count')
async def get_count(imagesInfo: ImagesInfo):
    imgList = [dataPath+p for p in imagesInfo.paths]
    numericList = []
    classes = imagesInfo.classes
    detections = extract(imgList)
    for i, currImgPath in enumerate(imgList):
        imgName = os.path.basename(currImgPath) # "abbott_label_1204_02.jpg"

        img, numeric  = extract_image(currImgPath, detections[imgName], classes)
        outputPath = os.path.join(os.path.dirname(os.path.dirname(currImgPath)), 'results', imgName)
        numericList.append(numeric)
        img.save(outputPath)

    return {
        "paths": [path.replace('images', 'results') for path in imagesInfo.paths],
        "numeric": numericList,
    }

@app.post('/plano_compare')
async def plano_compare(imagesInfo: ImagesInfo):
    imgList = [dataPath+p for p in imagesInfo.paths]
    classesNames = [cl["className"] for cl in imagesInfo.classes]
    detections = extract(imgList)
    responses = []
    for imgPath in imgList:
        imgName = os.path.basename(imgPath)
        detection = detections[imgName]
        response = {"evaluation_result": -1, "reasons": []}
        if len(detection) == 0: 
            response["reasons"].append("PHOTOINVALID: Không phát hiện sản phẩm trưng bày, vui lòng \nchụp hình tại khu vực trưng bày sản phẩm Abbott theo hướng dẫn")
            response["evaluation_result"] = 0

        if len(response["reasons"]) == 0:
            boxes, index_dict = get_boxes_and_indices(detection)
            print("BOXES:", boxes)
            print("INDEX DICT:", index_dict)

        if len(response["reasons"]) == 0:
            result, msg = compare_threshold(index_dict, classesNames)
            response["evaluation_result"] = result
            response["reasons"].append(msg)

        responses.append(response)
    return responses


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0",port=8000)