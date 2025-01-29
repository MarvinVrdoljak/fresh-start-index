import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const RobotButton = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const modelRef = useRef<THREE.Group | null>(null);
  const headRef = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    console.log('Initializing 3D scene');

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#1A1F2C');
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true
    });

    renderer.setSize(100, 100);
    camera.position.z = 0.8;
    camera.position.y = 0.7;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 3);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(1, 2, 1);
    scene.add(directionalLight);

    // Load GLTF model
    const loader = new GLTFLoader();

    console.log('Loading model from:', '/models/international_model_toys/scene.gltf');

    loader.load(
      '/models/international_model_toys/scene.gltf',
      (gltf) => {
        console.log('Model loaded successfully');
        const model = gltf.scene;
        modelRef.current = model;
        
        // Scale and position adjustments
        model.scale.set(0.015, 0.015, 0.015);
        model.position.set(0, -0.15, 0);
        
        // Center the model using its bounding box
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        model.position.y += 0.1;
        
        // Find the head part (assuming it's the highest part in the model)
        let highestY = -Infinity;
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const boundingSphere = child.geometry.boundingSphere;
            if (boundingSphere && boundingSphere.center.y > highestY) {
              highestY = boundingSphere.center.y;
              headRef.current = child;
              // Apply orange color only to the head part
              child.material = new THREE.MeshStandardMaterial({
                color: '#F97316',
                metalness: 0.5,
                roughness: 0.5,
              });
            }
          }
        });
        
        scene.add(model);
        console.log('Model added to scene');
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Error loading model:', error);
        toast({
          title: "Error",
          description: "Failed to load 3D model",
          variant: "destructive"
        });
      }
    );

    // Mouse movement handler
    const handleMouseMove = (event: MouseEvent) => {
      if (!headRef.current) return;

      const buttonRect = canvasRef.current?.getBoundingClientRect();
      if (!buttonRect) return;

      const mouseX = ((event.clientX - buttonRect.left) / buttonRect.width) * 2 - 1;
      const mouseY = -((event.clientY - buttonRect.top) / buttonRect.height) * 2 + 1;

      // Apply rotation only to the head
      const targetRotationX = mouseY * 0.3;
      const targetRotationY = mouseX * 0.3;

      headRef.current.rotation.x = targetRotationX;
      headRef.current.rotation.y = targetRotationY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (modelRef.current) {
        // Only keep the subtle bobbing motion
        modelRef.current.position.y = -0.15 + Math.sin(Date.now() * 0.002) * 0.01;
      }
      
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      console.log('Cleaning up scene');
      window.removeEventListener('mousemove', handleMouseMove);
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <Button 
      className="fixed bottom-4 right-4 p-0 w-[100px] h-[100px] rounded-full overflow-hidden group bg-[#1A1F2C] hover:bg-[#1A1F2C]/90"
      variant="outline"
      title="Int'l Model Toys - 3D Model"
    >
      <canvas ref={canvasRef} className="transition-opacity group-hover:opacity-90" />
    </Button>
  );
};

export default RobotButton;
