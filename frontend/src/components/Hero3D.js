import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';

// Iron Gate Component
function IronGate({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Main Frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.15, 4, 0.1]} />
        <meshStandardMaterial color="#1A1A1D" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[2.5, 0, 0]}>
        <boxGeometry args={[0.15, 4, 0.1]} />
        <meshStandardMaterial color="#1A1A1D" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[1.25, 2, 0]}>
        <boxGeometry args={[2.65, 0.15, 0.1]} />
        <meshStandardMaterial color="#1A1A1D" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[1.25, -2, 0]}>
        <boxGeometry args={[2.65, 0.15, 0.1]} />
        <meshStandardMaterial color="#1A1A1D" metalness={0.9} roughness={0.3} />
      </mesh>
      
      {/* Vertical Bars */}
      {[0.5, 1, 1.5, 2].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]}>
          <boxGeometry args={[0.08, 3.85, 0.05]} />
          <meshStandardMaterial color="#27272A" metalness={0.8} roughness={0.4} />
        </mesh>
      ))}
      
      {/* Decorative Top */}
      {[0.5, 1, 1.5, 2].map((x, i) => (
        <mesh key={`top-${i}`} position={[x, 2.1, 0]}>
          <coneGeometry args={[0.08, 0.25, 4]} />
          <meshStandardMaterial color="#FF5A00" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// Welding Sparks
function WeldingSparks() {
  const sparksRef = useRef();
  
  const sparkPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 50; i++) {
      positions.push([
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4
      ]);
    }
    return positions;
  }, []);

  return (
    <>
      <Sparkles
        ref={sparksRef}
        count={100}
        scale={[10, 8, 6]}
        size={3}
        speed={0.4}
        color="#FF5A00"
        opacity={0.8}
      />
      {sparkPositions.slice(0, 20).map((pos, i) => (
        <Float key={i} speed={2 + Math.random() * 2} floatIntensity={1}>
          <mesh position={pos}>
            <sphereGeometry args={[0.02 + Math.random() * 0.03, 8, 8]} />
            <meshBasicMaterial color={i % 3 === 0 ? '#FF5A00' : '#FFA500'} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

// Scene
function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#FF5A00" />
      <pointLight position={[-5, -5, 5]} intensity={0.5} color="#FF7A33" />
      <spotLight
        position={[0, 8, 5]}
        angle={0.5}
        penumbra={1}
        intensity={1}
        color="#FFFFFF"
        castShadow
      />
      
      {/* Gates */}
      <IronGate position={[-2, 0, -2]} rotation={[0, 0.3, 0]} />
      <IronGate position={[2, 0, -3]} rotation={[0, -0.2, 0]} />
      
      {/* Sparks */}
      <WeldingSparks />
      
      {/* Floor reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#0A0A0B" 
          metalness={0.8} 
          roughness={0.2}
          transparent
          opacity={0.5}
        />
      </mesh>
    </>
  );
}

function Hero3D() {
  return (
    <div 
      data-testid="hero-3d-section"
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

export default Hero3D;
