import * as THREE from "three";

function canvasTexture(width: number, height: number, draw: (context: CanvasRenderingContext2D) => void, color = true) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext("2d")!);
  const texture = new THREE.CanvasTexture(canvas);
  if (color) texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

export function createContainerTexture() {
  return canvasTexture(256, 128, (context) => {
    context.fillStyle = "#f2f2f2";
    context.fillRect(0, 0, 256, 128);
    for (let x = 6; x < 250; x += 8) {
      context.fillStyle = "#d4d4d4";
      context.fillRect(x, 6, 3, 116);
      context.fillStyle = "#ffffff";
      context.fillRect(x + 3, 6, 2, 116);
    }
    context.strokeStyle = "#8a8a8a";
    context.lineWidth = 6;
    context.strokeRect(3, 3, 250, 122);
    context.fillStyle = "#9a9a9a";
    context.fillRect(0, 0, 10, 10);
    context.fillRect(246, 0, 10, 10);
    context.fillRect(0, 118, 10, 10);
    context.fillRect(246, 118, 10, 10);
  });
}

export function createFacadeTextures(random: () => number, wall: string, columns: number, rows: number, litChance: number) {
  const cell = 8;
  const width = columns * cell;
  const height = rows * cell;
  const lit: boolean[] = Array.from({ length: columns * rows }, () => random() < litChance);

  const map = canvasTexture(width, height, (context) => {
    context.fillStyle = wall;
    context.fillRect(0, 0, width, height);
    lit.forEach((on, index) => {
      const x = (index % columns) * cell + 2;
      const y = Math.floor(index / columns) * cell + 2;
      context.fillStyle = on ? "#ffe3a1" : "#1d2033";
      context.fillRect(x, y, 4, 5);
    });
  });
  map.magFilter = THREE.NearestFilter;

  const emissive = canvasTexture(width, height, (context) => {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, width, height);
    lit.forEach((on, index) => {
      if (!on) return;
      const x = (index % columns) * cell + 2;
      const y = Math.floor(index / columns) * cell + 2;
      context.fillStyle = random() < 0.7 ? "#ffd27a" : "#fff1c9";
      context.fillRect(x, y, 4, 5);
    });
  });
  emissive.magFilter = THREE.NearestFilter;

  return { map, emissive };
}

export function createFoamTexture() {
  return canvasTexture(64, 256, (context) => {
    const gradient = context.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, "rgba(255,255,255,0.9)");
    gradient.addColorStop(0.35, "rgba(255,255,255,0.35)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 256);
    context.globalCompositeOperation = "destination-in";
    const sides = context.createLinearGradient(0, 0, 64, 0);
    sides.addColorStop(0, "rgba(0,0,0,0)");
    sides.addColorStop(0.3, "rgba(0,0,0,1)");
    sides.addColorStop(0.7, "rgba(0,0,0,1)");
    sides.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = sides;
    context.fillRect(0, 0, 64, 256);
  });
}
