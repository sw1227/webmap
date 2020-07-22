import React, { useEffect, useState } from 'react';

import { LatLon, Point } from '../common/geo';
import SimpleMap from '../common/map2D';


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
  const [map, setMap] = useState();

  // Callback functions
  const incrementZoom = () => {
    if (zoom < mapConfig.zoomMax) setZoom(z => z + 1);
  };
  const decrementZoom = () => {
    if (zoom > mapConfig.zoomMin) setZoom(z => z - 1);
  };
  const shiftPosition = (x, y) => () => {
    setPosition(new Point(position.shift(x, y, zoom)));
  };

  // Create map instance when elements are loaded
  useEffect(() => {
    setMap(new SimpleMap("#map", mapConfig.size, position, zoom));
  }, []);

  // Draw
  useEffect(() => {
    if (typeof map !== "undefined") {
      map.draw(position, zoom);
    }
  }, [zoom, position, map], () => { if (map) map.destroy() });

  return (
    <div>
      <canvas id="map" width={`${mapConfig.size.width}px`} height={`${mapConfig.size.height}px`} style={{ border: "solid", margin: "20px" }} />
      <div>zoom = {zoom}</div>
      <button onClick={incrementZoom}>+</button>
      <button onClick={decrementZoom}>-</button>
      <br />
      <button onClick={shiftPosition(-100, 0)}>←</button>
      <button onClick={shiftPosition(+100, 0)}>→</button>
      <button onClick={shiftPosition(0, -100)}>↑</button>
      <button onClick={shiftPosition(0, +100)}>↓</button>
    </div>
  );
}
