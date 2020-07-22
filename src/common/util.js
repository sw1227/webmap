
// Load image bitmap for texture
export function loadImage(imageSource) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSource;
    image.onload = async () => {
      const bitmap = await createImageBitmap(image);
      resolve(bitmap);
    };
  });
};
