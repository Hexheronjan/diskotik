"use client";

// High-performance Three.js stage scene:
// High-energy Diskotik Mirror Ball & Dynamic Laser Spotlights.
// Renders smoothly at 60fps with zero scroll jank and strict resource disposal.
import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./HeroScene.module.css";

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl2") || canvas.getContext("webgl")));
  } catch {
    return false;
  }
}

export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !webglAvailable()) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.setClearColor(0x000000, 0);

    const canvas = renderer.domElement;
    canvas.className = styles.canvas;
    mount.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 80);
    camera.position.set(0, 1.6, 8.5);
    camera.lookAt(0, 1.1, 0);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambientLight);

    // Diskotik Laser Spotlight beams
    const cyanLight = new THREE.PointLight(0x00f0ff, 3.6, 20);
    cyanLight.position.set(4, 5, 3);
    scene.add(cyanLight);

    const magentaLight = new THREE.PointLight(0xe0246a, 3.4, 20);
    magentaLight.position.set(-4, 4, 3);
    scene.add(magentaLight);

    const goldLight = new THREE.PointLight(0xd4af37, 2.5, 16);
    goldLight.position.set(0, -1, 4);
    scene.add(goldLight);

    // Disco Mirror Ball centerpiece: faceted reflective sphere
    const sphereGeometry = new THREE.IcosahedronGeometry(1.65, 3);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f1b24,
      metalness: 0.95,
      roughness: 0.15,
      flatShading: true,
    });
    const discoBall = new THREE.Mesh(sphereGeometry, sphereMaterial);
    discoBall.position.set(0, 1.35, 0);
    scene.add(discoBall);

    // Disco Dancefloor Grid
    const floorGeometry = new THREE.PlaneGeometry(36, 36);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a090e,
      roughness: 0.4,
      metalness: 0.6,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.5;
    scene.add(floor);

    const grid = new THREE.GridHelper(36, 18, 0xe0246a, 0x1a1626);
    grid.position.y = -0.48;
    scene.add(grid);

    const resize = () => {
      const w = Math.max(1, mount.clientWidth);
      const h = Math.max(1, mount.clientHeight);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = camera.aspect < 0.8 ? 58 : 45;
      camera.updateProjectionMatrix();
    };

    let reduced = reducedQuery.matches;
    let raf = 0;
    let last = performance.now();
    let elapsed = 0;

    const draw = () => {
      // Rotating disco ball
      discoBall.rotation.y = elapsed * 0.22;
      discoBall.rotation.x = Math.sin(elapsed * 0.12) * 0.08;

      // Orbiting laser lights
      cyanLight.position.x = Math.cos(elapsed * 0.5) * 5;
      cyanLight.position.z = Math.sin(elapsed * 0.5) * 4 + 1;

      magentaLight.position.x = Math.sin(elapsed * 0.6) * -5;
      magentaLight.position.z = Math.cos(elapsed * 0.6) * 4 + 1;

      renderer.render(scene, camera);
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      elapsed += Math.min(0.05, (now - last) / 1000);
      last = now;
      draw();
    };

    const start = () => {
      if (raf || reduced) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const observer = new ResizeObserver(() => {
      resize();
      draw();
    });
    observer.observe(mount);
    resize();

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    const onMotion = () => {
      reduced = reducedQuery.matches;
      stop();
      if (reduced) draw();
      else start();
    };
    reducedQuery.addEventListener("change", onMotion);

    if (reduced) draw();
    else start();

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
      reducedQuery.removeEventListener("change", onMotion);
      observer.disconnect();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      floorGeometry.dispose();
      floorMaterial.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return <div ref={mountRef} className={styles.root} aria-hidden="true" />;
}
