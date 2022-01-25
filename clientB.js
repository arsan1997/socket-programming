var net = require('net');
var HOST = '127.0.0.1';

const readline = require('readline');

var PORT = 6969;
var client = new net.Socket();

const dataType = {
  authentiction: 'Auth',
  pickNumber: 'Pick',
  guess: 'Guess',
  answer: 'Answer',
  success: 'Success',
  close: 'close'
};
let userId = '';

const guessNumberInput = (message, client, options) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(message, (answer) => {
    client.write(`${dataType.guess} ${answer} ${options.userId}`);

    rl.close();
  });
};

client.connect(PORT, HOST, function () {
  console.log('CONNECTED TO: ' + HOST + ':' + PORT);
  // client.write('Hi');
});
client.on('data', function (data) {
  const body = data.toString();
  console.log(body);

  if (body.includes(dataType.guess)) {
    guessNumberInput('Guess a number: ', client, { userId });
  } else if (body.includes(dataType.answer)) {
    const message = body.slice(dataType.answer.length + 1).trim();

    if (
      message === 'lest do random' ||
      message === 'less than' ||
      message === 'more than' ||
      message === 'not found'
    ) {
      guessNumberInput('Guess a number: ', client, { userId });
    } else if (message == 'true and end game') {
      client.write(`${dataType.success} ${userId}`);
      client.destroy();
    }
  } else if (body.includes(dataType.close)) {
    client.destroy();
  } else {
    userId = body.split(' ')[1];
  }
});
client.on('connect', function () {
  var id = this.localAddress + ': ' + this.localPort;
  console.log('Client connected', id);
});
