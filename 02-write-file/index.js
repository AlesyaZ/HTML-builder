const fs = require('fs');
const path = require('path');
const { stdin } = process;

const fileCreate = fs.createWriteStream(path.join(__dirname, 'text.txt'));

console.log('Hi! Enter text\n');

stdin.on('data', data => {
  const enterText = data.toString();

  if (enterText.trim() === 'exit') {
    console.log('\nGood bye!'); 
    process.exit();
  } fileCreate.write(data);
});

process.on('SIGINT', () => {
  console.log('\nGood bay!'); 
  process.exit();
});

process.on('error', err => {
  console.log(err.message);
});
