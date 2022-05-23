const fs = require('fs');
const path = require('path');
const { stderr } = process;

const folder = path.join(__dirname, 'files');
const folderCopy = path.join(__dirname, 'files-copy');

const copyDir = async (folder, folderCopy) => {

  try {
    await fs.promises.rm(folderCopy, { force: true, recursive: true });
    await fs.promises.mkdir(folderCopy);
    
    const givenDir = await fs.promises.readdir(folder, { withFileTypes: true });

    givenDir.forEach(async (files) => {
      const folderFiles = path.join(folder, files.name);
      const folderCopyFiles = path.join(folderCopy, files.name);
                    
      if (files.isFile()) await fs.promises.copyFile(folderFiles, folderCopyFiles);
    });
  } catch (err) {
    if (err) stderr.write(err.message);
  }
};

copyDir(folder, folderCopy);
