import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import * as THREE from 'three';

const BlochSphereScene = ({ blochCoords, qubitLabel }) => {
  const stateVectorRef = useRef();
  const sphereRef = useRef();

  // Animate the state vector
  useFrame((state, delta) => {
    if (stateVectorRef.current) {
      // Smooth transition to new position
      const targetPosition = new THREE.Vector3(
        blochCoords.x,
        blochCoords.z, // Y is up in Three.js
        blochCoords.y
      );
      
      stateVectorRef.current.position.lerp(targetPosition, delta * 5);
    }
  });

  // Create sphere wireframe
  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(1, 16, 12), []);
  
  // Create coordinate axes
  const axes = useMemo(() => [
    // X axis (red)
    { points: [[-1.2, 0, 0], [1.2, 0, 0]], color: '#ef4444' },
    // Y axis (green) - this is Z in Bloch sphere
    { points: [[0, 0, -1.2], [0, 0, 1.2]], color: '#22c55e' },
    // Z axis (blue) - this is Y in Three.js
    { points: [[0, -1.2, 0], [0, 1.2, 0]], color: '#3b82f6' }
  ], []);

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} />

      {/* Bloch sphere wireframe */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshBasicMaterial color="#e5e7eb" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Coordinate axes */}
      {axes.map((axis, index) => (
        <Line
          key={index}
          points={axis.points}
          color={axis.color}
          lineWidth={2}
        />
      ))}

      {/* Axis labels */}
      <Text
        position={[1.4, 0, 0]}
        fontSize={0.15}
        color="#ef4444"
        anchorX="center"
        anchorY="middle"
      >
        X
      </Text>
      <Text
        position={[0, 0, 1.4]}
        fontSize={0.15}
        color="#22c55e"
        anchorX="center"
        anchorY="middle"
      >
        Y
      </Text>
      <Text
        position={[0, 1.4, 0]}
        fontSize={0.15}
        color="#3b82f6"
        anchorX="center"
        anchorY="middle"
      >
        Z
      </Text>

      {/* State labels */}
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.12}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
      >
        |0⟩
      </Text>
      <Text
        position={[0, -1.2, 0]}
        fontSize={0.12}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
      >
        |1⟩
      </Text>

      {/* State vector */}
      <Line
        points={[[0, 0, 0], [blochCoords.x, blochCoords.z, blochCoords.y]]}
        color="#7c3aed"
        lineWidth={3}
      />

      {/* State point */}
      <mesh
        ref={stateVectorRef}
        position={[blochCoords.x, blochCoords.z, blochCoords.y]}
      >
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial color="#7c3aed" />
      </mesh>

      {/* Qubit label */}
      <Text
        position={[0, -1.6, 0]}
        fontSize={0.2}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {qubitLabel}
      </Text>

      <OrbitControls enableZoom={true} enablePan={false} />
    </>
  );
};

const BlochSphere = ({ quantumState, qubitIndex, className = "" }) => {
  const blochCoords = quantumState ? quantumState.getBlochCoordinates(qubitIndex) : { x: 0, y: 0, z: 1 };
  const qubitLabel = `Qubit ${qubitIndex}`;

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
      <h4 className="text-lg font-semibold text-gray-800 mb-2 text-center">
        {qubitLabel}
      </h4>
      <div className="h-64 w-full">
        <Canvas camera={{ position: [2, 2, 2], fov: 50 }}>
          <BlochSphereScene blochCoords={blochCoords} qubitLabel={qubitLabel} />
        </Canvas>
      </div>
      <div className="mt-2 text-sm text-gray-600 text-center">
        <div>X: {blochCoords.x.toFixed(3)}</div>
        <div>Y: {blochCoords.y.toFixed(3)}</div>
        <div>Z: {blochCoords.z.toFixed(3)}</div>
      </div>
    </div>
  );
};

export default BlochSphere;

