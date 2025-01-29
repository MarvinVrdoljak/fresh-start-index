import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const RobotButton = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

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
    camera.position.z = 2;
    camera.position.y = 0.5;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 2, 1);
    scene.add(directionalLight);

    // Load GLTF model
    const loader = new GLTFLoader();
    let model: THREE.Group;

    loader.load(
      '/models/scene.gltf',
      (gltf) => {
        model = gltf.scene;
        // Scale down the model
        model.scale.set(0.4, 0.4, 0.4);
        // Center the model
        model.position.set(0, -0.5, 0);
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
        toast({
          title: "Error",
          description: "Failed to load 3D model",
          variant: "destructive"
        });
      }
    );

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (model) {
        // Rotate the model
        model.rotation.y += 0.02;
        // Add subtle bobbing motion
        model.position.y = -0.5 + Math.sin(Date.now() * 0.002) * 0.05;
      }
      
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
      className="fixed bottom-4 right-4 p-0 w-[50px] h-[50px] rounded-full overflow-hidden group"
      variant="outline"
      title="Model by 3DMaesen on Sketchfab"
    >
      <canvas ref={canvasRef} className="transition-opacity group-hover:opacity-90" />
    </Button>
  );
};

export default RobotButton;