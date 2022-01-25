const net = require('net');
const HOST = '127.0.0.1';
const PORT = 6969;

// const server = net.createServer();

const clients = [];

const dataType = {
  authentiction: 'Auth',
  pickNumber: 'Pick',
  guess: 'Guess',
  answer: 'Answer',
  success: 'Success',
  close: 'close'
};
let key = 0;

const isDataTypeOf = (data, type) => {
  return data.includes(type);
};

const randomNumber = () => {
  return Math.floor(Math.random() * 1000);
};

const findClientsIdxById = (id) => {
  return clients.findIndex((x) => Object.keys(x)[0] == id) === 0
    ? (idx = 1)
    : (idx = 0);
};

net
  .createServer((sock) => {
    sock.id = randomNumber();
    console.log(`Connecting: client ID [${sock.id}]`);

    clients.push({ [sock.id]: sock });

    sock.write(`Auth: ${sock.id}`);

    sock.on('data', function (buffer) {
      const data = buffer.toString();
      const { pickNumber, guess, success } = dataType;

      if (isDataTypeOf(data, pickNumber)) {
        let pickNumber;
        let userId;
        let idx;

        try {
          pickNumber = parseInt(data.split(' ')[2]);
          userId = parseInt(data.split(' ')[1]);
        } catch (error) {
          pickNumber = 50;
        }

        key = pickNumber;
        console.log('Key: ', key);

        idx = findClientsIdxById(userId);

        clients[idx][Object.keys(clients[idx])].write(`${dataType.guess}`);
      } else if (isDataTypeOf(data, guess)) {
        let guessNumber = parseInt(data.split(' ')[1]);

        if (guessNumber < 0) {
          sock.write(`${dataType.answer}: not found`);
        } else if (guessNumber == key) {
          sock.write(`${dataType.answer}: true and end game`);
        } else if (guessNumber > key) {
          sock.write(`${dataType.answer}: more than`);
        } else if (guessNumber < key) {
          sock.write(`${dataType.answer}: less than`);
        }
      } else if (isDataTypeOf(data, success)) {
        const endUser = parseInt(data.split(' ')[1].trim());
        let idx;
        idx = findClientsIdxById(endUser);

        clients[idx][Object.keys(clients[idx])].write(
          `${dataType.success}: endgame`
        );
      }
    });
  })
  .listen(PORT, HOST);
