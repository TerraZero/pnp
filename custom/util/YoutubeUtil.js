module.exports = class YoutubeUtil {

  /**
   * @param {string} url 
   * @returns {string}
   */
  static getVideoId(url) {
    const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    if (!match) return null;
    return match[1];
  }

  /**
   * @param {string} id 
   * @param {string} quality 
   * @returns {string}
   */
  static getVideoThumbnail(id, quality = 'hq') {
    return `https://img.youtube.com/vi/${id}/${quality}default.jpg`;
  }

}