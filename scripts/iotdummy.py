import json
import sys
from utils import sendPostRequest, Timer, INPUT_FOLDER

def main():
  if (len(sys.argv) == 2):
    n = int(sys.argv[1])

  with open (f'{INPUT_FOLDER}/metadata.json') as file:
    metadata = json.load(file)
    i = 0
    timer = Timer()

    for meta in metadata:
      if (i == n):
        break

      timer.start()
      response = sendPostRequest(meta)
      timer.stop()

      print(f'Entry {i + 1} response {response.status_code} in {round(timer.elapsed(), 3)} seconds')
      i += 1

if __name__ == "__main__":
  main()