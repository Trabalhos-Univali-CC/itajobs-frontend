import * as THREE from "three";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import { Water } from "three/examples/jsm/objects/Water.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

import { createCity } from "./City";
import {
  box,
  createCargoShip,
  createContainerYard,
  createCrane,
  createRandom,
  createTruck,
  createTugboat,
  glow,
  palette,
  resetSharedTextures,
  standard,
} from "./Models";

type Mover = {
  object: THREE.Object3D;
  start: number;
  speed: number;
  min: number;
  max: number;
  bob: number;
  baseY: number;
};

const wrap = (value: number, min: number, max: number) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

export function createPortScene(canvas: HTMLCanvasElement, { animate }: { animate: boolean }) {
  const random = createRandom(11);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  const pixelRatio = Math.min(window.devicePixelRatio, 1.25);
  renderer.setPixelRatio(pixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.44;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 1, 20000);
  const target = new THREE.Vector3(0, 0, 4);

  const sunDirection = new THREE.Vector3().setFromSphericalCoords(
    1,
    THREE.MathUtils.degToRad(84),
    THREE.MathUtils.degToRad(235),
  );

  const sky = new Sky();
  sky.scale.setScalar(10000);
  const skyUniforms = sky.material.uniforms;
  skyUniforms.turbidity.value = 4;
  skyUniforms.rayleigh.value = 1.6;
  skyUniforms.mieCoefficient.value = 0.0022;
  skyUniforms.mieDirectionalG.value = 0.76;
  skyUniforms.sunPosition.value.copy(sunDirection);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const environmentScene = new THREE.Scene();
  environmentScene.add(sky);
  const environment = pmrem.fromScene(environmentScene);
  scene.add(sky);
  scene.environment = environment.texture;

  const sun = new THREE.DirectionalLight("#ffd6a0", 1.8);
  sun.position.set(-260, 210, -150);
  sun.target.position.set(0, 0, -10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -280, right: 280, top: 220, bottom: -220, near: 10, far: 900 });
  sun.shadow.camera.updateProjectionMatrix();
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.6;
  scene.add(sun, sun.target);
  scene.add(new THREE.HemisphereLight("#9fb2ff", "#241b3a", 0.6));

  const waterNormals = new THREE.TextureLoader().load("/textures/waternormals.jpg", (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    if (!animate) render(0);
  });
  const water = new Water(new THREE.PlaneGeometry(6000, 6000), {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals,
    sunDirection: sunDirection.clone(),
    sunColor: 0x9c8466,
    waterColor: 0x101a4a,
    distortionScale: 2.4,
  });
  water.rotation.x = -Math.PI / 2;
  water.material.uniforms.size.value = 1.6;
  scene.add(water);

  const concrete = standard(palette.concrete, 0.9);
  scene.add(box(1600, 3, 46, concrete, 0, 1.5, -33));
  scene.add(box(1600, 3.4, 1.2, standard("#2e2c38", 0.9), 0, 1.3, -10.2));
  scene.add(box(1600, 3, 1600, standard("#1f1c2a", 0.95), 0, 1.5, -856));
  scene.add(box(1600, 0.25, 0.8, standard(palette.yellow, 0.5), 0, 3.05, -11.2));
  scene.add(box(1600, 0.06, 10, standard(palette.asphalt, 0.95), 0, 3.03, -19));

  const dashes = new THREE.InstancedMesh(new THREE.BoxGeometry(3, 0.08, 0.25), standard(palette.white, 0.6), 86);
  const fenders = new THREE.InstancedMesh(new THREE.BoxGeometry(1.4, 2.4, 0.9), standard("#111018", 0.9), 52);
  const bollards = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.4, 0.5, 0.9, 10), standard("#2b2a33", 0.6, 0.4), 35);
  const poles = new THREE.InstancedMesh(new THREE.BoxGeometry(0.35, 13, 0.35), standard(palette.steel, 0.5, 0.5), 18);
  const lamps = new THREE.InstancedMesh(new THREE.BoxGeometry(2.2, 0.35, 1), glow("#ffe2a8", 4), 18);
  const matrix = new THREE.Matrix4();
  for (let i = 0; i < 86; i++) dashes.setMatrixAt(i, matrix.makeTranslation(-258 + i * 6, 3.07, -19));
  for (let i = 0; i < 52; i++) fenders.setMatrixAt(i, matrix.makeTranslation(-255 + i * 10, 1.4, -9.4));
  for (let i = 0; i < 35; i++) bollards.setMatrixAt(i, matrix.makeTranslation(-255 + i * 15, 3.45, -11.9));
  for (let i = 0; i < 18; i++) {
    const x = -255 + i * 30;
    poles.setMatrixAt(i, matrix.makeTranslation(x, 9.5, -28));
    lamps.setMatrixAt(i, matrix.makeTranslation(x, 16, -27.4));
  }
  lamps.userData.noShadow = true;
  scene.add(dashes, fenders, bollards, poles, lamps);

  scene.add(createContainerYard(random, -340, 340, [-31, -33.6, -36.2, -38.8, -44, -46.6, -49.2, -51.8], 3));
  scene.add(createCity(random, 3));

  const cranes = [-75, -25, 25, 75].map((x, index) => {
    const crane = createCrane();
    crane.group.position.set(x, 3, -18);
    scene.add(crane.group);
    return { ...crane, phase: index * 1.9 };
  });

  const dockedShip = createCargoShip(random, palette.blue, 150, false);
  dockedShip.position.set(0, -2, 2.4);
  scene.add(dockedShip);

  const movers: Mover[] = [];
  const addMover = (object: THREE.Object3D, start: number, speed: number, range: number, bob = 0) => {
    scene.add(object);
    movers.push({ object, start, speed, min: -range, max: range, bob, baseY: object.position.y });
  };

  [
    { color: palette.purple, length: 90, start: -60 },
    { color: palette.silver, length: 74, start: 280 },
  ].forEach(({ color, length, start }, index) => {
    const ship = createCargoShip(random, color, length, true);
    ship.position.z = 42;
    addMover(ship, start, 4, 360, 1 + index);
  });

  const tug = createTugboat();
  tug.position.z = 56;
  addMover(tug, 10, 4, 360, 3);

  [
    { color: palette.red, length: 82, start: 110 },
    { color: "#1f4f8a", length: 70, start: -240 },
  ].forEach(({ color, length, start }, index) => {
    const ship = createCargoShip(random, color, length, true);
    ship.rotation.y = Math.PI;
    ship.position.z = 76;
    addMover(ship, start, -3.2, 360, 4 + index);
  });

  const truckColors = [
    [palette.yellow, palette.blue],
    [palette.white, palette.red],
    [palette.blue, palette.yellow],
    [palette.red, palette.silver],
    [palette.silver, "#2f7d4f"],
    [palette.white, palette.blue],
  ];
  truckColors.forEach(([cab, cargo], index) => {
    const truck = createTruck(cab, cargo);
    const forward = index % 2 === 0;
    truck.position.set(0, 3, forward ? -21.5 : -16.5);
    if (!forward) truck.rotation.y = Math.PI;
    addMover(truck, -240 + index * 80, forward ? 10 : -9, 260);
  });

  scene.traverse((object) => {
    if (!(object instanceof THREE.Mesh) || object === water || object === sky || object.userData.noShadow) return;
    object.castShadow = true;
    object.receiveShadow = true;
  });

  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(pixelRatio);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.26, 0.4, 0.95);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const update = (time: number) => {
    water.material.uniforms.time.value = time * 0.6;

    for (const mover of movers) {
      mover.object.position.x = wrap(mover.start + mover.speed * time, mover.min, mover.max);
      if (mover.bob) {
        mover.object.position.y = mover.baseY + Math.sin(time * 0.9 + mover.bob) * 0.18;
        mover.object.rotation.x = Math.sin(time * 0.7 + mover.bob) * 0.012;
      }
    }
    dockedShip.rotation.x = Math.sin(time * 0.5) * 0.004;

    for (const crane of cranes) {
      const z = 11 + Math.sin(time * 0.3 + crane.phase) * 16;
      const spreaderY = 9 + (1 + Math.sin(time * 0.6 + crane.phase)) * 4.5;
      crane.trolley.position.z = z;
      crane.spreader.position.set(0, spreaderY, z);
      const cableLength = 19 - spreaderY;
      crane.cable.scale.y = cableLength;
      crane.cable.position.set(0, spreaderY + cableLength / 2, z);
      const material = crane.beacon.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = Math.sin(time * 2.4 + crane.phase) > 0.55 ? 8 : 0.4;
    }

    camera.position.set(70 + Math.sin(time * 0.035) * 18, 92 + Math.sin(time * 0.025) * 4, 215);
    camera.lookAt(target);
  };

  function render(time: number) {
    update(time);
    composer.render();
  }

  const resize = () => {
    const parent = canvas.parentElement;
    if (!parent) return;
    const width = parent.clientWidth;
    const height = Math.max(parent.clientHeight, 1);
    renderer.setSize(width, height, false);
    composer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (!animate) render(0);
  };

  const observer = new ResizeObserver(resize);
  if (canvas.parentElement) observer.observe(canvas.parentElement);
  resize();

  const clock = new THREE.Clock();
  let frame = 0;
  const loop = () => {
    render(clock.getElapsedTime());
    frame = requestAnimationFrame(loop);
  };
  if (animate) loop();

  return {
    dispose() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        for (const material of materials) {
          const standardMaterial = material as THREE.MeshStandardMaterial;
          standardMaterial.map?.dispose();
          standardMaterial.emissiveMap?.dispose();
          material.dispose();
        }
      });
      waterNormals.dispose();
      environment.dispose();
      pmrem.dispose();
      composer.dispose();
      resetSharedTextures();
      renderer.dispose();
    },
  };
}
