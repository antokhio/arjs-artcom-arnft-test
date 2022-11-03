import React, { useEffect, useRef, useState } from 'react';
import { MarkerControlsProps } from './types';
//@ts-expect-error
import * as THREEx from '@ar-js-org/ar.js/three.js/build/ar-threex.js';
import * as THREE from 'three';
import { useARJS } from './ARProvider';
import { useFrame } from '@react-three/fiber';

type ARMarkerProps = {
    onMarkerLost?: () => void;
    onMarkerFound?: () => void;
} & MarkerControlsProps &
    Omit<JSX.IntrinsicElements['group'], 'type'>;

export const ARMarker = ({
    size = 1.0,
    type = 'nft',
    patternUrl = null,
    barcodeValue = null,
    descriptorsUrl = null,
    changeMatrixMode = 'modelViewMatrix',
    minConfidence = 0.6,
    smooth = false,
    smoothCount = 5,
    smoothTolerance = 0.01,
    smoothThreshold = 2,
    onMarkerLost,
    onMarkerFound,
    children,
    ...props
}: ARMarkerProps) => {
    const markerRef = useRef<THREE.Group>(null!);
    const { arToolkitContext } = useARJS();

    const [isFound, setIsFound] = useState(false);

    useEffect(() => {
        if (!arToolkitContext) return;

        const markerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRef.current, {
            size,
            type,
            patternUrl,
            barcodeValue,
            //descriptorsUrl: [`/marker/insta.fset`, `/marker/insta.fset3`, `/marker/insta.iset`],
            descriptorsUrl: `/marker/insta`,
            changeMatrixMode,
            minConfidence,
            smooth,
            smoothCount,
            smoothTolerance,
            smoothThreshold,
        });

        return () => {
            const index = arToolkitContext._arMarkersControls.indexOf(markerControls);
            arToolkitContext._arMarkersControls.splice(index, 1);
        };
    }, []);

    useFrame(() => {
        if (markerRef.current.visible && !isFound) {
            setIsFound(true);
            if (onMarkerFound) {
                onMarkerFound();
            }
        } else if (!markerRef.current.visible && isFound) {
            setIsFound(false);
            if (onMarkerLost) {
                onMarkerLost();
            }
        }
    });

    return (
        <group ref={markerRef} {...props}>
            {children}
        </group>
    );
};
