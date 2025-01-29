import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';

const RobotButton = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });

    renderer.setSize(50, 50);
    camera.position.z = 5;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create robot
    const robotGroup = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.BoxGeometry(1.2, 1.5, 1);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    robotGroup.add(body);

    // Head
    const headGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const headMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.15;
    robotGroup.add(head);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.1);
    const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.2, 1.2, 0.4);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.2, 1.2, 0.4);
    
    robotGroup.add(leftEye);
    robotGroup.add(rightEye);

    scene.add(robotGroup);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      robotGroup.rotation.y += 0.02;
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <Button 
      className="fixed bottom-4 right-4 p-0 w-[50px] h-[50px] rounded-full overflow-hidden"
      variant="outline"
    >
      <canvas ref={canvasRef} />
    </Button>
  );
};

export default RobotButton;