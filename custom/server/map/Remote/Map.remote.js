/**
 * @typedef {Object} T_Point
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {T_Point[]} T_Rect
 */

/**
 * @typedef {Object} T_BorderArgs
 * @property {Object} border
 * @property {boolean} border.top
 * @property {boolean} border.left
 * @property {boolean} border.right
 * @property {boolean} border.bottom
 */

/**
 * @typedef {T_Point & T_BorderArgs} T_BorderPoint
 */

module.exports = class MapRemote {

  /**
   * @param {import('zero-system/src/Collector/RemoteCollector')} collector 
   */
  static define(collector) {
    collector.add('map');
  }

  /**
   * @param {T_Rect} rect 
   * @returns {T_Rect}
   */
  getNormalizedRect(rect) {
    return [
      { x: Math.min(rect[0].x, rect[1].x), y: Math.min(rect[0].y, rect[1].y) },
      { x: Math.max(rect[0].x, rect[1].x), y: Math.max(rect[0].y, rect[1].y) }
    ];
  }

  /**
   * @param {T_Rect} rect 
   * @param {T_Point} point 
   * @returns {boolean}
   */
  inRect(rect, point) {
    const nRect = this.getNormalizedRect(rect);
    return point.x >= nRect[0].x && point.x <= nRect[1].x && point.y >= nRect[0].y && point.y <= nRect[1].y;
  }

  /**
   * @param {T_Point[]} points 
   * @returns {T_Point[]}
   */
  sortPoints(points) {
    return points.sort((a, b) => {
      if (a.y === b.y) return a.x - b.x;
      return a.y - b.y;
    });
  }

  /**
   * @param {T_Point[]} points 
   * @param {T_Point} point 
   * @returns {number}
   */
  findIndex(points, point) {
    return points.findIndex(v => v.x === point.x && v.y === point.y);
  }

  /**
   * @template T
   * @param {T[]} points
   * @param {T_Point} point
   * @returns {T}
   */
  find(points, point) {
    const index = this.findIndex(points, point);
    return index === -1 ? null : points[index];
  }

  /**
   * @param {T_Rect} rect 
   * @returns {T_Point[]}
   */
  getPointsArray(rect) {
    const nRect = this.getNormalizedRect(rect);
    const points = [];

    for (let y = nRect[0].y; y <= nRect[1].y; y++) {
      for (let x = nRect[0].x; x <= nRect[1].x; x++) {
        points.push({ x, y });
      }
    }
    return points;
  }

  /**
   * @param {T_Point[]} points 
   * @returns {T_BorderPoint[]}
   */
  getBorderArray(points) {
    points = JSON.parse(JSON.stringify(points));
    const index = this.getPointsToObject(points);

    for (const point of points) {
      point.border = {
        top: index[point.x + '_' + (point.y - 1)] === undefined,
        left: index[(point.x - 1) + '_' + point.y] === undefined,
        right: index[(point.x + 1) + '_' + point.y] === undefined,
        bottom: index[point.x+ '_' + (point.y + 1)] === undefined,
      };
    }
    return points;
  }

  /**
   * @param {T_Point[]} points 
   * @returns {Object<string, T_Point>}
   */
  getPointsToObject(points) {
    const object = {};
    for (const point of points) {
      object[point.x + '_' + point.y] = point;
    }
    return object;
  }

  /**
   * @param {Object[]} items 
   * @returns {Object[]}
   */
  removePrivateProps(items) {
    return items.map(v => {
      const item = {};
      for (const field in v) {
        if (field.startsWith('_')) continue;
        item[field] = v[field];
      }
      return item;
    });
  }

  /**
   * @param {Object[]} items 
   * @param {Object} props 
   * @returns {Object[]}
   */
  addPrivateProps(items, props) {
    return items.map(v => {
      return {...v, ...props};
    });
  }

}