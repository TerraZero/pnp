const PlayDownload = require('play-dl');

(async () => {

  const t = await PlayDownload.stream(url);
  console.log(t);
  // const source = await PlayDownload.stream(url);

  // console.log(source);

})();