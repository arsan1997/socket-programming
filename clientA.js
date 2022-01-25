var net = require('net');
var HOST = '127.0.0.1';
const readline = require('readline');
var PORT = 6969;
var client = new net.Socket();

const dataType = {
  authentiction: 'Auth',
  pickNumber: 'Pick',
  success: 'Success'
};
let userId = '';

client.connect(PORT, HOST, function () {
  console.log('CONNECTED TO: ' + HOST + ':' + PORT);
  // client.write('Hi');
});
client.on('data', function (data) {
  const body = data.toString();

  if (body.includes(dataType.authentiction)) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Select a number for key:  ', (answer) => {
      client.write(`${dataType.pickNumber} ${userId} ${answer}`);

      rl.close();
    });
  } else if (body.includes(dataType.success)) {
    const message = body.split(' ')[1];
    console.log(message);
    client.destroy();
  }
  userId = body.split(' ')[1];
});
client.on('connect', function () {
  var id = this.localAddress + ': ' + this.localPort;
  console.log('Client connected', id);
});
