"use client";

// components/ARScene.tsx
//
// Renders the physical/virtual hazard layout for one mission step.
// Uses WebXR (via @react-three/xr) when the browser/device supports
// immersive-ar — this is real "point your phone at the floor" AR in Chrome
// on Android. On desktop or unsupported devices it falls back to an
// orbit-controlled 3D scene so the mission is still fully playable.
//
// arSceneId (from lib/scenarios.ts) selects which layout function below
// builds the 3D objects. Add a new arSceneId by adding a case here.

import { useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { XR, ARButton, Controllers, useXR } from "@react-three/xr";
import { OrbitControls, Text } from "@react-three/drei";
import { MissionChoice } from "@/lib/scenarios";

interface ARObjectSpec {
  id: string;
  position: [number, number, number];
  color: string;
  label: string;
}

// Placeholder box-and-label geometry stands in for real GLTF hazard models
// (industrial environment, PPE racks, exit doors, machinery). Swap
// <mesh geometry={boxGeometry}> below for <primitive object={gltf.scene}/>
// once real asset models are dropped into /public/models.
function layoutForScene(arSceneId: string, choices: MissionChoice[]): ARObjectSpec[] {
  const colors = ["#E5484D", "#1FA97C", "#E8B93B", "#FF7A1A"];
  return choices.map((choice, i) => ({
    id: choice.arObjectId ?? choice.id,
    position: [(i - (choices.length - 1) / 2) * 1.4, 0, -2],
    color: colors[i % colors.length],
    label: choice.label
  }));
}

function HazardObject({
  spec,
  onSelect,
  selected
}: {
  spec: ARObjectSpec;
  onSelect: (id: string) => void;
  selected: boolean;
}) {
  return (
    <group position={spec.position}>
      <mesh onClick={() => onSelect(spec.id)}>
        <boxGeometry args={[0.8, 1.2, 0.2]} />
        <meshStandardMaterial color={spec.color} opacity={selected ? 1 : 0.85} transparent />
      </mesh>
      <Text position={[0, -0.9, 0]} fontSize={0.14} maxWidth={1.2} textAlign="center" color="white">
        {spec.label}
      </Text>
    </group>
  );
}

function SceneContents({
  arSceneId,
  choices,
  onSelect,
  selectedId
}: {
  arSceneId: string;
  choices: MissionChoice[];
  onSelect: (id: string) => void;
  selectedId: string | null;
}) {
  const objects = layoutForScene(arSceneId, choices);
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 4, 2]} intensity={0.8} />
      {objects.map((spec) => (
        <HazardObject
          key={spec.id}
          spec={spec}
          onSelect={(objId) => {
            const matchingChoice = choices.find((c) => (c.arObjectId ?? c.id) === objId);
            if (matchingChoice) onSelect(matchingChoice.id);
          }}
          selected={selectedId === spec.id}
        />
      ))}
    </>
  );
}

export default function ARScene({
  arSceneId,
  choices,
  onChoiceSelected
}: {
  arSceneId: string;
  choices: MissionChoice[];
  onChoiceSelected: (choiceId: string) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [arSupported, setArSupported] = useState<boolean | null>(null);

  const handleSelect = useCallback(
    (choiceId: string) => {
      setSelectedId(choiceId);
      onChoiceSelected(choiceId);
    },
    [onChoiceSelected]
  );

  return (
    <div className="relative w-full h-[420px] bg-black rounded-panel overflow-hidden border border-steelLine">
      <Canvas camera={{ position: [0, 1.2, 3], fov: 60 }}>
        <XR
          referenceSpace="local-floor"
          onSessionStart={() => setArSupported(true)}
          onSessionEnd={() => setArSupported(false)}
        >
          <SceneContents arSceneId={arSceneId} choices={choices} onSelect={handleSelect} selectedId={selectedId} />
          <OrbitControls enablePan={false} />
        </XR>
      </Canvas>
      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
        <span className="mono text-xs text-mist bg-void/70 px-2 py-1 rounded">
          Tap an object to choose · rotate to inspect
        </span>
        <ARButtonOverlay />
      </div>
    </div>
  );
}

// Isolated so ARButton (which touches navigator.xr) never runs during SSR.
function ARButtonOverlay() {
  if (typeof window === "undefined") return null;
  return (
    <div className="mono text-xs">
      <ARButton
        sessionInit={{ requiredFeatures: ["local-floor"] }}
        className="bg-signal text-void px-3 py-1 rounded"
      />
    </div>
  );
}
