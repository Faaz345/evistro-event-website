import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type ParticleBgProps = {
  color?: string;
  particleCount?: number;
  particleSize?: number;
  speed?: number;
};

const ParticleBg = ({ 
  color = '#FF0080', 
  particleCount = 200, 
  particleSize = 0.02, 
  speed = 0.001 
}: ParticleBgProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    // Set renderer properties
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // Create particles
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    // Generate random positions
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 5;
      positions[i + 1] = (Math.random() - 0.5) * 5;
      positions[i + 2] = (Math.random() - 0.5) * 5;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Material for particles
    const material = new THREE.PointsMaterial({
      size: particleSize,
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    // Create point cloud
    const pointCloud = new THREE.Points(particles, material);
    scene.add(pointCloud);

    // Position camera
    camera.position.z = 2;

    // Animation function
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Rotate the particles
      pointCloud.rotation.x += speed;
      pointCloud.rotation.y += speed * 0.8;
      
      renderer.render(scene, camera);
    };

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    animate();

    // Cleanup function
    return () => {
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // Dispose resources
      particles.dispose();
      material.dispose();
    };
  }, [color, particleCount, particleSize, speed]);

  return <div className="fixed inset-0 z-0 pointer-events-none" ref={containerRef} />;
};

export default ParticleBg; 