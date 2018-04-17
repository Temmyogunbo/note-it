const EventEmitter = require('events');
const readline = require('readline');

// we create an interface to use the readline module
const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const client = new EventEmitter();
const server = require('../server')(client);

server.on('response', (response) => {
  process.stdout.write(response);
  process.stdout.write('\nnoteit>>> ');
})

let command, args;
r1.on('line', (input) => {
  const [command, ...args] = input.split(' ');
  client.emit('command', command.toLowerCase(), args);
});
