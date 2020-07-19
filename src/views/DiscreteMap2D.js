import React, { useEffect, useState } from 'react';

import { LatLon, PixelCoord, Point } from '../common/geo';


export default function DiscreteMap2D() {
  // Map config
  const mapConfig = {
    zoomMax: 15,
    zoomMin: 2,
    initialZoom: 10,
    size: {
      width: 600,
      height: 400
    }
  };

  // State: zoom level, left upper pixel cooridnate
  const nabewari = new LatLon(35.4389735, 139.1375592);
  const [position, setPosition] = useState(new Point(nabewari, mapConfig.zoomMax));
  const [zoom, setZoom] = useState(mapConfig.initialZoom);

  useEffect(() => {
    // North West
    const nw = position.getPixel(zoom);
    // South East
    const se = new PixelCoord(
      nw.x + mapConfig.size.width,
      nw.y + mapConfig.size.height,
      nw.z
    )
    console.log("NW", nw.getTile(), nw.getPixelInTile());
    console.log("SE", se.getTile(), se.getPixelInTile());
    // TODO: Get list of tiles and their positions for drawing
  }, [zoom, position])

  return (
    <div>
      <canvas id="map" width={`${mapConfig.size.width}px`} height={`${mapConfig.size.height}px`} style={{ border: "solid", margin: "20px" }} />
      <div>zoom = {zoom}</div>
      <button onClick={() => { if (zoom < mapConfig.zoomMax) setZoom(z => z + 1) }}>+</button>
      <button onClick={() => { if (zoom > mapConfig.zoomMin) setZoom(z => z - 1) }}>-</button>
      <br />
      <button onClick={() => { setPosition(new Point(position.shift(100, 0, zoom))) }}>→</button>
      <button onClick={() => { setPosition(new Point(position.shift(-100, 0, zoom))) }}>←</button>
      <button onClick={() => { setPosition(new Point(position.shift(0, 100, zoom))) }}>↑</button>
      <button onClick={() => { setPosition(new Point(position.shift(0, -100, zoom))) }}>↓</button>
    </div>
  );
}
