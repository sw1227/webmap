import MathUtil from './math';


/** Class representing a (Latitude, Longitude) pair */
export class LatLon {
  /**
   * Create a (lat, lon) pair.
   * @param {number} lat - latitude [deg]: must be in [-90, 90]
   * @param {number} lon - longitude [deg]: automatically normalized to [-180, +180)
   */
  constructor(lat, lon) {
    this.lat = lat;
    this.lon = this.constructor.normalizeLon(lon);
  }

  /**
   * Normalize longitude to [-180, +180)
   * @param {number} deg - longitude [deg]
   * @return {number} Normalized longitude
   */
  static normalizeLon(deg) {
    return deg - 360 * Math.floor((deg + 180) / 360);
  }
}


/** Class representing a tile coordinate */
export class TileCoord {
  constructor(z, x, y) {
    this.z = z;
    this.x = x;
    this.y = y;
  }
}


/** Class representing a pixel coordinate */
export class PixelCoord {
  /**
   * Create a pixel coordinate with integer values
   * @param {number} px - pixel x
   * @param {number} py - pixel y
   * @param {number} z - zoom level
   */
  constructor(px, py, z) {
    this.x = Math.round(px);
    this.y = Math.round(py);
    this.z = z;
  }

  /**
   * Get tile coordinate that contains this pixel coordinate
   * @return {TileCoord} Tile coordinate {z, x, y}
   */
  getTile() {
    const tx = Math.floor(this.x / 256);
    const ty = Math.floor(this.y / 256);
    return new TileCoord(this.z, tx, ty);
  }

  /**
   * Get pixel index in the tile containing this pixel coordinate
   * @return {{x: number, y: number}} pixel index in range [0, 255]
   */
  getPixelInTile() {
    return {
      x: this.x % 256,
      y: this.y % 256
    };
  }
}


/** Class representing a point on map */
export class Point {
  /**
   * Create a point
   * @param {(LatLon|Point)} coord - Specify position by LatLon or Point class
   * @param {number} zoomMax - Maximum zoom level. if coord is Point, this is ignored and coord's value is used.
   */
  constructor(coord, zoomMax=20) {
    // Position identifier: pixel coordinate at zoom = zoomMax
    // Number.MAX_SAFE_INTEGER is large enough (2^53 - 1)
    if (coord instanceof LatLon) {
      this.zoomMax = zoomMax;
      this.position = this.constructor.latlonToPixel(coord, zoomMax);
    }
    if (coord instanceof Point) {
      this.zoomMax = coord.zoomMax;
      this.position = coord.position;
    }
  }

  /**
   * Convert (lat, lon) to pixel coordinate at given zoom level
   * @param {LatLon} latlon - latitude / longitude
   * @param {number} zoom - zoom loevel
   * @return {PixelCoord} Pixel coordinate at given zoom level
   */
  static latlonToPixel(latlon, zoom) {
    const L = 85.05112878;
    // latlon.lon is normalized in [-180, +180)
    const x = (1 << (zoom + 7)) * (latlon.lon / 180 + 1);
    const y = (1 << (zoom + 7)) / Math.PI * (
      - Math.atanh(Math.sin(MathUtil.deg2rad(latlon.lat))) + Math.atanh(Math.sin(MathUtil.deg2rad(L)))
    );
    return new PixelCoord(x, y, zoom);
  }

  /**
   * Get pixel coordinate of this point at given zoom level
   * @param {number} zoom - zoom level
   * @return {PixelCoord} - pixel coordinate of this point
   */
  getPixel(zoom) {
    // x -> floor(x/2), y -> floor(y/2) as zoom level decrementszoom
    const zoomDiff = this.zoomMax - zoom;
    const shifted = new PixelCoord(
      this.position.x >> zoomDiff,
      this.position.y >> zoomDiff,
      zoom
    );
    return shifted;
  }

  /**
   * Shift this pointt (x, y) pixels at given zoom level
   * @param {*} x - Shift amount x [pixels] at zoom
   * @param {*} y - Shift amount y [pixels] at zoom
   * @param {*} zoom - shift (x, y) is executed at this zoom level
   * @return {Point} Shifted Point (this)
   */
  shift(x, y, zoom) {
    // Scale (x, y) to the pixels at zoom = zoomMax
    const zoomDiff = this.zoomMax - zoom;
    this.position = new PixelCoord(
      this.position.x + (x << zoomDiff),
      this.position.y + (y << zoomDiff),
      this.zoomMax
    )
    return this;
  }
}