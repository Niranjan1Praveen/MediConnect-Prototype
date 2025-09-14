'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

// 🔑 Accept a scale prop and forward it
function Model({ url, scale = 1 }) {
  const gltf = useGLTF(url);
  return <primitive object={gltf.scene} scale={scale} />;
}

export default function GLBModelViewer({ url,  height = 400, scale = 1}) {
  return (
    <div className="w-[500px]" style={{ height: `${height}px` }}>
      <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 5]} />
        <Suspense fallback={null}>
          {/* Pass the scale down to the model */}
          <Model url={url} scale={scale} />
        </Suspense>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
