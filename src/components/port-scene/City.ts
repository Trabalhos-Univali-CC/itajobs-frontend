import * as THREE from "three";

import { box, glow, palette, pick, standard, strut } from "./Models";
import { createFacadeTextures } from "./Textures";

type Transform = {
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
};

class Batch {
  private items: Transform[] = [];

  constructor(
    private geometry: THREE.BufferGeometry,
    private material: THREE.Material,
  ) {}

  add(item: Transform) {
    this.items.push(item);
  }

  build() {
    const mesh = new THREE.InstancedMesh(this.geometry, this.material, Math.max(this.items.length, 1));
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const euler = new THREE.Euler();
    const color = new THREE.Color();
    this.items.forEach((item, index) => {
      quaternion.setFromEuler(euler.set(...(item.rotation ?? [0, 0, 0])));
      matrix.compose(new THREE.Vector3(...item.position), quaternion, new THREE.Vector3(...item.scale));
      mesh.setMatrixAt(index, matrix);
      if (item.color) mesh.setColorAt(index, color.set(item.color));
    });
    mesh.count = this.items.length;
    return mesh;
  }
}

function roofGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.5, 0);
  shape.lineTo(0.5, 0);
  shape.lineTo(0, 1);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false });
  geometry.translate(0, 0, -0.5);
  return geometry;
}

const houseWalls = ["#efe3cf", "#cfdbe3", "#f3e5b5", "#ddcadc", "#f4f4f4", "#c3d4b4", "#f2c9a8"];
const roofColors = ["#8f3a2c", "#74302a", "#5b5468", "#7d4a2b", "#9a4b32"];
const shopWalls = ["#f4f2ee", "#e6dfd3", "#d9dde3", "#efe7d6"];
const accentColors = [palette.yellow, palette.blue, palette.red, "#2f7d4f", palette.white];
const leafColors = ["#2f6b3a", "#3c7d45", "#285a34", "#4a8a4c"];

export function createCity(random: () => number, baseY: number) {
  const group = new THREE.Group();
  const unitBox = new THREE.BoxGeometry(1, 1, 1);

  const walls = new Batch(unitBox, standard("#ffffff", 0.85));
  const roofs = new Batch(roofGeometry(), standard("#ffffff", 0.8));
  const litWindows = new Batch(unitBox, glow("#ffd58a", 1.6));
  const darkWindows = new Batch(unitBox, standard("#1d2233", 0.2, 0.6));
  const doors = new Batch(unitBox, standard("#4a3326", 0.8));
  const storefronts = new Batch(unitBox, glow("#ffe2a6", 1.3));
  const awnings = new Batch(unitBox, standard("#ffffff", 0.6));
  const signs = new Batch(unitBox, new THREE.MeshBasicMaterial({ color: "#ffffff" }));
  const slabs = new Batch(unitBox, standard("#d9d6df", 0.8));
  const trunks = new Batch(new THREE.CylinderGeometry(0.22, 0.32, 1, 6), standard("#5a3d2b", 0.9));
  const crowns = new Batch(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ roughness: 0.9, flatShading: true }));
  const pavement = new Batch(unitBox, standard("#8d8a96", 0.95));
  const asphalt = new Batch(unitBox, standard("#23222c", 0.95));

  const tree = (x: number, z: number, size = 1) => {
    const height = (2.2 + random() * 1.4) * size;
    trunks.add({ position: [x, baseY + height / 2, z], scale: [size, height, size] });
    const radius = (2 + random() * 1.2) * size;
    crowns.add({
      position: [x, baseY + height + radius * 0.7, z],
      scale: [radius, radius * 1.2, radius],
      rotation: [0, random() * Math.PI, 0],
      color: pick(leafColors, random),
    });
  };

  const frontWindows = (x: number, z: number, width: number, height: number, floors: number, spacing: number, lit = 0.35) => {
    const columns = Math.max(1, Math.floor(width / spacing));
    for (let floor = 0; floor < floors; floor++) {
      for (let column = 0; column < columns; column++) {
        const wx = x - width / 2 + (column + 0.5) * (width / columns);
        const wy = baseY + (floor + 0.55) * (height / floors);
        const target = random() < lit ? litWindows : darkWindows;
        target.add({ position: [wx, wy, z], scale: [1.2, 1.3, 0.12] });
      }
    }
  };

  const house = (x: number, z: number) => {
    const width = 7 + random() * 3;
    const depth = 7 + random() * 3;
    const floors = random() < 0.35 ? 2 : 1;
    const height = floors * 3.2;
    walls.add({ position: [x, baseY + height / 2, z], scale: [width, height, depth], color: pick(houseWalls, random) });
    roofs.add({
      position: [x, baseY + height, z],
      scale: [width + 1.2, 2.4 + random() * 1.2, depth + 1.2],
      color: pick(roofColors, random),
    });
    const front = z + depth / 2 + 0.06;
    doors.add({ position: [x - width * 0.22, baseY + 1.1, front], scale: [1.1, 2.2, 0.12] });
    frontWindows(x + width * 0.15, front, width * 0.55, height, floors, 2.6, 0.45);
    if (random() < 0.7) tree(x + width / 2 + 2.5, z + depth / 2 + 1.5, 0.8);
  };

  const shop = (x: number, z: number, width: number) => {
    const depth = 10;
    const floors = random() < 0.45 ? 2 : 1;
    const height = 4.8 + (floors - 1) * 3.4;
    walls.add({ position: [x, baseY + height / 2, z], scale: [width, height, depth], color: pick(shopWalls, random) });
    walls.add({ position: [x, baseY + height + 0.4, z], scale: [width + 0.3, 0.8, depth + 0.3], color: "#bdb8c4" });
    const front = z + depth / 2 + 0.07;
    storefronts.add({ position: [x, baseY + 1.6, front], scale: [width * 0.82, 2.6, 0.12] });
    const accent = pick(accentColors, random);
    awnings.add({
      position: [x, baseY + 3.35, front + 0.9],
      scale: [width * 0.88, 0.18, 2],
      rotation: [0.28, 0, 0],
      color: accent,
    });
    signs.add({ position: [x, baseY + 4.25, front + 0.05], scale: [width * 0.55, 0.8, 0.2], color: accent === palette.white ? palette.yellow : accent });
    if (floors === 2) frontWindows(x, front, width * 0.8, 3.4, 1, 3, 0.5);
  };

  const facades = {
    apartment: [createFacadeTextures(random, "#d9ccb6", 6, 10, 0.4), createFacadeTextures(random, "#b7c3cc", 6, 10, 0.4)],
    office: createFacadeTextures(random, "#2c3a58", 8, 16, 0.5),
  };

  const facadeMaterial = (textures: { map: THREE.CanvasTexture; emissive: THREE.CanvasTexture }, repeatX: number, repeatY: number) => {
    const map = textures.map.clone();
    const emissive = textures.emissive.clone();
    map.repeat.set(repeatX, repeatY);
    emissive.repeat.set(repeatX, repeatY);
    map.needsUpdate = true;
    emissive.needsUpdate = true;
    return new THREE.MeshStandardMaterial({
      map,
      emissiveMap: emissive,
      emissive: "#ffffff",
      emissiveIntensity: 0.75,
      roughness: 0.6,
      envMapIntensity: 0.5,
    });
  };

  const apartment = (x: number, z: number) => {
    const width = 14 + random() * 6;
    const depth = 12 + random() * 4;
    const floors = 5 + Math.floor(random() * 5);
    const height = floors * 3;
    const textures = pick(facades.apartment, random);
    group.add(box(width, height, depth, facadeMaterial(textures, Math.round(width / 8), floors / 10), x, baseY + height / 2, z));
    for (let floor = 1; floor < floors; floor++) {
      slabs.add({ position: [x, baseY + floor * 3, z + depth / 2 + 0.7], scale: [width * 0.9, 0.25, 1.4] });
    }
    walls.add({ position: [x, baseY + height + 0.5, z], scale: [width + 0.4, 1, depth + 0.4], color: "#a9a4b3" });
    walls.add({ position: [x + width * 0.25, baseY + height + 2, z], scale: [3, 2.2, 3], color: "#7d7a88" });
    tree(x - width / 2 - 3, z + depth / 2 + 3);
  };

  const office = (x: number, z: number) => {
    const width = 16 + random() * 6;
    const depth = 16 + random() * 4;
    const height = 50 + random() * 30;
    const steel = standard("#3b3a48", 0.4, 0.6);
    group.add(box(width + 6, 7, depth + 6, standard("#c9c6d1", 0.6), x, baseY + 3.5, z));
    storefronts.add({ position: [x, baseY + 2.4, z + (depth + 6) / 2 + 0.06], scale: [width + 3, 3.6, 0.12] });
    group.add(box(width, height, depth, facadeMaterial(facades.office, Math.round(width / 10), height / 30), x, baseY + 7 + height / 2, z));
    for (let y = baseY + 19; y < baseY + 7 + height; y += 12) group.add(box(width + 0.5, 0.6, depth + 0.5, steel, x, y, z));
    const top = baseY + 7 + height;
    group.add(box(width * 0.7, 4, depth * 0.7, steel, x, top + 2, z));
    group.add(strut(new THREE.Vector3(x, top + 4, z), new THREE.Vector3(x, top + 16, z), 0.25, steel));
    group.add(box(0.7, 0.7, 0.7, glow("#ff2020", 6), x, top + 16.4, z));
  };

  const skylineFacades = [
    createFacadeTextures(random, "#2c3a58", 8, 16, 0.45),
    createFacadeTextures(random, "#24484a", 6, 16, 0.4),
    createFacadeTextures(random, "#4a3a2e", 8, 12, 0.35),
    createFacadeTextures(random, "#3a3a46", 10, 20, 0.5),
    createFacadeTextures(random, "#cfc8b8", 6, 12, 0.3),
  ];
  const towerSteel = standard("#3b3a48", 0.4, 0.6);
  const crownMetal = standard("#8e8a9c", 0.35, 0.7);
  const fins = new Batch(unitBox, standard("#d4d1db", 0.5, 0.3));

  const rooftop = (x: number, z: number, top: number, width: number, depth: number) => {
    const choice = random();
    if (choice < 0.4) {
      group.add(box(width * 0.4, 3, depth * 0.4, towerSteel, x, top + 1.5, z));
      group.add(strut(new THREE.Vector3(x, top + 3, z), new THREE.Vector3(x, top + 14 + random() * 8, z), 0.22, towerSteel));
      group.add(box(0.7, 0.7, 0.7, glow("#ff2020", 6), x, top + 22, z));
    } else if (choice < 0.7) {
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(width * 0.32, width * 0.32, 0.5, 24), towerSteel);
      pad.position.set(x, top + 0.25, z);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(width * 0.26, 0.25, 6, 32), standard(palette.yellow, 0.5));
      ring.rotation.x = Math.PI / 2;
      ring.position.set(x, top + 0.55, z);
      group.add(pad, ring);
    } else {
      group.add(box(width * 0.6, 4, depth * 0.5, towerSteel, x - width * 0.1, top + 2, z));
      group.add(box(width * 0.25, 2.5, depth * 0.25, towerSteel, x + width * 0.3, top + 1.25, z + depth * 0.2));
    }
  };

  const skylineTower = (x: number, z: number) => {
    const textures = pick(skylineFacades, random);
    const width = 16 + random() * 12;
    const depth = 14 + random() * 10;
    const height = 50 + random() * 75;
    const material = (w: number, h: number) => facadeMaterial(textures, Math.max(1, Math.round(w / 10)), h / 30);
    const kind = Math.floor(random() * 5);
    let top = baseY + height;

    if (kind === 0) {
      let y = baseY;
      [0.5, 0.3, 0.2].forEach((share, tier) => {
        const tierHeight = height * share;
        const tierWidth = width * (1 - tier * 0.2);
        const tierDepth = depth * (1 - tier * 0.2);
        group.add(box(tierWidth, tierHeight, tierDepth, material(tierWidth, tierHeight), x, y + tierHeight / 2, z));
        group.add(box(tierWidth + 0.6, 0.7, tierDepth + 0.6, towerSteel, x, y + tierHeight, z));
        y += tierHeight;
      });
      top = y;
      rooftop(x, z, top, width * 0.6, depth * 0.6);
    } else if (kind === 1) {
      const radius = width / 2;
      const side = facadeMaterial(textures, Math.max(2, Math.round((Math.PI * width) / 10)), height / 30);
      const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 24), [side, towerSteel, towerSteel]);
      cylinder.position.set(x, baseY + height / 2, z);
      group.add(cylinder);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.7, radius, 5, 24), crownMetal);
      cap.position.set(x, top + 2.5, z);
      group.add(cap);
      top += 5;
      rooftop(x, z, top, width * 0.6, width * 0.6);
    } else if (kind === 2) {
      const slabDepth = depth * 0.65;
      group.add(box(width, height, slabDepth, material(width, height), x, baseY + height / 2, z));
      for (let fx = x - width / 2 + 1.2; fx < x + width / 2; fx += 2.6) {
        fins.add({ position: [fx, baseY + height / 2, z + slabDepth / 2 + 0.45], scale: [0.35, height, 0.9] });
      }
      rooftop(x, z, top, width, slabDepth);
    } else if (kind === 3) {
      const towerWidth = width * 0.45;
      const tallest = height;
      const shorter = height * (0.75 + random() * 0.2);
      group.add(box(towerWidth, tallest, depth, material(towerWidth, tallest), x - width * 0.3, baseY + tallest / 2, z));
      group.add(box(towerWidth, shorter, depth, material(towerWidth, shorter), x + width * 0.3, baseY + shorter / 2, z));
      group.add(box(width * 0.2, 4, depth * 0.5, glow("#ffe2a6", 1.1), x, baseY + shorter * 0.7, z));
      rooftop(x - width * 0.3, z, baseY + tallest, towerWidth, depth);
    } else {
      group.add(box(width, height, depth, material(width, height), x, baseY + height / 2, z));
      const crown = new THREE.Mesh(roofGeometry(), crownMetal);
      crown.scale.set(width, 10 + random() * 8, depth);
      crown.position.set(x, top, z);
      group.add(crown);
      group.add(box(0.6, 0.6, 0.6, glow("#ff2020", 6), x, top + crown.scale.y + 0.6, z));
    }
  };

  for (let x = -380; x <= 380; x += 26 + random() * 14) {
    skylineTower(x, -262 - random() * 70);
  }

  for (let x = -330; x <= 330; x += 15 + random() * 3) {
    if (random() < 0.12) continue;
    shop(x, -68, 11 + random() * 3);
  }
  pavement.add({ position: [0, baseY + 0.08, -60.5], scale: [700, 0.16, 5] });
  asphalt.add({ position: [0, baseY + 0.05, -79], scale: [700, 0.1, 8] });

  const officeSlots = new Set([-1, 0, 1, 3]);
  const blockSize = 44;
  const rows = [-104, -156, -208];
  rows.forEach((rowZ, row) => {
    asphalt.add({ position: [0, baseY + 0.05, rowZ - blockSize / 2 - 4], scale: [700, 0.1, 8] });
    for (let column = -6; column <= 6; column++) {
      const x = column * (blockSize + 8);
      if (row === 0) asphalt.add({ position: [x + blockSize / 2 + 4, baseY + 0.05, -130], scale: [8, 0.1, 160] });
      if (row === 0 && officeSlots.has(column)) {
        office(x, rowZ);
        continue;
      }
      const apartmentChance = row === 0 ? 0.55 : row === 1 ? 0.25 : 0.08;
      if (random() < apartmentChance) {
        apartment(x - 9, rowZ + 6);
        if (random() < 0.5) apartment(x + 11, rowZ - 8);
        else tree(x + 12, rowZ - 6, 1.2);
        continue;
      }
      for (const dx of [-14, 0, 14]) {
        for (const dz of [-13, 3]) {
          if (random() < 0.15) tree(x + dx, rowZ + dz, 1.1);
          else house(x + dx, rowZ + dz);
        }
      }
    }
  });

  const hills = standard("#33503f", 0.95);
  hills.flatShading = true;
  [
    [-260, -360, 180, 60, 90],
    [-40, -400, 220, 85, 110],
    [210, -370, 200, 55, 95],
    [420, -420, 220, 75, 110],
  ].forEach(([x, z, sx, sy, sz]) => {
    const hill = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), hills);
    hill.scale.set(sx, sy, sz);
    hill.position.set(x, baseY - 4, z);
    group.add(hill);
  });

  for (const batch of [walls, roofs, litWindows, darkWindows, doors, storefronts, awnings, signs, slabs, fins, trunks, crowns, pavement, asphalt]) {
    group.add(batch.build());
  }
  return group;
}
