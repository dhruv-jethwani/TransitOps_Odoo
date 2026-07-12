import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Renderer, Camera, Transform, Mesh, Program, Triangle } from 'ogl';

export default function Landing() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isDark, setIsDark] = useState(false);

  // High-performance custom OGL layout engine fluid backdrop
  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new Renderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    const gl = renderer.gl;
    
    const camera = new Camera(gl);
    camera.position.z = 1;

    const scene = new Transform();
    const geometry = new Triangle(gl);

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
          // Dynamic undulating vector lines reflecting active logistics flow
          float wave1 = sin(vUv.x * 4.0 + uTime * 0.5) * cos(vUv.y * 3.0 - uTime * 0.3);
          float wave2 = cos(vUv.y * 6.0 - uTime * 0.7) * sin(vUv.x * 2.0 + uTime * 0.4);
          float finalPattern = smoothstep(0.1, 0.9, abs(wave1 + wave2));
          gl_FragColor = vec4(uColor, finalPattern * 0.06);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: [247/255, 103/255, 7/255] }
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
      // Adjust color vector matrix smoothly depending on target theme variables
      program.uniforms.uColor.value = isDark ? [254/255, 150/255, 40/255] : [247/255, 103/255, 7/255];
      renderer.render({ scene, camera });
    };
    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [isDark]);

  return (
    <div className={`app-canvas-container ${isDark ? 'dark-theme' : 'light-theme'}`}>
      
      {/* Background OGL Shader Graphic */}
      <canvas ref={canvasRef} className="clay-canvas-layer" />

      {/* Persistent Global Header Command Bar */}
      <header className="clay-navbar">
        <div className="nav-brand">
          <span className="brand-orb"></span>
          <span className="brand-logo-text">TRANSITOPS</span>
        </div>
        <button className="clay-toggle-btn" onClick={() => setIsDark(!isDark)}>
          {isDark ? '✨ Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>

      {/* Main Structural Layout Grid */}
      <main className="landing-workspace">
        <div className="clay-hero-split">
          
          {/* Left Hero Command Box */}
          <div className="clay-hero-card">
            <span className="clay-badge-pill">v2.4 Live Operations</span>
            
            <h1 className="clay-title-heavy">
              Next-Gen Fleet <br />
              <span className="gradient-highlight">Operations Console</span>
            </h1>
            
            <p className="clay-lead-para">
              Eliminate fragmented logs and spreadsheet overhead. TransitOps unifies real-time 
              dispatching, maintenance automation, and financial performance tracking inside a highly tactile workspace.
            </p>

            {/* Replace the old clay-action-cluster div with this updated button block */}
			<div className="clay-action-cluster">
			<button 
				className="clay-btn clay-btn-primary" 
				onClick={() => navigate('/login')}
			>
				Sign In
			</button>
			<button 
				className="clay-btn clay-btn-secondary" 
				onClick={() => navigate('/register')}
			>
				Sign Up
			</button>
			</div>
          </div>

          {/* Right Volumetric Card Layout */}
          <div className="clay-matrix-stack">
            {[
              { icon: '🚀', title: 'Airtight Dispatching', desc: 'Instant multi-state vehicle validation blocking double allocations or expired licensing profiles automatically.' },
              { icon: '🔧', title: 'Shop Workflow Logic', desc: 'Automated "In Shop" triggers that immediately update status fields and pull down assets from operational dropdown arrays.' },
              { icon: '📊', title: 'Dynamic ROI Calculations', desc: 'Real-time database metric aggregations mapping absolute fuel performance against fixed acquisition costs.' }
            ].map((card, index) => (
              <div key={index} className="clay-volumetric-card">
                <div className="clay-card-icon-wrapper">{card.icon}</div>
                <div className="clay-card-body">
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

    </div>
  );
}