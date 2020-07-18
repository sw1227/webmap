import React, { useEffect, useReducer } from 'react';


const zoomMin = 2;
const zoomMax = 15;
const zoomDelta = 1 / 120;


const reducer = (state, action) => {
  switch (action.type) {
    case "zoomdelta":
      const newZoom = state.zoom + action.payload;
      return {
        zoom: Math.min(zoomMax, Math.max(zoomMin, newZoom))
      };
  }
};


export default function Map2D() {
  // State: zoom level
  const [state, dispatch] = useReducer(reducer, {
    zoom: 10
  });

  // Event listener for mouse wheel
  const handleWheel = event => {
    event.preventDefault(); // Do not scroll

    // Get wheel info. x,y: pixels in the element
    const [x, y, delta] = [event.offsetX, event.offsetY, event.wheelDelta];
    dispatch({type: "zoomdelta", payload: delta * zoomDelta});
  };

  // Register event listener
  useEffect(() => {
    const map = document.getElementById("map");
    map.addEventListener("wheel", handleWheel);
  }, []);

  return (
    <div>
      <canvas id="map" width="600px" height="400px" style={{ border: "solid", margin: "20px" }} />
      <div>zoom = {state.zoom}</div>
    </div>
  );
}
