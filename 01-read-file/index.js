const fs = require('fs');
const path = require('path');
const { stdout } = process;

const fileText =   path.join(__dirname,'text.txt');
const fileTextRead = fs.createReadStream(fileText, {encoding: 'utf8'});

fileTextRead.on('data', data => {
  stdout.write(data);
});

fileTextRead.on('error', err => {
  stdout.write(err.message);
});