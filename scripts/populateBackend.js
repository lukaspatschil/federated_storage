const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const mime = require('mime-types');

const BASE_URL = 'http://localhost:3000/api/v1/sensordata';
const INPUT_FOLDER = 'C:/Users/lukas/Downloads/iwildcam_synthesized_idaho';
// Dropbox has a very small parallel request limit
//? Maybe change the backend to use a queue or something different for dropbox?
const CHUNK_SIZE = 1;

class Timer {
  startTime;
  endTime;
  difference;

  constructor() {
    this.start();
  }

  start() {
    this.startTime = new Date();
  }

  stop() {
    this.endTime = new Date();
    const timeDiff = this.endTime.getTime() - this.startTime.getTime();

    this.lastDifference = timeDiff;
    return timeDiff;
  }
}

(async function() {
  const data = await fs.promises.readFile(path.join(INPUT_FOLDER, 'metadata.json'), 'utf8');
  const metadata = JSON.parse(data);
  const n = isNaN(parseInt(process.argv[2])) ? metadata.length : parseInt(process.argv[2]);

  const timer = new Timer();
  let timeSum = 0;

  console.log(`Generating ${n} entries...`);

  for(let i = 0, j = n; i < j; i += CHUNK_SIZE) {
    const temporary = metadata.slice(i, i + CHUNK_SIZE); 
    const requestTimer = new Timer();

    await Promise.all(temporary.map(meta => sendRequest(meta)));

    console.log(`Chunk ${i + 1} / ${n / CHUNK_SIZE} - DONE - ${requestTimer.stop()}ms`);
    timeSum += requestTimer.lastDifference;
  }

  console.log(`Operating time: ${timer.stop() / 1000}s`);
  console.log(`Average chunk time: ${timeSum / (n)}ms`);
})();

async function sendRequest(meta) {
  console.log('Fetching images...');
  const image = await fs.promises.readFile(path.join(INPUT_FOLDER, 'images', meta.filename), 'base64');

  console.log('Fetching metadata...');
  const body = {
    'picture': {
      'mimetype': mime.lookup(meta.filename),
      'data': image
    },
    'metadata': {
      'name': meta.name,
      'placeIdent': meta.place_ident,
      'seqID': meta.seq_id,
      'datetime': meta.datetime,
      'frameNum': meta.frame_num,
      'seqNumFrames': meta.seq_num_frames,
      'filename': meta.filename,
      'deviceID': meta.device_id,
      'location': {
        'longitude': meta.longitude,
        'latitude': meta.latitude,
      }
    }
  }

  return fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
}