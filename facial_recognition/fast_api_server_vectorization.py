import cv2
import face_recognition
import numpy as np
import urllib.request as ur
from fastapi import FastAPI
import time


app = FastAPI()

d = {}

def current_milli_time():
    return round(time.time() * 1000)


@app.get("/facehash")
async def face_hash(s3_url_image, status_code=200):

    req = ur.urlopen(s3_url_image)
    arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
    img = cv2.imdecode(arr, -1) 
    rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img_encoding = face_recognition.face_encodings(rgb_img)[0]
    ret = check_for_match(img_encoding)
    return ret

def check_for_match(img_encoding):
    match_found = False
    for k in d.keys():
        encoding = d[k]
        is_match = face_recognition.compare_faces([img_encoding], encoding)
        if(is_match[0]):
            match_found = True
            ret = k
            return ret 
    curr_time = current_milli_time()
    d[curr_time] = img_encoding
    return curr_time





# #image_1 = cv2.imread("/Users/adargan/Desktop/elon1.png")
# image_1 = cv2.imread("/Users/adargan/Documents/db1.jpg")
# #it is interpreting the image in BGR format 
# rgb_img = cv2.cvtColor(image_1, cv2.COLOR_BGR2RGB)
# print(face_recognition.face_encodings(rgb_img))
# img_encoding = face_recognition.face_encodings(rgb_img)[0]


# #accessing the image in the file from we have to match 
# #image_2 = cv2.imread("/Users/adargan/Desktop/elon2.png")
# image_2 = cv2.imread("/Users/adargan/Documents/db2.jpg")
# rgb_img2 = cv2.cvtColor(image_2, cv2.COLOR_BGR2RGB)
# img_encoding2 = face_recognition.face_encodings(rgb_img2)[0]


# #For Matching the images for cases 
# final_result = face_recognition.compare_faces([img_encoding], img_encoding2)

# print(img_encoding)
# print(img_encoding2)
# print("final_result: ", final_result)