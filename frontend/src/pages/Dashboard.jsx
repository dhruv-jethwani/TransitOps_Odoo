import React, { useEffect, useRef, useState } from 'react';
import { Renderer, Camera, Transform, Mesh, Program, Triangle } from 'ogl';

export default function Dashboard() {
  const canvasRef = useRef(null);
  const [isDark, setIsDark] = useState(false);
  const currentRole = localStorage.getItem('user_role') || 'Guest';

  // High-performance hardware-accelerated OGL Background canvas effect
  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new Renderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    const gl = renderer.gl;
    
    const camera = new Camera(gl);
    camera.position.z = 1;

    const scene = new Transform();
    const geometry = new Triangle(gl);

    // Custom WebGL shader source codes for interactive data flow effect
    const program = new Program(gl, {
      vertex: `
        attribute vec2 position;
        varying vec2 vUv;
        void main() {
          vUv = position * 0.5 + 0.5;
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform float uTime;
        uniform vec3 uColor;
        varying vec2 vUv;
        void main() {
          float pulse = sin(vUv.x * 10.0 + uTime) * 0.5 + 0.5;
          gl_FragColor = vec4(uColor, pulse * 0.04);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: isDark ? [247/255, 103/255, 7/255] : [0, 0, 0] }
      },
      depthTest: false,
      transparent: true
    });

    const mesh = new Mesh(gl, { geometry, program });
    mesh.setParent(scene);

    let animationFrameId;
    const resize = () => {
      if (!canvasRef.current) return;
      renderer.setSize(canvasRef.current.parentElement.clientWidth, canvasRef.current.parentElement.clientHeight);
    };
    window.addEventListener('resize', resize);
    resize();

    const update = (t) => {
      animationFrameId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      program.uniforms.uColor.value = isDark ? [247/255, 103/255, 7/255] : [50/255, 50/255, 50/255];
      renderer.render({ scene, camera });
    };
    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [isDark]);

  return (
    <div className={`dashboard-layout ${isDark ? 'dark-theme' : 'light-theme'}`}>
      {/* OGL Canvas Layer sits directly behind the workspace grid */}
      <canvas ref={canvasRef} className="ogl-background-layer" />

      <header className="dashboard-header">
        <div className="header-brand">⚡ TRANSITOPS WORKSPACE</div>
        <div className="header-controls">
          <span className="role-display">Mode: <strong>{currentRole}</strong></span>
          <button className="theme-toggle-btn" onClick={() => setIsDark(!isDark)}>
            {isDark ? '☀️ Light View' : '🌙 Dark View'}
          </button>
        </div>
      </header>

      <section className="dashboard-view-content">
        <h2>Operations Center</h2>
        <p>Your custom application views go here.</p>
      </section>
    </div>
  );
}