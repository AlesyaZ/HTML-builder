const fs = require('fs');
const path = require('path');
const { stderr } = process;

const filesStyle = path.join(__dirname, 'styles');
const bundelStyle = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

fs.readdir(filesStyle, (err, folder) => {
  if (err) stderr.write(err.message);

  folder.forEach(elem => {
    const folderComp = path.join(filesStyle, elem);

    if (path.extname(folderComp) === '.css') {
      const dataStyles = fs.createReadStream(folderComp, 'utf-8');

      dataStyles.on('data', data => 
        bundelStyle.write(data + '\n'));
    }
  });
});