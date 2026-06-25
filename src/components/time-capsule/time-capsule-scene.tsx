"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, Edges, Float, Text } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { TimeScene, TimelineRef } from "@/components/time-capsule/types";

type TimeCapsuleSceneProps = {
  progressRef: TimelineRef;
  localTime: string;
  scene: TimeScene;
};

const clockGold = "#d7b978";
const crystalBlue = "#c6f5ff";
const softViolet = "#a88cff";

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function mix(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = clamp((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function fadeInOut(value: number, start: number, inEnd: number, outStart: number, end: number) {
  return smoothstep(start, inEnd, value) * (1 - smoothstep(outStart, end, value));
}

function seeded(index: number) {
  return (Math.sin(index * 127.1 + 311.7) * 43758.5453) % 1;
}

function random01(index: number) {
  return Math.abs(seeded(index));
}

export function TimeCapsuleScene({
  progressRef,
  localTime,
  scene
}: TimeCapsuleSceneProps) {
  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, 1.85]}
      camera={{ position: [0, 0.7, 8.2], fov: 40, near: 0.1, far: 80 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        outputColorSpace: THREE.SRGBColorSpace
      }}
    >
      <color attach="background" args={["#030304"]} />
      <fog attach="fog" args={["#030304", 9, 30]} />
      <CameraRig progressRef={progressRef} />
      <SceneLights progressRef={progressRef} />
      <StarUniverse progressRef={progressRef} />
      <LuxuryClock localTime={localTime} progressRef={progressRef} />
      <DissolveParticleField progressRef={progressRef} />
      <TimeFragments progressRef={progressRef} />
      <CrystalCapsule progressRef={progressRef} />
      <BloomingFlower progressRef={progressRef} scene={scene} />
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}

function CameraRig({ progressRef }: { progressRef: TimelineRef }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0.08, 0), []);
  const desired = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const p = progressRef.current;
    const reverseZoom = smoothstep(0.06, 0.27, p);
    const dissolvePull = smoothstep(0.29, 0.46, p);
    const crystalOrbit = smoothstep(0.47, 0.76, p);
    const revealPush = smoothstep(0.68, 0.9, p);
    const finalWide = smoothstep(0.86, 1, p);
    const orbitAngle = crystalOrbit * Math.PI * 1.45 + clock.elapsedTime * 0.05;

    desired.set(
      Math.sin(orbitAngle) * mix(0, 2.25, crystalOrbit) + Math.sin(clock.elapsedTime * 0.18) * 0.08,
      mix(0.7, 1.32, reverseZoom) + crystalOrbit * 0.18 - finalWide * 0.25,
      mix(8.2, 5.6, reverseZoom) + dissolvePull * 0.9 - revealPush * 0.9 + finalWide * 1.7
    );

    camera.position.lerp(desired, 0.045);
    target.set(0, mix(0.08, 0.45, revealPush) - finalWide * 0.1, 0);
    camera.lookAt(target);
  });

  return null;
}

function SceneLights({ progressRef }: { progressRef: TimelineRef }) {
  const keyRef = useRef<THREE.SpotLight>(null);
  const goldRef = useRef<THREE.PointLight>(null);
  const violetRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const p = progressRef.current;
    const reveal = smoothstep(0.66, 0.86, p);
    const universe = smoothstep(0.78, 0.98, p);

    if (keyRef.current) {
      keyRef.current.intensity = mix(7, 4.8, universe) + reveal * 2;
      keyRef.current.position.set(0.4, 4.5, 4.4);
    }

    if (goldRef.current) {
      goldRef.current.intensity = 0.8 + reveal * 12;
      goldRef.current.distance = 8;
    }

    if (violetRef.current) {
      violetRef.current.intensity = 2.2 + universe * 2.8;
    }
  });

  return (
    <>
      <ambientLight intensity={0.34} />
      <spotLight
        ref={keyRef}
        angle={0.42}
        color="#fff2d2"
        penumbra={0.9}
        position={[0.4, 4.5, 4.4]}
      />
      <pointLight ref={goldRef} color="#ffc76a" position={[0, 0.25, 1.3]} />
      <pointLight ref={violetRef} color={softViolet} position={[-3.2, 2.4, 3.2]} />
    </>
  );
}

function StarUniverse({ progressRef }: { progressRef: TimelineRef }) {
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 1200;
    const data = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const radius = mix(10, 28, random01(i * 3 + 1));
      const theta = random01(i * 5 + 2) * Math.PI * 2;
      const phi = Math.acos(mix(-1, 1, random01(i * 7 + 3)));
      data[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      data[i * 3 + 1] = radius * Math.cos(phi);
      data[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }

    return data;
  }, []);

  useFrame(({ clock }) => {
    const opacity = smoothstep(0.76, 0.92, progressRef.current);
    if (materialRef.current) {
      materialRef.current.opacity = opacity * 0.78;
      materialRef.current.size = mix(0.018, 0.026, opacity);
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.elapsedTime * 0.012;
      pointsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.05) * 0.015;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        color="#eef5ff"
        size={0.018}
        opacity={0}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function LuxuryClock({
  localTime,
  progressRef
}: {
  localTime: string;
  progressRef: TimelineRef;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const faceRef = useRef<THREE.MeshStandardMaterial>(null);
  const glassRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const goldRef = useRef<THREE.MeshStandardMaterial>(null);
  const textRef = useRef<THREE.MeshBasicMaterial>(null);
  const hourHandRef = useRef<THREE.Group>(null);
  const minuteHandRef = useRef<THREE.Group>(null);
  const secondHandRef = useRef<THREE.Group>(null);
  const frozenDate = useRef(new Date());
  const ticks = useMemo(() => Array.from({ length: 60 }, (_, index) => index), []);
  const numbers = useMemo(
    () => [
      { label: "12", position: [0, 1.72, 0.13] as [number, number, number] },
      { label: "3", position: [1.72, 0, 0.13] as [number, number, number] },
      { label: "6", position: [0, -1.72, 0.13] as [number, number, number] },
      { label: "9", position: [-1.72, 0, 0.13] as [number, number, number] }
    ],
    []
  );

  const date = frozenDate.current;
  const seconds = date.getSeconds();
  const minutes = date.getMinutes() + seconds / 60;
  const hours = (date.getHours() % 12) + minutes / 60;
  const hourAngle = -(hours / 12) * Math.PI * 2;
  const minuteAngle = -(minutes / 60) * Math.PI * 2;
  const secondAngle = -(seconds / 60) * Math.PI * 2;

  useFrame(({ clock }) => {
    const p = progressRef.current;
    const reverse = smoothstep(0.052, 0.28, p);
    const dissolve = smoothstep(0.285, 0.47, p);
    const opacity = 1 - dissolve;
    const reverseSpin = reverse * Math.PI * 12.5;

    if (groupRef.current) {
      groupRef.current.scale.setScalar(mix(1, 1.08, reverse) * mix(1, 0.72, dissolve));
      groupRef.current.position.y = mix(0, 0.25, dissolve);
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.18) * 0.04 + reverse * 0.14;
      groupRef.current.rotation.x = -0.03 + reverse * 0.05;
      groupRef.current.visible = opacity > 0.015;
      groupRef.current.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => {
          if ("opacity" in material) {
            material.transparent = true;
            material.opacity = opacity;
          }
        });
      });
    }

    if (hourHandRef.current) hourHandRef.current.rotation.z = hourAngle + reverseSpin * 0.22;
    if (minuteHandRef.current) minuteHandRef.current.rotation.z = minuteAngle + reverseSpin;
    if (secondHandRef.current) secondHandRef.current.rotation.z = secondAngle + reverseSpin * 3.2;

    [faceRef.current, glassRef.current, goldRef.current, textRef.current].forEach((material) => {
      if (material) material.opacity = opacity;
    });
  });

  return (
    <Float speed={0.75} rotationIntensity={0.08} floatIntensity={0.08}>
      <group ref={groupRef}>
        <mesh position={[0, 0, -0.06]}>
          <cylinderGeometry args={[2.18, 2.18, 0.12, 160]} />
          <meshStandardMaterial
            ref={faceRef}
            transparent
            color="#0c0b0b"
            metalness={0.8}
            roughness={0.18}
          />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <torusGeometry args={[2.22, 0.035, 24, 180]} />
          <meshStandardMaterial
            ref={goldRef}
            transparent
            color={clockGold}
            emissive="#3b2406"
            emissiveIntensity={0.4}
            metalness={1}
            roughness={0.16}
          />
        </mesh>
        <mesh position={[0, 0, 0.1]}>
          <circleGeometry args={[2.02, 160]} />
          <meshPhysicalMaterial
            ref={glassRef}
            transparent
            color="#171211"
            opacity={0.2}
            roughness={0.02}
            metalness={0.05}
            transmission={0.58}
            thickness={0.45}
            clearcoat={1}
            clearcoatRoughness={0.03}
          />
        </mesh>

        {ticks.map((tick) => {
          const angle = (tick / 60) * Math.PI * 2;
          const isHour = tick % 5 === 0;
          const radius = isHour ? 1.83 : 1.9;
          return (
            <mesh
              position={[Math.sin(angle) * radius, Math.cos(angle) * radius, 0.16]}
              rotation={[0, 0, -angle]}
              key={tick}
            >
              <boxGeometry args={[isHour ? 0.035 : 0.012, isHour ? 0.18 : 0.07, 0.018]} />
              <meshStandardMaterial
                transparent
                opacity={1}
                color={isHour ? clockGold : "#fff3d7"}
                emissive={isHour ? "#4f350e" : "#16110a"}
                emissiveIntensity={isHour ? 0.45 : 0.18}
                metalness={0.8}
                roughness={0.24}
              />
            </mesh>
          );
        })}

        {numbers.map((number) => (
          <Text
            anchorX="center"
            anchorY="middle"
            color="#ead8b1"
            fontSize={0.19}
            letterSpacing={0.08}
            position={number.position}
            key={number.label}
          >
            {number.label}
            <meshBasicMaterial ref={textRef} transparent color="#ead8b1" />
          </Text>
        ))}

        <ClockHand refObject={hourHandRef} length={0.72} width={0.06} color="#d7b978" />
        <ClockHand refObject={minuteHandRef} length={1.12} width={0.04} color="#f6e4b5" />
        <ClockHand refObject={secondHandRef} length={1.42} width={0.015} color="#ffcf83" />

        <mesh position={[0, 0, 0.26]}>
          <sphereGeometry args={[0.08, 32, 16]} />
          <meshStandardMaterial color="#fff1c4" emissive="#8c5e15" emissiveIntensity={0.9} />
        </mesh>

        <Text
          anchorX="center"
          anchorY="middle"
          color="#fff7df"
          fontSize={0.145}
          letterSpacing={0.08}
          position={[0, -0.48, 0.22]}
        >
          {localTime}
          <meshBasicMaterial transparent color="#fff7df" opacity={0.76} />
        </Text>

        <GearCluster progressRef={progressRef} />
      </group>
    </Float>
  );
}

function ClockHand({
  refObject,
  length,
  width,
  color
}: {
  refObject: React.RefObject<THREE.Group | null>;
  length: number;
  width: number;
  color: string;
}) {
  return (
    <group ref={refObject} position={[0, 0, 0.24]}>
      <mesh position={[0, length / 2, 0]}>
        <boxGeometry args={[width, length, 0.035]} />
        <meshStandardMaterial
          color={color}
          emissive="#3b2207"
          emissiveIntensity={0.38}
          metalness={0.92}
          roughness={0.18}
        />
      </mesh>
    </group>
  );
}

function GearCluster({ progressRef }: { progressRef: TimelineRef }) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const visibility = fadeInOut(progressRef.current, 0.06, 0.16, 0.34, 0.5);

    if (groupRef.current) {
      groupRef.current.visible = visibility > 0.01;
      groupRef.current.rotation.z = -clock.elapsedTime * (1.15 + visibility);
    }

    if (materialRef.current) {
      materialRef.current.opacity = visibility * 0.82;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -0.22]}>
      <meshStandardMaterial
        ref={materialRef}
        transparent
        color="#947b52"
        emissive="#1a1005"
        emissiveIntensity={0.28}
        metalness={1}
        roughness={0.2}
      />
      <Gear radius={0.62} teeth={18} position={[-0.66, 0.48, 0]} materialRef={materialRef} />
      <Gear radius={0.42} teeth={14} position={[0.54, 0.28, 0.01]} materialRef={materialRef} />
      <Gear radius={0.52} teeth={16} position={[0.18, -0.62, 0.02]} materialRef={materialRef} />
    </group>
  );
}

function Gear({
  radius,
  teeth,
  position,
  materialRef
}: {
  radius: number;
  teeth: number;
  position: [number, number, number];
  materialRef: React.RefObject<THREE.MeshStandardMaterial | null>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const teethList = useMemo(() => Array.from({ length: teeth }, (_, index) => index), [teeth]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.z =
        (position[0] > 0 ? 1 : -1) * clock.elapsedTime * (0.75 + radius);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh material={materialRef.current ?? undefined}>
        <torusGeometry args={[radius, 0.055, 14, 80]} />
      </mesh>
      <mesh material={materialRef.current ?? undefined}>
        <torusGeometry args={[radius * 0.46, 0.03, 12, 50]} />
      </mesh>
      {teethList.map((tooth) => {
        const angle = (tooth / teeth) * Math.PI * 2;
        return (
          <mesh
            material={materialRef.current ?? undefined}
            position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
            rotation={[0, 0, angle]}
            key={tooth}
          >
            <boxGeometry args={[0.08, 0.18, 0.05]} />
          </mesh>
        );
      })}
    </group>
  );
}

function DissolveParticleField({ progressRef }: { progressRef: TimelineRef }) {
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const particleData = useMemo(() => {
    const count = 2600;
    const initial = new Float32Array(count * 3);
    const exploded = new Float32Array(count * 3);
    const crystal = new Float32Array(count * 3);
    const flower = new Float32Array(count * 3);
    const stars = new Float32Array(count * 3);
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const ring = Math.sqrt(random01(i + 10)) * 2.1;
      const angle = random01(i + 20) * Math.PI * 2;
      const z = mix(-0.08, 0.22, random01(i + 30));
      initial[i * 3] = Math.cos(angle) * ring;
      initial[i * 3 + 1] = Math.sin(angle) * ring;
      initial[i * 3 + 2] = z;

      const phi = random01(i + 40) * Math.PI * 2;
      const theta = Math.acos(mix(-1, 1, random01(i + 50)));
      const radius = mix(2.8, 7.5, random01(i + 60));
      exploded[i * 3] = Math.sin(theta) * Math.cos(phi) * radius;
      exploded[i * 3 + 1] = Math.cos(theta) * radius * 0.72;
      exploded[i * 3 + 2] = Math.sin(theta) * Math.sin(phi) * radius * 0.62;

      const side = i % 6;
      const cx = mix(-1.08, 1.08, random01(i + 70));
      const cy = mix(-0.76, 0.76, random01(i + 80));
      const cz = mix(-0.82, 0.82, random01(i + 90));
      crystal[i * 3] = side < 2 ? (side === 0 ? -1.1 : 1.1) : cx;
      crystal[i * 3 + 1] = side >= 2 && side < 4 ? (side === 2 ? -0.78 : 0.78) : cy;
      crystal[i * 3 + 2] = side >= 4 ? (side === 4 ? -0.84 : 0.84) : cz;

      const petalAngle = random01(i + 100) * Math.PI * 2;
      const petalRadius = mix(0.1, 1.45, random01(i + 110));
      flower[i * 3] = Math.cos(petalAngle) * petalRadius;
      flower[i * 3 + 1] = mix(-0.1, 1.2, random01(i + 120));
      flower[i * 3 + 2] = Math.sin(petalAngle) * petalRadius * 0.44;

      const starRadius = mix(8, 26, random01(i + 130));
      const starTheta = random01(i + 140) * Math.PI * 2;
      const starPhi = Math.acos(mix(-1, 1, random01(i + 150)));
      stars[i * 3] = Math.sin(starPhi) * Math.cos(starTheta) * starRadius;
      stars[i * 3 + 1] = Math.cos(starPhi) * starRadius;
      stars[i * 3 + 2] = Math.sin(starPhi) * Math.sin(starTheta) * starRadius;

      positions[i * 3] = initial[i * 3];
      positions[i * 3 + 1] = initial[i * 3 + 1];
      positions[i * 3 + 2] = initial[i * 3 + 2];
    }

    return { count, initial, exploded, crystal, flower, stars, positions };
  }, []);

  useFrame(({ clock }) => {
    const p = progressRef.current;
    const explode = smoothstep(0.28, 0.48, p);
    const converge = smoothstep(0.48, 0.65, p);
    const bloom = smoothstep(0.68, 0.84, p);
    const universe = smoothstep(0.82, 1, p);
    const drift = Math.sin(clock.elapsedTime * 0.7) * 0.025;
    const { count, initial, exploded, crystal, flower, stars, positions } = particleData;

    for (let i = 0; i < count; i += 1) {
      const offset = i * 3;
      const jitter = Math.sin(clock.elapsedTime * (0.45 + random01(i) * 0.4) + i) * 0.025;
      const ax = mix(initial[offset], exploded[offset], explode);
      const ay = mix(initial[offset + 1], exploded[offset + 1], explode);
      const az = mix(initial[offset + 2], exploded[offset + 2], explode);
      const bx = mix(ax, crystal[offset], converge);
      const by = mix(ay, crystal[offset + 1], converge);
      const bz = mix(az, crystal[offset + 2], converge);
      const cx = mix(bx, flower[offset], bloom);
      const cy = mix(by, flower[offset + 1], bloom);
      const cz = mix(bz, flower[offset + 2], bloom);

      positions[offset] = mix(cx, stars[offset], universe) + jitter;
      positions[offset + 1] = mix(cy, stars[offset + 1], universe) + drift;
      positions[offset + 2] = mix(cz, stars[offset + 2], universe) + jitter * 0.6;
    }

    const positionAttribute = geometryRef.current?.attributes.position;
    if (positionAttribute) positionAttribute.needsUpdate = true;

    if (materialRef.current) {
      const active = fadeInOut(p, 0.22, 0.35, 0.94, 1);
      materialRef.current.opacity = active * mix(0.28, 0.86, smoothstep(0.32, 0.58, p));
      materialRef.current.size = mix(0.018, 0.038, smoothstep(0.46, 0.75, p));
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.elapsedTime * 0.018;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[particleData.positions, 3]}
          count={particleData.count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color="#ffd890"
        size={0.018}
        opacity={0}
      />
    </points>
  );
}

function TimeFragments({ progressRef }: { progressRef: TimelineRef }) {
  const fragments = useMemo(
    () => ["XII", "III", "VI", "IX", "08", "21", "55", "TIME", "NOW", "ONE"],
    []
  );

  return (
    <group>
      {fragments.map((fragment, index) => (
        <FragmentText
          index={index}
          key={fragment}
          label={fragment}
          progressRef={progressRef}
        />
      ))}
    </group>
  );
}

function FragmentText({
  label,
  index,
  progressRef
}: {
  label: string;
  index: number;
  progressRef: TimelineRef;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const angle = (index / 10) * Math.PI * 2;
  const target = useMemo(
    () =>
      new THREE.Vector3(
        Math.cos(angle) * mix(2.3, 5.2, random01(index + 210)),
        mix(-2.2, 2.4, random01(index + 220)),
        Math.sin(angle) * mix(1.4, 4.4, random01(index + 230))
      ),
    [angle, index]
  );

  useFrame(({ clock }) => {
    const p = progressRef.current;
    const active = fadeInOut(p, 0.29, 0.38, 0.5, 0.66);
    const fly = smoothstep(0.3, 0.56, p);
    if (groupRef.current) {
      groupRef.current.visible = active > 0.01;
      groupRef.current.position.set(
        mix(Math.cos(angle) * 1.35, target.x, fly),
        mix(Math.sin(angle) * 1.35, target.y, fly),
        mix(0.32, target.z, fly)
      );
      groupRef.current.rotation.y = clock.elapsedTime * 0.3 + index;
      groupRef.current.rotation.z = -clock.elapsedTime * 0.14 + index * 0.2;
    }
    if (materialRef.current) {
      materialRef.current.opacity = active * 0.76;
    }
  });

  return (
    <group ref={groupRef}>
      <Text anchorX="center" anchorY="middle" fontSize={0.16} letterSpacing={0.08}>
        {label}
        <meshBasicMaterial ref={materialRef} transparent color="#fff2d1" opacity={0} />
      </Text>
    </group>
  );
}

function CrystalCapsule({ progressRef }: { progressRef: TimelineRef }) {
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const glowRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    const p = progressRef.current;
    const appear = smoothstep(0.48, 0.64, p);
    const open = smoothstep(0.66, 0.82, p);
    const fade = 1 - smoothstep(0.86, 0.98, p) * 0.65;

    if (groupRef.current) {
      groupRef.current.visible = appear > 0.01;
      groupRef.current.scale.setScalar(mix(0.54, 1, appear));
      groupRef.current.rotation.y = clock.elapsedTime * 0.16 * appear;
      groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.25) * 0.035;
    }

    if (lidRef.current) {
      lidRef.current.rotation.x = -open * 1.35;
      lidRef.current.rotation.z = open * 0.08;
      lidRef.current.position.y = mix(0.82, 1.1, open);
      lidRef.current.position.z = mix(0, -0.42, open);
    }

    if (materialRef.current) {
      materialRef.current.opacity = appear * fade * 0.28;
      materialRef.current.emissiveIntensity = appear * 0.16;
    }

    if (glowRef.current) {
      glowRef.current.opacity = appear * (0.08 + open * 0.5) * fade;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.05, 0]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.35, 1.48, 1.68]} />
        <meshPhysicalMaterial
          ref={materialRef}
          transparent
          color={crystalBlue}
          emissive="#72d9ff"
          emissiveIntensity={0.08}
          roughness={0.02}
          metalness={0}
          transmission={0.78}
          thickness={1.2}
          ior={1.48}
          clearcoat={1}
          clearcoatRoughness={0.02}
          opacity={0}
          depthWrite={false}
        />
        <Edges color="#dffbff" linewidth={1.4} />
      </mesh>

      <group ref={lidRef} position={[0, 0.82, 0]}>
        <mesh>
          <boxGeometry args={[2.45, 0.08, 1.78]} />
          <meshPhysicalMaterial
            transparent
            color="#e2fbff"
            roughness={0.02}
            metalness={0}
            transmission={0.84}
            thickness={0.7}
            opacity={0.24}
            depthWrite={false}
          />
          <Edges color="#ffffff" linewidth={1.4} />
        </mesh>
      </group>

      <mesh position={[0, -0.04, 0]}>
        <sphereGeometry args={[0.92, 48, 24]} />
        <meshBasicMaterial
          ref={glowRef}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#ffca72"
          opacity={0}
        />
      </mesh>
    </group>
  );
}

function BloomingFlower({
  progressRef
}: {
  progressRef: TimelineRef;
  scene: TimeScene;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.MeshStandardMaterial>(null);
  const petals = useMemo(() => Array.from({ length: 22 }, (_, index) => index), []);

  useFrame(({ clock }) => {
    const p = progressRef.current;
    const bloom = smoothstep(0.68, 0.88, p);
    const final = smoothstep(0.84, 1, p);

    if (groupRef.current) {
      groupRef.current.visible = bloom > 0.01;
      groupRef.current.scale.setScalar(mix(0.2, 1.08, bloom) + final * 0.08);
      groupRef.current.position.y = mix(-0.05, 0.32, bloom) + Math.sin(clock.elapsedTime * 0.65) * 0.025;
      groupRef.current.rotation.y = clock.elapsedTime * (0.16 + final * 0.08);
    }

    if (coreRef.current) {
      coreRef.current.emissiveIntensity = 0.8 + bloom * 2.2 + final * 0.8;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.12}>
      <group ref={groupRef}>
        {petals.map((petal) => (
          <Petal index={petal} progressRef={progressRef} key={petal} />
        ))}
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.18, 40, 20]} />
          <meshStandardMaterial
            ref={coreRef}
            color="#ffe8a3"
            emissive="#ffc15a"
            emissiveIntensity={1.2}
            roughness={0.22}
            metalness={0.18}
          />
        </mesh>
        <mesh position={[0, -0.32, 0]} rotation={[0.18, 0, 0]}>
          <cylinderGeometry args={[0.018, 0.026, 0.82, 16]} />
          <meshStandardMaterial color="#6f6a40" emissive="#443917" emissiveIntensity={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

function Petal({
  index,
  progressRef
}: {
  index: number;
  progressRef: TimelineRef;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const petalCount = 22;
  const angle = (index / petalCount) * Math.PI * 2;
  const inner = index % 2 === 0;

  useFrame(({ clock }) => {
    const bloom = smoothstep(0.68 + (index % 5) * 0.008, 0.88, progressRef.current);
    const radius = mix(0.06, inner ? 0.42 : 0.68, bloom);
    const lift = mix(0.02, inner ? 0.16 : 0.08, bloom);
    const openAngle = mix(1.25, inner ? 0.34 : 0.56, bloom);

    if (groupRef.current) {
      groupRef.current.position.set(Math.cos(angle) * radius, lift, Math.sin(angle) * radius * 0.32);
      groupRef.current.rotation.set(openAngle, 0, angle - Math.PI / 2);
      groupRef.current.scale.setScalar(mix(0.18, inner ? 0.86 : 1.05, bloom));
    }

    if (materialRef.current) {
      materialRef.current.opacity = bloom;
      materialRef.current.emissiveIntensity = 0.38 + bloom * 0.78 + Math.sin(clock.elapsedTime + index) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[0.24, 32, 18]} />
        <meshStandardMaterial
          ref={materialRef}
          transparent
          color={inner ? "#ffd9b8" : "#fff0c7"}
          emissive={inner ? "#ff9c5a" : "#f3bf63"}
          emissiveIntensity={0.4}
          opacity={0}
          roughness={0.26}
          metalness={0.04}
        />
      </mesh>
    </group>
  );
}
