import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import * as mime from 'mime-types';
import readline from 'readline';
const INPUT_FOLDER = 'C:/Users/lukas/Downloads/iwildcam_synthesized_idaho';
const BASE_URL = 'http://localhost:3000/api/v1/sensordata';
(async function main() {
    const data = await fs.promises.readFile(`${INPUT_FOLDER}/metadata.json`, { encoding: 'utf8' });
    const metadata = JSON.parse(data);
    if (metadata.length > 2) {
        console.log(`Sending requests for sensor data.`, metadata[0]);
        await sendRequest(metadata[0]);
        console.log('Done!');
        await askQuestion('Press enter to continue...');
        console.log(`Sending requests for sensor data.`, metadata[1]);
        await sendRequest(metadata[0]);
        console.log('Done!');
        await askQuestion('Press enter to continue...');
        console.log('Getting all sensor data.');
        const rawAllSensorData1 = await fetch(`${BASE_URL}`);
        const allSensorData1 = await rawAllSensorData1.json();
        console.log('All sensor data.', JSON.stringify(allSensorData1, null, 2));
        await askQuestion('Press enter to continue...');
        console.log('Updating sensor data.');
        const rawUpdatedSensorData = await updatePicture(allSensorData1[0].id, metadata[3].filename);
        const updatedSensorData = await rawUpdatedSensorData.json();
        console.log('Updated sensor data.', JSON.stringify(updatedSensorData, null, 2));
        await askQuestion('Press enter to continue...');
        console.log('Getting all sensor data.');
        const rawAllSensorData2 = await fetch(`${BASE_URL}`);
        const allSensorData2 = await rawAllSensorData2.json();
        console.log('All sensor data.', JSON.stringify(allSensorData2, null, 2));
        await askQuestion('Press enter to continue...');
        console.log('Deleting sensor data.', allSensorData2[0].id);
        await fetch(`${BASE_URL}/${allSensorData2[0].id}`, { method: 'DELETE' });
        console.log('Done!');
        await askQuestion('Press enter to continue...');
        console.log('Getting all sensor data.');
        const rawAllSensorData3 = await fetch(`${BASE_URL}`);
        const allSensorData3 = await rawAllSensorData3.json();
        console.log('All sensor data.', JSON.stringify(allSensorData3, null, 2));
    }
})();
async function sendRequest(meta) {
    const image = await fs.promises.readFile(path.join(INPUT_FOLDER, 'images', meta.filename), 'base64');
    const body = {
        picture: {
            mimetype: mime.lookup(meta.filename),
            data: image
        },
        metadata: {
            name: meta.name,
            placeIdent: meta.place_ident,
            seqId: meta.seq_id,
            datetime: meta.datetime,
            frameNum: meta.frame_num,
            seqNumFrames: meta.seq_num_frames,
            filename: meta.filename,
            deviceID: meta.device_id,
            location: {
                longitude: meta.longitude,
                latitude: meta.latitude,
            }
        }
    };
    return fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
}
async function updatePicture(id, filename) {
    const image = await fs.promises.readFile(path.join(INPUT_FOLDER, 'images', filename), 'base64');
    const body = {
        picture: {
            mimetype: mime.lookup(filename),
            data: image
        }
    };
    return fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
}
function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
}
