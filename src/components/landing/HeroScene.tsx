import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 6);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const pointLight1 = new THREE.PointLight(0x10b981, 80, 20);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);
    const pointLight2 = new THREE.PointLight(0x0d9488, 60, 20);
    pointLight2.position.set(-5, -5, 3);
    scene.add(pointLight2);

    const group = new THREE.Group();
    scene.add(group);

    const count = 20;
    const positions1: THREE.Vector3[] = [];
    const positions2: THREE.Vector3[] = [];

    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 4;
      const radius = 0.6;
      positions1.push(new THREE.Vector3(Math.cos(t) * radius, (i / count) * 4 - 2, Math.sin(t) * radius));
      positions2.push(new THREE.Vector3(Math.cos(t + Math.PI) * radius, (i / count) * 4 - 2, Math.sin(t + Math.PI) * radius));
    }

    const sphereGeo = new THREE.SphereGeometry(0.08, 16, 16);

    positions1.forEach((pos, i) => {
      const mat = new THREE.MeshStandardMaterial({
        color: i % 5 === 0 ? 0x059669 : 0x34d399,
        roughness: 0.3, metalness: 0.6,
        emissive: i % 5 === 0 ? 0x059669 : 0x10b981,
        emissiveIntensity: 0.15,
      });
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.copy(pos);
      group.add(mesh);
    });

    positions2.forEach((pos, i) => {
      const mat = new THREE.MeshStandardMaterial({
        color: i % 5 === 0 ? 0x0d9488 : 0x5eead4,
        roughness: 0.3, metalness: 0.6,
        emissive: i % 5 === 0 ? 0x0d9488 : 0x14b8a6,
        emissiveIntensity: 0.15,
      });
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.copy(pos);
      group.add(mesh);
    });

    const cylGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.2, 8);
    positions1.forEach((p1, i) => {
      if (i % 3 !== 0) return;
      const p2 = positions2[i];
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const mat = new THREE.MeshStandardMaterial({ color: 0x6ee7b7, transparent: true, opacity: 0.5 });
      const mesh = new THREE.Mesh(cylGeo, mat);
      mesh.position.copy(mid);
      const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const quaternion = new THREE.Quaternion().setFromUnitVectors(up, dir);
      mesh.setRotationFromQuaternion(quaternion);
      group.add(mesh);
    });

    const orbData = [
      { pos: [-3, 1.5, -2], color: 0x10b981, size: 0.4 },
      { pos: [3, -1, -1], color: 0x0d9488, size: 0.3 },
      { pos: [2.5, 2, -3], color: 0x6ee7b7, size: 0.5 },
      { pos: [-2, -2, -2], color: 0x34d399, size: 0.35 },
    ] as const;

    const orbs = orbData.map(({ pos, color, size }) => {
      const geo = new THREE.SphereGeometry(size, 32, 32);
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.2, metalness: 0.6, transparent: true, opacity: 0.5 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(pos[0], pos[1], pos[2]);
      scene.add(mesh);
      return mesh;
    });

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      group.rotation.y = t * 0.3;
      orbs.forEach((orb, i) => {
        orb.position.y = orbData[i].pos[1] + Math.sin(t * 0.8 + i * 1.2) * 0.3;
        orb.rotation.y = t * 0.5;
      });
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block' }}
    />
  );
}
