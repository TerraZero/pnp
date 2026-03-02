const YTDownload = require('ytdl-core');
const PlayDownload = require('play-dl');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const CLIProgress = require('cli-progress');
const AsyncPromise = require('zero-util/src/AsyncPromise');

ffmpeg.setFfmpegPath(ffmpegPath);

module.exports = class Downloader {

  async download(items) {
    const globalBar = new CLIProgress.SingleBar({
      format: 'Gesamt [{bar}] {value}/{total}',
    }, CLIProgress.Presets.shades_classic);

    globalBar.start(items.length, 0);
    for (const item of items) {
      await this.doDownload(item);
      globalBar.increment();
    }
    globalBar.stop();
  }

  async doDownload(item) {
    switch (item.type) {
      case 'youtube':
        await this.downloadYoutube(item);
        break;
    }
  }

  async downloadYoutube(item) {
    const promise = new AsyncPromise();
    // const download = YTDownload(item.url);
    console.log([item.url, await PlayDownload.validate(item.url)]);
    const download = await PlayDownload.stream(item.url);

    console.log(download);

    const bar = new CLIProgress.SingleBar({}, CLIProgress.Presets.shades_classic);
    let total = 0;
    let current = 0;

    download.on('response', res => {
      total = parseInt(res.headers['content-length'], 10);
    });

    download.on('data', chunk => {
      if (!bar.isActive && total > 0) bar.start(total, 0);
      current += chunk.length;
      bar.update(current);
    });

    ffmpeg(download)
      .audioBitrate(128)
      .toFormat('mp3')
      .save(item.output)
      .on('end', () => {
        bar.stop();
        promise.resolve();
      })
      .on('error', e => {
        bar.stop();
        promise.reject(e);
      });

    return promise.promise;
  }

}