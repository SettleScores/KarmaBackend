const fs = require('fs-extra');
const childProcess = require('child_process');

remove('./dist/')
  .then(() => copy('./src/public', './dist/public'))
  .then(() => copy('./src/views', './dist/views'))
  .then(() => exec('tsc --build tsconfig.prod.json', './'))
  .catch(err => console.log(err))
  .finally(() => console.log('Build script finished'));


function remove(loc) {
  return new Promise((res, rej) => {
    console.log("Removing ", loc);
    return fs.remove(loc, (err) => err ? rej(err) : res());
  });
}

function copy(src, dest) {
  return new Promise((res, rej) => {
    console.log(`Copying ${src} to ${dest}`)
    return fs.copy(src, dest, (err) => err ? rej(err) : res())
  });
}

function exec(cmd, loc) {
  return new Promise((res, rej) => {
    console.log("Executing ", cmd);
    return childProcess.exec(cmd, { cwd: loc }, (err, stdout, stderr) => {
      if (!!stdout) {
        console.log(stdout);
      }
      if (!!stderr) {
        console.log(stderr);
      }
      return (!!err ? rej(err) : res());
    });
  });
}
