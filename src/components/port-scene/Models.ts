import * as THREE from "three";

import { createContainerTexture, createFacadeTextures, createFoamTexture } from "./Textures";

export const palette = {
  yellow: "#f5cf0f",
  blue: "#3d22b8",
  purple: "#280773",
  silver: "#c2c2c2",
  red: "#d9261c",
  white: "#f1f0f6",
  dark: "#1d1a2b",
  steel: "#4a4a58",
  asphalt: "#26252f",
  concrete: "#6d6b7a",
  orange: "#ff7a1a",
};

export const containerColors = [palette.yellow, palette.blue, palette.silver, palette.red, palette.white, "#2f7d4f"];

export function createRandom(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(items: readonly T[], random: () => number) {
  return items[Math.floor(random() * items.length)];
}

export function standard(color: string, roughness = 0.6, metalness = 0.1) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

export function glow(color: string, intensity = 2.5) {
  return new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity });
}

export function box(width: number, height: number, depth: number, material: THREE.Material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.position.set(x, y, z);
  return mesh;
}

export function strut(from: THREE.Vector3, to: THREE.Vector3, radius: number, material: THREE.Material) {
  const direction = new THREE.Vector3().subVectors(to, from);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, direction.length(), 6), material);
  mesh.position.copy(from).addScaledVector(direction, 0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return mesh;
}

const containerTexture = { current: null as THREE.CanvasTexture | null };
const foamTexture = { current: null as THREE.CanvasTexture | null };

function containerMaterial() {
  containerTexture.current ??= createContainerTexture();
  return new THREE.MeshStandardMaterial({ map: containerTexture.current, roughness: 0.55, metalness: 0.25 });
}

export function resetSharedTextures() {
  containerTexture.current?.dispose();
  foamTexture.current?.dispose();
  containerTexture.current = null;
  foamTexture.current = null;
}

type Placement = { x: number; y: number; z: number; color: string; rotated?: boolean };

export function containerBlock(placements: Placement[]) {
  const geometry = new THREE.BoxGeometry(6.06, 2.59, 2.44);
  const mesh = new THREE.InstancedMesh(geometry, containerMaterial(), Math.max(placements.length, 1));
  const matrix = new THREE.Matrix4();
  const rotation = new THREE.Matrix4().makeRotationY(Math.PI / 2);
  const color = new THREE.Color();
  placements.forEach((placement, index) => {
    matrix.makeTranslation(placement.x, placement.y, placement.z);
    if (placement.rotated) matrix.multiply(rotation);
    mesh.setMatrixAt(index, matrix);
    mesh.setColorAt(index, color.set(placement.color));
  });
  mesh.count = placements.length;
  return mesh;
}

export function createContainerYard(random: () => number, fromX: number, toX: number, rows: number[], baseY: number) {
  const placements: Placement[] = [];
  for (let x = fromX; x <= toX; x += 6.5) {
    if (random() < 0.12) continue;
    const blockColor = pick(containerColors, random);
    for (const z of rows) {
      const tiers = 1 + Math.floor(random() * 4);
      for (let tier = 0; tier < tiers; tier++) {
        placements.push({
          x,
          y: baseY + 1.3 + tier * 2.62,
          z,
          color: random() < 0.55 ? blockColor : pick(containerColors, random),
        });
      }
    }
  }
  return containerBlock(placements);
}

function hullShape(length: number, beam: number, bowLength: number) {
  const half = length / 2;
  const b = beam / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-half + 2, -b);
  shape.lineTo(half - bowLength, -b);
  shape.quadraticCurveTo(half - bowLength * 0.2, -b, half, 0);
  shape.quadraticCurveTo(half - bowLength * 0.2, b, half - bowLength, b);
  shape.lineTo(-half + 2, b);
  shape.quadraticCurveTo(-half, b, -half, b - 2);
  shape.lineTo(-half, -b + 2);
  shape.quadraticCurveTo(-half, -b, -half + 2, -b);
  return shape;
}

function extrudeUp(shape: THREE.Shape, depth: number, scale = 1) {
  const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 14 });
  geometry.rotateX(-Math.PI / 2);
  geometry.scale(scale, 1, scale);
  return geometry;
}

function wake(length: number, width: number) {
  foamTexture.current ??= createFoamTexture();
  const material = new THREE.MeshBasicMaterial({
    map: foamTexture.current,
    transparent: true,
    depthWrite: false,
    opacity: 0.55,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, length), material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.rotation.z = -Math.PI / 2;
  mesh.userData.noShadow = true;
  return mesh;
}

export function createCargoShip(random: () => number, hullColor: string, length: number, moving: boolean) {
  const group = new THREE.Group();
  const beam = Math.max(11, length * 0.16);
  const height = 6;
  const half = length / 2;
  const bowLength = beam * 1.5;
  const shape = hullShape(length, beam, bowLength);

  group.add(new THREE.Mesh(extrudeUp(shape, height), standard(hullColor, 0.45, 0.2)));
  group.add(new THREE.Mesh(extrudeUp(shape, 2.6, 1.012), standard(palette.red, 0.6)));
  const band = new THREE.Mesh(extrudeUp(shape, 0.35, 1.012), standard(palette.white, 0.5));
  band.position.y = height - 0.35;
  group.add(band);
  const deck = new THREE.Mesh(extrudeUp(shape, 0.12, 0.97), standard("#3b3a48", 0.85));
  deck.position.y = height;
  group.add(deck);

  const steel = standard(palette.steel, 0.5, 0.4);
  const hatch = standard("#2f3d3a", 0.7);
  const placements: Placement[] = [];
  const rowsAcross = Math.floor((beam - 1.5) / 2.5);
  const firstBay = -half + 24;
  const lastBay = half - bowLength - 2;
  let bayIndex = 0;
  for (let x = firstBay; x <= lastBay; x += 6.7) {
    group.add(box(6.4, 0.5, beam * 0.86, hatch, x, height + 0.25, 0));
    if (bayIndex % 2 === 1) group.add(box(0.4, 5.5, beam * 0.9, steel, x - 3.35, height + 2.75, 0));
    const profile = 2 + Math.floor(random() * 3);
    for (let row = 0; row < rowsAcross; row++) {
      const z = (row - (rowsAcross - 1) / 2) * 2.5;
      const edge = row === 0 || row === rowsAcross - 1 ? 1 : 0;
      const tiers = Math.max(1, profile - edge - (random() < 0.2 ? 1 : 0));
      for (let tier = 0; tier < tiers; tier++) {
        placements.push({ x, y: height + 0.5 + 1.3 + tier * 2.62, z, color: pick(containerColors, random) });
      }
    }
    bayIndex++;
  }
  group.add(containerBlock(placements));

  const facade = createFacadeTextures(random, "#f4f3f8", 6, 2, 0.45);
  const houseMaterial = new THREE.MeshStandardMaterial({
    map: facade.map,
    emissiveMap: facade.emissive,
    emissive: "#ffffff",
    emissiveIntensity: 1.4,
    roughness: 0.5,
  });
  const houseX = -half + 12;
  const levels = 4;
  for (let level = 0; level < levels; level++) {
    const levelWidth = beam * (0.78 - level * 0.03);
    group.add(box(9, 2.6, levelWidth, houseMaterial, houseX, height + 1.3 + level * 2.6, 0));
  }
  const bridgeY = height + levels * 2.6 + 1.4;
  group.add(box(7.5, 2.8, beam * 1.04, standard(palette.white, 0.45), houseX + 0.5, bridgeY, 0));
  group.add(box(7.6, 1, beam * 1.05, glow("#2a3550", 0.3), houseX + 0.6, bridgeY + 0.3, 0));
  group.add(box(0.5, 6, 0.5, steel, houseX - 1, bridgeY + 4.4, 0));
  group.add(box(0.4, 0.4, 4, steel, houseX - 1, bridgeY + 6.4, 0));
  group.add(box(0.5, 0.5, 0.5, glow("#ffffff", 4), houseX - 1, bridgeY + 7.6, 0));

  const funnelX = -half + 5.5;
  group.add(box(4.2, 8, 3.6, standard(hullColor, 0.5), funnelX, height + 4, 0));
  group.add(box(4.3, 1.4, 3.7, standard(palette.yellow, 0.4), funnelX, height + 6.2, 0));
  group.add(box(4.3, 0.8, 3.7, standard("#111018", 0.8), funnelX, height + 8.2, 0));

  const lifeboat = new THREE.CapsuleGeometry(0.9, 3.4, 4, 10);
  lifeboat.rotateZ(Math.PI / 2);
  for (const side of [-1, 1]) {
    const boat = new THREE.Mesh(lifeboat, standard(palette.orange, 0.5));
    boat.position.set(houseX, height + 5.6, side * (beam * 0.45));
    group.add(boat);
    group.add(box(0.3, 0.3, 0.3, glow(side === 1 ? "#ff3030" : "#30ff6a", 5), houseX + 0.5, bridgeY + 0.6, side * beam * 0.53));
  }

  const mastX = half - bowLength * 0.55;
  group.add(box(0.5, 9, 0.5, steel, mastX, height + 4.5, 0));
  group.add(box(0.45, 0.45, 0.45, glow("#ffffff", 4), mastX, height + 9.2, 0));
  group.add(box(beam * 0.8, 1.2, 0.3, steel, half - bowLength * 0.35, height + 0.6, 0));

  if (moving) {
    const trail = wake(length * 1.1, beam * 1.6);
    trail.position.set(-half - length * 0.5, 2.05, 0);
    group.add(trail);
  }

  group.position.y = -2;
  return group;
}

export function createTugboat() {
  const group = new THREE.Group();
  const shape = hullShape(13, 5, 3.5);
  group.add(new THREE.Mesh(extrudeUp(shape, 2.8), standard(palette.red, 0.45)));
  group.add(new THREE.Mesh(extrudeUp(shape, 0.9, 1.06), standard("#111018", 0.9)));
  const white = standard(palette.white, 0.45);
  group.add(box(4.6, 2.2, 3.6, white, -0.6, 3.9, 0));
  group.add(box(3.4, 1.8, 3.4, white, 0, 5.9, 0));
  group.add(box(3.5, 0.7, 3.5, glow("#2a3550", 0.3), 0, 6.2, 0));
  group.add(box(0.9, 2.4, 0.9, standard(palette.yellow, 0.4), -2.4, 5.2, 0));
  group.add(box(0.3, 3, 0.3, standard(palette.steel), 0, 8.2, 0));
  group.add(box(0.3, 0.3, 0.3, glow("#ffffff", 4), 0, 9.8, 0));
  const trail = wake(18, 5);
  trail.position.set(-14, 0.85, 0);
  group.add(trail);
  group.position.y = -0.8;
  return group;
}

export function createTruck(cabColor: string, cargoColor: string) {
  const group = new THREE.Group();
  const dark = standard("#141320", 0.8);
  group.add(box(12, 0.45, 2.2, dark, -0.6, 0.85, 0));
  group.add(box(2.6, 2.6, 2.5, standard(cabColor, 0.4, 0.3), 4.6, 2.2, 0));
  group.add(box(0.12, 1.1, 2.2, glow("#2a3550", 0.3), 5.95, 2.75, 0));
  group.add(box(0.12, 0.7, 1.6, standard("#2b2b35", 0.6, 0.6), 5.95, 1.3, 0));
  group.add(box(0.15, 0.3, 0.5, glow("#fff4d6", 5), 5.98, 1.25, -0.85));
  group.add(box(0.15, 0.3, 0.5, glow("#fff4d6", 5), 5.98, 1.25, 0.85));
  group.add(box(0.12, 0.3, 0.4, glow("#ff2a2a", 4), -6.65, 1.2, -0.9));
  group.add(box(0.12, 0.3, 0.4, glow("#ff2a2a", 4), -6.65, 1.2, 0.9));
  group.add(box(0.3, 0.6, 0.12, dark, 5.4, 3, -1.4));
  group.add(box(0.3, 0.6, 0.12, dark, 5.4, 3, 1.4));

  const cargo = containerBlock([{ x: -1.3, y: 2.4, z: 0, color: cargoColor }]);
  cargo.scale.set(1.25, 1, 1);
  group.add(cargo);

  const wheelGeometry = new THREE.CylinderGeometry(0.55, 0.55, 0.45, 14);
  wheelGeometry.rotateX(Math.PI / 2);
  const wheelMaterial = standard("#0d0d12", 0.9);
  for (const x of [-5.4, -4.2, -3, 3.2, 4.9]) {
    for (const z of [-1.1, 1.1]) {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.position.set(x, 0.55, z);
      group.add(wheel);
    }
  }
  return group;
}

export function createCrane() {
  const group = new THREE.Group();
  const yellow = standard(palette.yellow, 0.45, 0.35);
  const steel = standard(palette.steel, 0.5, 0.5);
  const white = standard(palette.white, 0.5);

  for (const x of [-6, 6]) {
    for (const z of [-8, 8]) {
      group.add(box(1.3, 22, 1.3, yellow, x, 11, z));
      group.add(box(2.2, 1, 3, steel, x, 0.5, z));
    }
    group.add(box(1.4, 1.4, 17.4, yellow, x, 20.5, 0));
    group.add(box(1, 1, 17, yellow, x, 6, 0));
    group.add(strut(new THREE.Vector3(x, 6, -8), new THREE.Vector3(x, 20, 8), 0.35, yellow));
    group.add(strut(new THREE.Vector3(x, 6, 8), new THREE.Vector3(x, 20, -8), 0.35, yellow));
  }
  for (const z of [-8, 8]) group.add(box(13.4, 1.4, 1.4, yellow, 0, 20.5, z));

  for (const x of [-1.7, 1.7]) group.add(box(1, 2.2, 72, yellow, x, 23.4, 12));
  for (let z = -22; z <= 46; z += 6) group.add(box(4.4, 0.4, 0.5, yellow, 0, 22.5, z));

  const apex = new THREE.Vector3(0, 36, -6);
  for (const x of [-5.5, 5.5]) group.add(strut(new THREE.Vector3(x, 21, -12), apex, 0.45, yellow));
  for (const x of [-5.5, 5.5]) group.add(strut(new THREE.Vector3(x, 21, 2), apex, 0.45, yellow));
  for (const x of [-1.7, 1.7]) {
    group.add(strut(apex, new THREE.Vector3(x, 24.5, 44), 0.12, steel));
    group.add(strut(apex, new THREE.Vector3(x, 24.5, 22), 0.12, steel));
    group.add(strut(apex, new THREE.Vector3(x, 24.5, -21), 0.12, steel));
  }
  const beacon = box(0.8, 0.8, 0.8, glow("#ff2020", 6), 0, 36.8, -6);
  group.add(beacon);

  group.add(box(6, 4, 9, white, 0, 26.5, -16));
  group.add(box(6.1, 1, 9.1, glow("#2a3550", 0.3), 0, 27.3, -16));

  const trolley = new THREE.Group();
  trolley.add(box(4.6, 1.2, 4, steel, 0, 22, 0));
  trolley.add(box(2.4, 2.2, 2.6, white, -1.2, 20.2, 0));
  trolley.add(box(2.5, 0.9, 2.7, glow("#2a3550", 0.3), -1.2, 20.4, 0));
  const cable = box(0.18, 1, 0.18, steel);
  const spreader = new THREE.Group();
  spreader.add(box(2.8, 0.5, 6.6, steel, 0, 0, 0));
  spreader.add(containerBlock([{ x: 0, y: -1.6, z: 0, color: palette.blue, rotated: true }]));
  group.add(trolley, cable, spreader);

  return { group, trolley, cable, spreader, beacon };
}
