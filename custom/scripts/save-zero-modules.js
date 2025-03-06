const FS = require('fs');
const Path = require('path');

const target = 'S:\\code\\private';
const mods = [
  'zero-util',
  'zero-scaffold',
  'zero-system',
  'zero-vue',
];

function copyFolderSync(source, destination) {
  if (!FS.existsSync(destination)) {
    FS.mkdirSync(destination, { recursive: true });
  }

  const entries = FS.readdirSync(source);
  
  for (const entry of entries) {
    if (entry.startsWith('.') || entry === 'node_modules' || entry === 'package-lock.json') continue;
    
    const srcPath = Path.join(source, entry);
    const destPath = Path.join(destination, entry);
    const entryStat = FS.statSync(srcPath);

    if (entryStat.isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      FS.copyFileSync(srcPath, destPath);
    }
  }
}

function deleteFolderContentsSync(folder) {
  if (FS.existsSync(folder)) {
    FS.readdirSync(folder).forEach(file => {
      if (file.startsWith('.') || file === 'node_modules' || file === 'package-lock.json') return;
      
      const curPath = Path.join(folder, file);
      if (FS.lstatSync(curPath).isDirectory()) {
        deleteFolderContentsSync(curPath);
        FS.rmdirSync(curPath);
      } else {
        FS.unlinkSync(curPath);
      }
    });
  }
}

function copy(from, to) {
  if (FS.existsSync(to)) {
    deleteFolderContentsSync(to);
  }

  copyFolderSync(from, to);
}

for (const mod of mods) {
  const from = Path.join(__dirname, '../../node_modules', 'zero-util');
  const to = Path.join(target, 'zero-util');
  copy(from, to);
  console.log('- SAVE ' + mod);
}