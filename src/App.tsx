import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ARProvider } from './arjs/ARProvider';
import { Canvas } from '@react-three/fiber';
import { ARMarker } from './arjs/ARMarker';

function App() {
    return (
        <Canvas
            onCreated={({ gl, camera }) => {
                //gl.setSize(window.innerWidth, window.innerHeight);
                //camera.updateProjectionMatrix()
                camera.near = 1;
                camera.far = 10000;
            }}
            gl={{
                alpha: true,
                antialias: true,
                precision: 'highp',
                logarithmicDepthBuffer: true,
            }}
            shadows
        >
            <ARProvider
                contextProps={{
                    debug: false,
                    cameraParametersUrl: `/data/camera_para.dat`,
                    detectionMode: 'color',
                    matrixCodeType: '4x4_BCH_13_9_3',
                    maxDetectionRate: 60,
                    imageSmoothingEnabled: true,
                }}
            >
                <ARMarker
                    descriptorsUrl={`${process.env.REACT_APP_URL}/marker/insta`}
                    size={0.3}
                    smooth
                    smoothCount={6}
                    smoothTolerance={0.05}
                    smoothThreshold={2}
                    matrixAutoUpdate={false}
                >
                    <mesh>
                        <boxGeometry args={[100, 10, 100]} />
                    </mesh>
                </ARMarker>
            </ARProvider>
        </Canvas>
    );
}

export default App;
