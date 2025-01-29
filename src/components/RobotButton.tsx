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

    console.log('Initializing 3D scene');

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#1A1F2C'); // Dark background
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true
    });

    renderer.setSize(100, 100);
    camera.position.z = 0.8;
    camera.position.y = 0.7; // Raised camera position to 0.7 to focus more on upper body

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 3);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(1, 2, 1);
    scene.add(directionalLight);

    // Load GLTF model
    const loader = new GLTFLoader();
    let model: THREE.Group;

    console.log('Loading model from:', '/models/international_model_toys/scene.gltf');

    loader.load(
      '/models/international_model_toys/scene.gltf',
      (gltf) => {
        console.log('Model loaded successfully');
        model = gltf.scene;
        
        // Scale and position adjustments
        model.scale.set(0.015, 0.015, 0.015);
        model.position.set(0, -0.15, 0);
        
        // Center the model using its bounding box
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        model.position.y += 0.1;
        
        // Set initial rotation to face forward
        model.rotation.y = 0;

        // Apply orange color to the model except for eyes
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Check if this mesh is part of the eyes (based on position)
            const isEyes = child.geometry.boundingSphere?.center.y > 40; // Eyes are positioned higher in the model
            if (!isEyes) {
              child.material = new THREE.MeshStandardMaterial({
                color: '#F97316', // Bright orange color
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

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (model) {
        // Only keep the subtle bobbing motion
        model.position.y = -0.15 + Math.sin(Date.now() * 0.002) * 0.01;
      }
      
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      console.log('Cleaning up scene');
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