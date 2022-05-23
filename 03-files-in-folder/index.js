const fs = require('fs');
const path = require('path');
const { stdout, stderr } = process;

const folderFiles = path.join(__dirname, 'secret-folder');

fs.readdir(folderFiles, {withFileTypes: true}, (err, data) => {
  if (err) stderr.write(err.message);

  data.forEach(folderItem => {
    if((folderItem.isFile())){
      const fileExtens = path.extname(folderItem.name);
      const name = path.basename(folderItem.name, fileExtens);
      const file = path.join(folderFiles, folderItem.name);
     
      fs.stat(file, (err, stats) => {
        if (err) stderr.write(err.message);

        stdout.write(`${name} - ${fileExtens.slice(1)} - ${(stats.size/1024)}kb\n`);
      });
    }
  });
});
