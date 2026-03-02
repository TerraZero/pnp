require('module-alias/register');
const Downloader = require('./modules/Downloader');

const downloader = new Downloader();

downloader.download([
  {
    type: 'youtube',
    url: 'https://www.youtube.com/watch?v=gn8ZkEOqGLc',
    output: './test.mp3',
  }
]);