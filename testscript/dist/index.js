var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import * as mime from 'mime-types';
import readline from 'readline';
var INPUT_FOLDER = 'C:/Users/lukas/Downloads/iwildcam_synthesized_idaho';
var BASE_URL = 'http://localhost:3000/api/v1/sensordata';
(function main() {
    return __awaiter(this, void 0, void 0, function () {
        var data, metadata, rawAllSensorData1, allSensorData1, rawUpdatedSensorData, updatedSensorData, rawAllSensorData2, allSensorData2, rawAllSensorData3, allSensorData3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.promises.readFile("".concat(INPUT_FOLDER, "/metadata.json"), { encoding: 'utf8' })];
                case 1:
                    data = _a.sent();
                    metadata = JSON.parse(data);
                    if (!(metadata.length > 2)) return [3 /*break*/, 19];
                    console.log("Sending requests for sensor data.", metadata[0]);
                    return [4 /*yield*/, sendRequest(metadata[0])];
                case 2:
                    _a.sent();
                    console.log('Done!');
                    return [4 /*yield*/, askQuestion('Press enter to continue...')];
                case 3:
                    _a.sent();
                    console.log("Sending requests for sensor data.", metadata[1]);
                    return [4 /*yield*/, sendRequest(metadata[0])];
                case 4:
                    _a.sent();
                    console.log('Done!');
                    return [4 /*yield*/, askQuestion('Press enter to continue...')];
                case 5:
                    _a.sent();
                    console.log('Getting all sensor data.');
                    return [4 /*yield*/, fetch("".concat(BASE_URL))];
                case 6:
                    rawAllSensorData1 = _a.sent();
                    return [4 /*yield*/, rawAllSensorData1.json()];
                case 7:
                    allSensorData1 = _a.sent();
                    console.log('All sensor data.', JSON.stringify(allSensorData1, null, 2));
                    return [4 /*yield*/, askQuestion('Press enter to continue...')];
                case 8:
                    _a.sent();
                    console.log('Updating sensor data.');
                    return [4 /*yield*/, updatePicture(allSensorData1[0].id, metadata[3].filename)];
                case 9:
                    rawUpdatedSensorData = _a.sent();
                    return [4 /*yield*/, rawUpdatedSensorData.json()];
                case 10:
                    updatedSensorData = _a.sent();
                    console.log('Updated sensor data.', JSON.stringify(updatedSensorData, null, 2));
                    return [4 /*yield*/, askQuestion('Press enter to continue...')];
                case 11:
                    _a.sent();
                    console.log('Getting all sensor data.');
                    return [4 /*yield*/, fetch("".concat(BASE_URL))];
                case 12:
                    rawAllSensorData2 = _a.sent();
                    return [4 /*yield*/, rawAllSensorData2.json()];
                case 13:
                    allSensorData2 = _a.sent();
                    console.log('All sensor data.', JSON.stringify(allSensorData2, null, 2));
                    return [4 /*yield*/, askQuestion('Press enter to continue...')];
                case 14:
                    _a.sent();
                    console.log('Deleting sensor data.', allSensorData2[0].id);
                    return [4 /*yield*/, fetch("".concat(BASE_URL, "/").concat(allSensorData2[0].id), { method: 'DELETE' })];
                case 15:
                    _a.sent();
                    console.log('Done!');
                    return [4 /*yield*/, askQuestion('Press enter to continue...')];
                case 16:
                    _a.sent();
                    console.log('Getting all sensor data.');
                    return [4 /*yield*/, fetch("".concat(BASE_URL))];
                case 17:
                    rawAllSensorData3 = _a.sent();
                    return [4 /*yield*/, rawAllSensorData3.json()];
                case 18:
                    allSensorData3 = _a.sent();
                    console.log('All sensor data.', JSON.stringify(allSensorData3, null, 2));
                    _a.label = 19;
                case 19: return [2 /*return*/];
            }
        });
    });
})();
function sendRequest(meta) {
    return __awaiter(this, void 0, void 0, function () {
        var image, body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.promises.readFile(path.join(INPUT_FOLDER, 'images', meta.filename), 'base64')];
                case 1:
                    image = _a.sent();
                    body = {
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
                    return [2 /*return*/, fetch(BASE_URL, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(body)
                        })];
            }
        });
    });
}
function updatePicture(id, filename) {
    return __awaiter(this, void 0, void 0, function () {
        var image, body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.promises.readFile(path.join(INPUT_FOLDER, 'images', filename), 'base64')];
                case 1:
                    image = _a.sent();
                    body = {
                        picture: {
                            mimetype: mime.lookup(filename),
                            data: image
                        }
                    };
                    return [2 /*return*/, fetch("".concat(BASE_URL, "/").concat(id), {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(body)
                        })];
            }
        });
    });
}
function askQuestion(query) {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(function (resolve) { return rl.question(query, function (ans) {
        rl.close();
        resolve(ans);
    }); });
}
