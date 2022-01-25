import requests
import base64
import time

BASE_URL="http://localhost:3000/api/v1/sensordata"
INPUT_FOLDER = "/aic/g2/"

class Timer:
  def __init__(self):
    self.startTime = 0
    self.endTime = 0

  def start(self):
    self.startTime = time.time()

  def stop(self):
    self.endTime = time.time()

  def elapsed(self):
    return self.endTime - self.startTime

def sendPostRequest(meta):
  payload = createPayload(meta)

  return requests.post(BASE_URL, json=payload)

def getAllEntries():
  return requests.get(BASE_URL)

def updatePicture(id, pictureName):
  with open(f"{INPUT_FOLDER}/images/{pictureName}", 'rb') as img_file:
    picture = base64.b64encode(img_file.read())

    payload = {
      'picture': {
        'mimetype': 'image/jpeg',
        'data': picture.decode('utf-8')
      }
    }

  return requests.put(f"{BASE_URL}/{id}", json=payload)

def deleteEntry(id):
  return requests.delete(f"{BASE_URL}/{id}")

def createPayload(meta):
  with open(f"{INPUT_FOLDER}/images/{meta['filename']}", 'rb') as img_file:
    picture = base64.b64encode(img_file.read())

    payload = {
      'picture': {
        'mimetype': 'image/jpeg',
        'data': picture.decode('utf-8')
      },
      'metadata': {
        'name': meta['name'],
        'placeIdent': meta['place_ident'],
        'seqId': meta['seq_id'],
        'datetime': meta['datetime'],
        'frameNum': meta['frame_num'],
        'seqNumFrames': meta['seq_num_frames'],
        'filename': meta['filename'],
        'deviceID': meta['device_id'],
        'location': {
          'longitude': meta['longitude'],
          'latitude': meta['latitude'],
        }
      }
    }

  return payload