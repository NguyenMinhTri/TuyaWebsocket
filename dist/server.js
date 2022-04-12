"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var TuyaWsClient_1 = __importDefault(require("./TuyaWsClient"));
var request = require('request');
var client = new TuyaWsClient_1.default({
    accessId: "mkuse7adbhxq8hd73d5f",
    accessKey: "2f728ccb670044c3abc0e1e97889f418",
    url: TuyaWsClient_1.default.URL.US,
    env: TuyaWsClient_1.default.env.TEST,
    maxRetryTimes: 50,
});
client.open(function () {
    console.log('open');
});
client.ping(function () {
    console.log('ping');
});
client.pong(function () {
    console.log('pong');
});
client.message(function (ws, message) {
    var objectValue = {};
    client.ackMessage(message.messageId);
    console.log('message', JSON.stringify(message));
    objectValue['TuyaId'] = message.payload.data.devId;
    objectValue['Value'] = message.payload.data.status[0].value ? 1 : 0;
    objectValue['Location'] = "MyFarm";
    objectValue['Index'] = 0;
    objectValue['IsError'] = false;
    objectValue['CoilValue'] = message.payload.data.status[0].value;
    console.log('message', JSON.stringify(objectValue));
    var optionsNotiSocket = {
        uri: "https://asia-east2-weatherstationiotdaiviet.cloudfunctions.net/HttpPostRequest/api/handleNotiV2",
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        json: objectValue,
    };
    doRequest(optionsNotiSocket);
});
function doRequest(options) {
    return new Promise(function (resolve, reject) {
        options.method === 'POST' ? request.post(options, function (error, response, body) {
            console.error('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.
            console.log(body.reasonPhrase);
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
            if (!error && response.statusCode == 200) {
                resolve(body);
            }
            else {
                resolve("ERROR");
                // reject(error);
            }
        }) : request.get(options, function (error, response, body) {
            console.error('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.
            console.log(body.reasonPhrase);
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
            if (!error && response.statusCode == 200) {
                resolve(body);
            }
            else {
                resolve("ERROR");
                // reject(error);
            }
        });
    });
}
client.close(function (ws) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    console.log.apply(console, __spreadArray(['close'], args, false));
});
client.error(function (ws, error) {
    console.log('error', error);
});
client.start();
