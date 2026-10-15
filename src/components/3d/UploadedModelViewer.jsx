import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Center, Resize, Float } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * 3D Loading Placeholder inside Canvas
 */
function ModelLoadingIndicator() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 1.5;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.4;
    }
  });

  return (
    <group position={[0, 1.2, 0]}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color="#b5532f"
          wireframe
          emissive="#b5532f"
          emissiveIntensity={0.6}
        />
      </mesh>
      <pointLight color="#b5532f" intensity={2} distance={3} />
    </group>
  );
}

/**
 * UploadedModelViewer
 * Loads and renders an admin-uploaded GLB/GLTF file with:
 * - Automatic Bounding-Box Normalization & Centering
 * - Cast/Receive Shadow enablement
 * - Day / Sunset / Night lighting adaptation
 * - Blueprint CAD wireframe mode support
 * - Admin scale & Y-rotation controls
 */
export function UploadedModelViewer({
  modelUrl,
  scale = 1.0,
  rotationY = 0,
  posY = 0,
  mode = 'sunset',
  wireframe = false,
  onError,
}) {
  const [loadedScene, setLoadedScene] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (!modelUrl) {
      setLoadedScene(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const loader = new GLTFLoader();

    loader.load(
      modelUrl,
      (gltf) => {
        const root = gltf.scene || gltf.scenes[0];
        if (root) {
          // Enable shadows and configure materials
          root.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;

              // Ensure materials respond properly to lighting
              if (child.material) {
                child.material.side = THREE.DoubleSide;
                child.material.needsUpdate = true;
              }
            }
          });
          setLoadedScene(root);
          setLoading(false);
        } else {
          const err = new Error('No 3D scene found in the uploaded file.');
          setErrorMsg(err.message);
          setLoading(false);
          if (onError) onError(err);
        }
      },
      undefined,
      (error) => {
        console.error('[UploadedModelViewer] Error parsing 3D model:', error);
        setErrorMsg('Failed to load 3D model. Please verify it is a valid .glb or .gltf file.');
        setLoading(false);
        if (onError) onError(error);
      }
    );

    return () => {
      // Cleanup if needed
    };
  }, [modelUrl, onError]);

  // Handle blueprint CAD wireframe toggle
  const isWire = mode === 'blueprint' || wireframe;

  useEffect(() => {
    if (!loadedScene) return;

    loadedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => {
            mat.wireframe = isWire;
            if (isWire) mat.color = new THREE.Color('#38bdf8');
          });
        } else {
          child.material.wireframe = isWire;
          if (isWire) {
            child.material.color = new THREE.Color('#38bdf8');
          }
        }
      }
    });
  }, [loadedScene, isWire]);

  // Convert degrees to radians
  const rotYRad = useMemo(() => (rotationY * Math.PI) / 180, [rotationY]);

  if (loading) {
    return <ModelLoadingIndicator />;
  }

  if (errorMsg || !loadedScene) {
    return null;
  }

  return (
    <group
      position={[0, posY, 0]}
      rotation={[0, rotYRad, 0]}
    >
      {/* Center top automatically grounds the model on the shadow plane */}
      <Center top>
        {/* Resize normalizes the model's longest bounding dimension to 3.8 units */}
        <Resize scale={3.8 * scale}>
          <primitive object={loadedScene} />
        </Resize>
      </Center>
    </group>
  );
}

export default UploadedModelViewer;
