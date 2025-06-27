"use client"

import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  OrbitControls,
  Text,
  Environment,
  Cloud,
  Billboard,
  Trail,
  Float,
  Sparkles,
  useTexture
} from '@react-three/drei'
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
  ChromaticAberration
} from '@react-three/postprocessing'
import * as THREE from 'three'
import { extend } from '@react-three/fiber'

// Extend Three.js with custom materials
extend({ THREE })

// Enhanced A3E Logo Core - Voxel Constellation
function A3ELogoCore() {
  const groupRef = useRef<THREE.Group>(null)
  const voxelsRef = useRef<THREE.InstancedMesh>(null)

  // Create voxel constellation
  const voxelCount = 1000 // Reduced for better performance
  const positions = useMemo(() => {
    const pos = new Float32Array(voxelCount * 3)
    const colors = new Float32Array(voxelCount * 3)

    for (let i = 0; i < voxelCount; i++) {
      // Distribute voxels in A3E logo shape pattern
      const angle = (i / voxelCount) * Math.PI * 4
      const radius = 2 + Math.random() * 1.5
      const height = (Math.sin(angle * 2) * 0.5) + (Math.random() - 0.5)

      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = height
      pos[i * 3 + 2] = Math.sin(angle) * radius

      // Core AI colors - electric blue to neon green
      const colorIntensity = 0.7 + Math.random() * 0.3
      colors[i * 3] = 0.1 * colorIntensity     // R
      colors[i * 3 + 1] = 0.8 * colorIntensity // G
      colors[i * 3 + 2] = 1.0 * colorIntensity // B
    }

    return { positions: pos, colors }
  }, [])

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle pulsating rotation
      groupRef.current.rotation.y = clock.elapsedTime * 0.2
      groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.1) * 0.1
    }

    if (voxelsRef.current) {
      // Animate individual voxels
      const time = clock.elapsedTime
      for (let i = 0; i < voxelCount; i++) {
        const matrix = new THREE.Matrix4()
        const position = new THREE.Vector3(
          positions.positions[i * 3],
          positions.positions[i * 3 + 1] + Math.sin(time + i * 0.01) * 0.1,
          positions.positions[i * 3 + 2]
        )
        const scale = 0.05 + Math.sin(time * 2 + i * 0.1) * 0.02
        matrix.compose(position, new THREE.Quaternion(), new THREE.Vector3(scale, scale, scale))
        voxelsRef.current.setMatrixAt(i, matrix)
      }
      voxelsRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Voxel constellation */}
      <instancedMesh
        ref={voxelsRef}
        args={[undefined, undefined, voxelCount]}
      >
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial
          emissive="#00ff88"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </instancedMesh>

      {/* Central holographic A3E text - Using Text instead of Text3D for better compatibility */}
      <Float
        speed={1}
        rotationIntensity={0.5}
        floatIntensity={0.2}
      >
        <Text
          fontSize={1.2}
          maxWidth={200}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign="center"
          position={[0, 0, 0]}
          color="#00ffff"
        >
          A3E
          <meshStandardMaterial
            color="#00ffff"
            emissive="#0088ff"
            emissiveIntensity={0.3}
            transparent
            opacity={0.9}
          />
        </Text>
      </Float>

      {/* Central core sphere */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#00ffaa"
          emissive="#00ffaa"
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Wireframe logo outline */}
      <mesh>
        <torusGeometry args={[3, 0.02, 8, 100]} />
        <meshBasicMaterial
          color="#00ffaa"
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  )
}

// Data Stream Particles
function DataStream({
  startPosition,
  endPosition,
  color,
  dataType
}: {
  startPosition: [number, number, number]
  endPosition: [number, number, number]
  color: string
  dataType: string
}) {
  const particlesRef = useRef<THREE.Points>(null)
  const particleCount = 50 // Reduced for better performance

  const { positions, velocities, ages } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const vel = new Float32Array(particleCount * 3)
    const age = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      // Start at random points along the path
      const progress = Math.random()
      pos[i * 3] = THREE.MathUtils.lerp(startPosition[0], endPosition[0], progress)
      pos[i * 3 + 1] = THREE.MathUtils.lerp(startPosition[1], endPosition[1], progress)
      pos[i * 3 + 2] = THREE.MathUtils.lerp(startPosition[2], endPosition[2], progress)

      // Velocity towards end position
      const direction = new THREE.Vector3(
        endPosition[0] - startPosition[0],
        endPosition[1] - startPosition[1],
        endPosition[2] - startPosition[2]
      ).normalize()

      vel[i * 3] = direction.x * (0.1 + Math.random() * 0.05)
      vel[i * 3 + 1] = direction.y * (0.1 + Math.random() * 0.05)
      vel[i * 3 + 2] = direction.z * (0.1 + Math.random() * 0.05)

      age[i] = Math.random() * 100
    }

    return { positions: pos, velocities: vel, ages: age }
  }, [startPosition, endPosition])

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < particleCount; i++) {
        // Update positions
        posArray[i * 3] += velocities[i * 3]
        posArray[i * 3 + 1] += velocities[i * 3 + 1]
        posArray[i * 3 + 2] += velocities[i * 3 + 2]

        ages[i] += 1

        // Reset particles that reach the end or age out
        if (ages[i] > 100) {
          posArray[i * 3] = startPosition[0] + (Math.random() - 0.5) * 0.5
          posArray[i * 3 + 1] = startPosition[1] + (Math.random() - 0.5) * 0.5
          posArray[i * 3 + 2] = startPosition[2] + (Math.random() - 0.5) * 0.5
          ages[i] = 0
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color={color}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// AI Feature Beacons
function AIFeatureBeacon({
  position,
  label,
  color,
  intensity = 1
}: {
  position: [number, number, number]
  label: string
  color: string
  intensity?: number
}) {
  const beaconRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (beaconRef.current) {
      beaconRef.current.rotation.y = clock.elapsedTime * 0.5
      const scale = 1 + Math.sin(clock.elapsedTime * 2) * 0.1 * intensity
      beaconRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group ref={beaconRef} position={position}>
      {/* Core beacon */}
      <mesh>
        <icosahedronGeometry args={[0.3, 2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5 * intensity}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Orbiting particles */}
      <Sparkles
        count={10}
        scale={1.5}
        size={2}
        speed={0.3}
        color={color}
      />

      {/* Label using Text component */}
      <Billboard>
        <Text
          fontSize={0.15}
          maxWidth={200}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign="center"
          position={[0, 0.8, 0]}
          color={color}
        >
          {label}
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </Text>
      </Billboard>
    </group>
  )
}

// Volumetric Environment
function VolumetricEnvironment() {
  return (
    <>
      {/* Volumetric fog layers */}
      <Cloud
        opacity={0.05}
        speed={0.1}
        width={20}
        depth={20}
        segments={10}
        color="#001122"
        position={[0, -5, 0]}
      />

      <Cloud
        opacity={0.03}
        speed={0.05}
        width={30}
        depth={30}
        segments={8}
        color="#000033"
        position={[0, 10, -10]}
      />

      {/* Atmospheric lighting */}
      <ambientLight intensity={0.1} color="#001155" />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.5}
        color="#0088ff"
        castShadow
      />
      <pointLight
        position={[0, 0, 0]}
        intensity={2}
        color="#00ffaa"
        distance={10}
      />

      {/* Environment map for reflections */}
      <Environment preset="night" background={false} />
    </>
  )
}

// Main AI Nexus Scene
function AINexxusScene() {
  const { camera } = useThree()

  useEffect(() => {
    // Position camera for optimal viewing
    camera.position.set(0, 2, 10)
    camera.lookAt(0, 0, 0)
  }, [camera])

  // Data source positions (arranged in a circle around the logo)
  const dataSources = [
    { position: [-8, 2, 0] as [number, number, number], label: "EPA", color: "#0066cc" },
    { position: [8, 2, 0] as [number, number, number], label: "NOAA", color: "#0099ff" },
    { position: [0, 6, -6] as [number, number, number], label: "USGS", color: "#00ccff" },
    { position: [-6, -2, 6] as [number, number, number], label: "IoT", color: "#ff9900" },
    { position: [6, -2, 6] as [number, number, number], label: "STATE", color: "#00ff66" },
  ]

  // AI feature positions (orbiting the core)
  const aiFeatures = [
    { position: [4, 3, 2] as [number, number, number], label: "Predictive", color: "#ff00ff", intensity: 1.2 },
    { position: [-4, 3, 2] as [number, number, number], label: "Compliance", color: "#00ffff", intensity: 1.0 },
    { position: [2, -3, 4] as [number, number, number], label: "Vision", color: "#ffff00", intensity: 1.1 },
    { position: [-2, -3, 4] as [number, number, number], label: "Integration", color: "#ff6600", intensity: 0.9 },
  ]

  return (
    <>
      <VolumetricEnvironment />

      {/* Central A3E Logo Core */}
      <A3ELogoCore />

      {/* Data streams flowing into the core */}
      {dataSources.map((source, index) => (
        <DataStream
          key={`data-${index}`}
          startPosition={source.position}
          endPosition={[0, 0, 0]}
          color={source.color}
          dataType={source.label}
        />
      ))}

      {/* AI Feature Beacons */}
      {aiFeatures.map((feature, index) => (
        <AIFeatureBeacon
          key={`beacon-${index}`}
          position={feature.position}
          label={feature.label}
          color={feature.color}
          intensity={feature.intensity}
        />
      ))}

      {/* Digital grid ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -8, 0]}>
        <planeGeometry args={[50, 50, 50, 50]} />
        <meshBasicMaterial
          color="#001133"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Procedural nebula background */}
      <mesh>
        <sphereGeometry args={[100, 32, 32]} />
        <meshBasicMaterial
          color="#000011"
          side={THREE.BackSide}
          transparent
          opacity={0.8}
        />
      </mesh>
    </>
  )
}

// Camera Animation Controller
function CameraController() {
  const { camera } = useThree()

  useFrame(({ clock }) => {
    const time = clock.elapsedTime * 0.1

    // Gentle orbital movement
    camera.position.x = Math.sin(time) * 12
    camera.position.z = Math.cos(time) * 12
    camera.position.y = 2 + Math.sin(time * 0.5) * 1

    camera.lookAt(0, 0, 0)
  })

  return null
}

// Error Boundary Component
function SafeCanvas({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const handleError = () => setHasError(true)
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  if (hasError) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl text-emerald-400 font-bold">A3E</div>
          <div className="text-white text-xl">AI Intelligence Core</div>
          <div className="text-gray-400">Loading advanced visualization...</div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Main Component
export function AINexxusBackground({
  className = "",
  interactive = false
}: {
  className?: string
  interactive?: boolean
}) {
  return (
    <SafeCanvas>
      <div className={`w-full h-screen ${className}`}>
        <Canvas
          camera={{ position: [0, 2, 10], fov: 75 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
          dpr={[1, 1.5]}
          onCreated={({ gl }) => {
            gl.setClearColor('#000000', 0)
          }}
        >
          <AINexxusScene />

          {!interactive && <CameraController />}
          {interactive && <OrbitControls enablePan={false} enableZoom={false} enableRotate />}

          {/* Post-processing effects - simplified for better compatibility */}
          <EffectComposer>
            <Bloom
              intensity={1.2}
              luminanceThreshold={0.3}
              luminanceSmoothing={0.9}
            />
            <Vignette
              eskil={false}
              offset={0.1}
              darkness={0.3}
            />
          </EffectComposer>
        </Canvas>
      </div>
    </SafeCanvas>
  )
}