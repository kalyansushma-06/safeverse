"use client";

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

function layoutForScene(arSceneId: string, choices: MissionChoice[]): ARObjectSpec[] {
  const colors = ["#E5484D", "#1FA97C", "#E8B93B", "#FF7A1A"];
  return choices.map((choice, i) => ({
    id: choice.arObjectId ?? choice.id,
    // Placed at Y=0 (floor level in local-floor mode) and -1.5m in front of camera
    position: [(i - (choices.length - 1) / 2) * 1.2, 0, -1.5],
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
        <boxGeometry args={[0.6, 0.8, 0.2]} />
        <meshStandardMaterial color={spec.color} opacity={selected ? 1 : 0.85} transparent />
      </mesh>
      <Text position={[0, -0.6, 0]} fontSize={0.12} maxWidth={1.0} textAlign="center" color="white">
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
  const { isPresenting } = useXR();
  const objects = layoutForScene(arSceneId, choices);

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 4, 2]} intensity={1.0} />
      <Controllers />
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
      {/* Disable OrbitControls during active WebXR camera mode */}
      {!isPresenting && <OrbitControls enablePan={false} />}
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

  const handleSelect = useCallback(
    (choiceId: string) => {
      setSelectedId(choiceId);
      onChoiceSelected(choiceId);
    },
    [onChoiceSelected]
  );

  return (
    <div className="relative w-full h-[420px] bg-black rounded-panel overflow-hidden border border-steelLine">
      <Canvas camera={{ position: [0, 1.2, 2.5], fov: 60 }}>
        <XR referenceSpace="local-floor">
          <SceneContents
            arSceneId={arSceneId}
            choices={choices}
            onSelect={handleSelect}
            selectedId={selectedId}
          />
        </XR>
      </Canvas>
      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center z-10">
        <span className="mono text-xs text-mist bg-void/70 px-2 py-1 rounded">
          Tap an object to choose
        </span>
        <ARButtonOverlay />
      </div>
    </div>
  );
}

function ARButtonOverlay() {
  if (typeof window === "undefined") return null;
  return (
    <div className="mono text-xs">
      <ARButton
        sessionInit={{
          requiredFeatures: ["local-floor"],
          optionalFeatures: ["hit-test", "dom-overlay"],
          domOverlay: { root: typeof document !== "undefined" ? document.body : undefined }
        }}
        className="bg-signal text-void px-3 py-1 rounded font-bold"
      />
    </div>
  );
}