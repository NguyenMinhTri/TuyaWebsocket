import TuyaWebsocket from "./TuyaWsClient";
const request = require('request');
const client = new TuyaWebsocket({
  accessId: "mkuse7adbhxq8hd73d5f",
  accessKey: "2f728ccb670044c3abc0e1e97889f418",
  url: TuyaWebsocket.URL.US,
  env: TuyaWebsocket.env.TEST, // Test channel
  maxRetryTimes: 50,
});

client.open(() => {
  console.log('open');
});

client.ping(() => {
  console.log('ping');
});

client.pong(() => {
  console.log('pong');
});

client.message((ws, message) => {
  let objectValue:any = {};
  client.ackMessage(message.messageId);
  console.log('message', JSON.stringify (message));
  objectValue['TuyaId'] = message.payload.data.devId;
  objectValue['Value'] = message.payload.data.status[0].value ? 1 : 0;
  objectValue['Location'] = "MyFarm";
  objectValue['Index'] = 0;
  objectValue['IsError'] = false;
  objectValue['CoilValue'] =  message.payload.data.status[0].value ;
  console.log('message', JSON.stringify (objectValue));
  let optionsNotiSocket = {
    uri: `https://asia-east2-weatherstationiotdaiviet.cloudfunctions.net/HttpPostRequest/api/handleNotiV2`,
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    json: objectValue,
  };
  doRequest(optionsNotiSocket);
});

function doRequest(options:any) {
  return new Promise(function (resolve, reject) {
    options.method === 'POST' ? request.post(
      options,
      function (error:any, response:any, body:any) {
        console.error('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        console.log(body.reasonPhrase);
        if (!error && response.statusCode == 200) {
         console.log(body);
        }
        if (!error && response.statusCode == 200) {
          resolve(body);
        } else {
          resolve("ERROR");
         // reject(error);
        }
      }
    ):request.get(
      options,
      function (error:any, response:any, body:any) {
        console.error('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        console.log(body.reasonPhrase);
        if (!error && response.statusCode == 200) {
         console.log(body);
        }
        if (!error && response.statusCode == 200) {
          resolve(body);
        } else {
          resolve("ERROR");
         // reject(error);
        }
      }
    );
  });
}
client.close((ws, ...args) => {
  console.log('close', ...args);
});

client.error((ws, error) => {
  console.log('error', error);
});

client.start() 
