import createRegl from "regl";

import { loadImage } from "../common/util";
import { PixelCoord, Point, TileCoord } from '../common/geo';

/* eslint import/no-webpack-loader-syntax: off */
import vert from "!raw-loader!../glsl/quad.vert";
import frag from "!raw-loader!../glsl/quad.frag";

const tileUrl = tile => (
  `https://cyberjapandata.gsi.go.jp/xyz/std/${tile.z}/${tile.x}/${tile.y}.png`
);


/** Class for WebGL map */
export default class SimpleMap {
  /**
   * Create map instance for given element
   * @param {string} selector - CSS selector of canvas element
   */
  constructor(selector) {
    const elem = document.querySelector(selector);
    this.width = elem.width;
    this.height = elem.height;
    this.regl = createRegl(selector);
  }

  /**
   * Clean up regl
   */
  destroy() {
    this.regl.destroy();
  }

  /**
   * Get regl (WebGL) command for map drawing
   */
  getCommand() {
    const regl = this.regl;
    const xSize = 256 / this.width;
    const ySize = 256 / this.height;

    return regl({
      vert: vert,
      frag: frag,
      attributes: {
        tex: [[0, 0], [1, 0], [0, 1], [0, 1], [1, 0], [1, 1]],
        position: [
          [0, 1], [xSize, 1], [0, 1 - ySize],
          [0, 1 - ySize], [xSize, 1], [xSize, 1 - ySize]
        ]
      },
      uniforms: {
        mapTexture: regl.prop("texture"),
        offsetX: regl.prop("offset.x"),
        offsetY: regl.prop("offset.y"),
      },
      count: 6
    });
  }

  /**
   * Calculate tile coordinates and offsets of all the tiles
   * @param {Point} position - Position of North-West pixel
   * @param {number} zoom - zoom level
   */
  calculateTilesInView(position, zoom) {
    // Calculate boundary information of current position & zoom
    const nw = position.getPixel(zoom); // North West
    const se = new PixelCoord( // South East
      nw.x + this.width - 1,
      nw.y + this.height - 1,
      nw.z
    );
    const nwTile = nw.getTile(); // Tile coordinate of North-West
    const seTile = se.getTile(); // Tile coordinate of South-East
    const nwOffset = nw.getPixelInTile(); // Pixel offset of North-West tile

    // List all tiles in the current view
    const tiles = []
    for (let x = nwTile.x; x <= seTile.x; x++) {
      for (let y = nwTile.y; y <= seTile.y; y++) {
        // Push tile coordinate and start postition (left upper)
        tiles.push({
          tile: new TileCoord(zoom, x, y),
          start: {
            x: 256 * (x - nwTile.x) - nwOffset.x,
            y: 256 * (y - nwTile.y) - nwOffset.y
          }
        });
      }
    }

    return tiles;
  }

  /**
   * Draw map with WebGL given the map state
   * @param {Point} position - Position of North-West pixel
   * @param {number} zoom - zoom level
   */
  async draw(position, zoom) {
    // Get list of all the tiles contained in the current view
    const tiles = this.calculateTilesInView(position, zoom);
    const images = await Promise.all(tiles.map(tile => loadImage(tileUrl(tile.tile))));

    const tileList = [];
    for (let i = 0; i < tiles.length; i++) {
      const img = images[i];
      const tile = tiles[i];
      const offset = {
        x: tile.start.x / this.width,
        y: tile.start.y / this.height
      };
      tileList.push({ image: img, offset: offset });
    }

    // TODO: Compile shader every time? draw in Promise.all?
    const draw = this.getCommand()
    draw(tileList.map(t => ({ ...t, texture: this.regl.texture(t.image) })));
  }
}
