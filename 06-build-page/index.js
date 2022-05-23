const fs = require('fs');
const path = require('path');
const promiseFs = require('fs/promises');
const { stderr } = process;

const prjectsFolder = path.join(__dirname, 'project-dist');
const folder = path.join(__dirname, 'assets');
const folderCopy = path.join(__dirname, 'project-dist', 'assets');
const htmlFolder = path.join(__dirname, 'components');
const htmlTemp = path.join(__dirname, 'template.html');
const htmlBundel = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
const styles = path.join(__dirname, 'styles');
const styleBundel = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));

const distCreat = async (folderDist) => {
  promiseFs.mkdir(folderDist, {recursive: true}, err => {
    if (err) stderr.write(err.message);
  });
};

const dirCopy = async (folder, folderCopy) => {
  try {
    await promiseFs.rm(folderCopy, { force: true, recursive: true });
    await promiseFs.mkdir(folderCopy);

    const givenDir = await promiseFs.readdir(folder, { withFileTypes: true });
  
    givenDir.forEach(async (files) => {
      const folderFiles = path.join(folder, files.name);
      const folderCopyFiles = path.join(folderCopy, files.name);
                      
      if (files.isFile()) {
        await promiseFs.copyFile(folderFiles, folderCopyFiles);
      } else {
        dirCopy(folderFiles, folderCopyFiles);
      }
    });
  } catch (err) {
    if (err) stderr.write(err.message);
  }
};

const buildHtml = async (htmlFile) => {  
  const htmlData = await promiseFs.readdir(htmlFile, { withFileTypes: true });
  let readHtml =  await promiseFs.readFile(htmlTemp, 'utf-8');
  
  for (let elem of htmlData) {
    const htmlStr = path.join(htmlFile, elem.name);
  
    if (elem.isFile() && path.extname(htmlStr) === '.html') {
      const htmlText = await promiseFs.readFile(htmlStr, 'utf-8');
      readHtml = readHtml.replace(`{{${path.parse(htmlStr).name}}}`, htmlText);
    }
  }
  htmlBundel.write(readHtml);
};

const buildStyles = async (styles) => {

  fs.readdir(styles, (err, folder) => {
    if (err) stderr.write(err.message);
    
    folder.forEach(elem => {
      const folderComp = path.join(styles, elem);
    
      if (path.extname(folderComp) === '.css') {
        const dataStyles = fs.createReadStream(folderComp, 'utf-8');
    
        dataStyles.on('data', data => 
          styleBundel.write(data + '\n'));
      }
    });
  });
};

async function createDist() {
  try {
    await distCreat(prjectsFolder);
    await dirCopy(folder, folderCopy);
    await buildHtml(htmlFolder);
    await buildStyles(styles);
  } catch (err) {
    if (err) stderr.write(err.message);
  }
}

createDist();
