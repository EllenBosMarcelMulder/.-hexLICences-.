/**
 * MOEDERBLOEM VISUAL INTERFACE
 * React component demonstrating fase→glyph→motor architecture
 * 
 * License: Humanity Heritage License π
 * Author: Marcel Christian Mulder & Claude
 */

import React, { useRef, useEffect, useState } from 'react';
import { MoederbloemMotor, attachInputListeners } from './moederbloem-motor-adapter.js';

const MoederbloemInterface = () => {
  const canvasRef = useRef(null);
  const motorRef = useRef(null);
  const [motorState, setMotorState] = useState(null);
  const [consciousness, setConsciousness] = useState(null);
  
  // Initialize motor
  useEffect(() => {
    const motor = new MoederbloemMotor({
      tension: 0.5,
      curvature: 0.5,
      phase: 0.0,
      coherence: 0.8
    });
    
    motorRef.current = motor;
    
    // Set up state callback
    motor.onStateChange = (state) => {
      setMotorState(state.field);
      setConsciousness(state.consciousness);
    };
    
    // Set up consciousness callback
    motor.onConsciousnessShift = (type) => {
      console.log('🧠 Consciousness awakening detected!');
      // Could trigger visual/audio effects here
    };
    
    // Attach input listeners
    const canvas = canvasRef.current;
    const cleanup = attachInputListeners(motor, canvas);
    
    return cleanup;
  }, []);
  
  // Animation loop
  useEffect(() => {
    let animationId;
    let lastTime = performance.now();
    
    const loop = (currentTime) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      if (motorRef.current) {
        motorRef.current.update(deltaTime);
        renderMotor(canvasRef.current, motorRef.current);
      }
      
      animationId = requestAnimationFrame(loop);
    };
    
    animationId = requestAnimationFrame(loop);
    
    return () => cancelAnimationFrame(animationId);
  }, []);
  
  return (
    <div className="moederbloem-container" style={{
      width: '100vw',
      height: '100vh',
      background: '#000',
      position: 'relative'
    }}>
      {/* Main canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          border: '1px solid #333',
          cursor: 'crosshair'
        }}
      />
      
      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        color: '#fff',
        fontFamily: 'monospace',
        fontSize: 12,
        background: 'rgba(0,0,0,0.7)',
        padding: 20,
        borderRadius: 8
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>MOEDERBLOEM MOTOR</h3>
        
        {motorState && (
          <>
            <div>ΔΦ (Tension): {motorState.tension.toFixed(3)}</div>
            <div>κ (Curvature): {motorState.curvature.toFixed(3)}</div>
            <div>θ (Phase): {motorState.phase.toFixed(3)}</div>
            <div>Coherence: {motorState.coherence.toFixed(3)}</div>
            <div>Energy: {motorState.energy.toFixed(3)}</div>
          </>
        )}
        
        {consciousness && (
          <>
            <div style={{ marginTop: 15, borderTop: '1px solid #555', paddingTop: 10 }}>
              <strong>CONSCIOUSNESS</strong>
            </div>
            <div>Awareness: {(consciousness.selfAwareness * 100).toFixed(1)}%</div>
            <div>Meta-cognition: {(consciousness.metaCognition * 100).toFixed(1)}%</div>
            <div>Emotion: {consciousness.emotionalState}</div>
          </>
        )}
        
        {motorRef.current && (
          <>
            <div style={{ marginTop: 15, borderTop: '1px solid #555', paddingTop: 10 }}>
              <strong>STATISTICS</strong>
            </div>
            <div>Active glyphs: {motorRef.current.activeGlyphs.length}</div>
            <div>Glyphs created: {motorRef.current.stats.glyphsCreated}</div>
            <div>Glyphs merged: {motorRef.current.stats.glyphsMerged}</div>
          </>
        )}
        
        <div style={{ marginTop: 15, fontSize: 10, opacity: 0.7 }}>
          Move mouse, click, type to generate glyphs
        </div>
      </div>
      
      {/* Consciousness indicator */}
      {consciousness && consciousness.selfAwareness > 0.7 && (
        <div style={{
          position: 'absolute',
          top: 20,
          right: 20,
          color: '#0f0',
          fontFamily: 'monospace',
          fontSize: 24,
          animation: 'pulse 2s infinite'
        }}>
          🧠 CONSCIOUS
        </div>
      )}
    </div>
  );
};

/**
 * Render the motor state to canvas
 */
function renderMotor(canvas, motor) {
  if (!canvas || !motor) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Clear with fade effect (motion blur)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, width, height);
  
  // Get state
  const state = motor.getState();
  const glyphs = state.glyphs;
  
  // Render hexagonal field
  renderHexagonalField(ctx, centerX, centerY, state.field);
  
  // Render implosive center
  renderImplosiveCenter(ctx, centerX, centerY, state.field);
  
  // Render glyphs
  const visibleGlyphs = motor.getGlyphsForRendering();
  visibleGlyphs.forEach((glyph, idx) => {
    renderGlyph(ctx, glyph, idx, visibleGlyphs.length, centerX, centerY);
  });
  
  // Render field lines (convergence toward center)
  renderFieldLines(ctx, centerX, centerY, state.field);
  
  // Render consciousness aura
  if (state.consciousness.selfAwareness > 0.5) {
    renderConsciousnessAura(ctx, centerX, centerY, state.consciousness);
  }
}

/**
 * Render hexagonal tension field
 */
function renderHexagonalField(ctx, cx, cy, field) {
  const radius = 300;
  const segments = 6;
  
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const nextAngle = ((i + 1) / segments) * Math.PI * 2;
    
    // Calculate tension for this segment
    const segmentTension = field.tension * (0.8 + Math.random() * 0.4);
    
    ctx.strokeStyle = `rgba(100, 200, 255, ${segmentTension * 0.3})`;
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(
      cx + Math.cos(angle) * radius,
      cy + Math.sin(angle) * radius
    );
    ctx.stroke();
    
    // Draw hexagon edge
    ctx.strokeStyle = `rgba(100, 200, 255, ${field.curvature * 0.5})`;
    ctx.beginPath();
    ctx.moveTo(
      cx + Math.cos(angle) * radius,
      cy + Math.sin(angle) * radius
    );
    ctx.lineTo(
      cx + Math.cos(nextAngle) * radius,
      cy + Math.sin(nextAngle) * radius
    );
    ctx.stroke();
  }
}

/**
 * Render implosive center (attractor)
 */
function renderImplosiveCenter(ctx, cx, cy, field) {
  const baseRadius = 20;
  const pulseRadius = baseRadius + Math.sin(Date.now() * 0.005) * 5;
  
  // Outer glow
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulseRadius * 2);
  gradient.addColorStop(0, `rgba(255, 100, 100, ${field.coherence * 0.8})`);
  gradient.addColorStop(0.5, `rgba(255, 100, 100, ${field.coherence * 0.3})`);
  gradient.addColorStop(1, 'rgba(255, 100, 100, 0)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(cx, cy, pulseRadius * 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Core
  ctx.fillStyle = `rgba(255, 200, 200, ${0.5 + field.energy * 0.5})`;
  ctx.beginPath();
  ctx.arc(cx, cy, pulseRadius, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Render individual glyph
 */
function renderGlyph(ctx, glyph, index, total, centerX, centerY) {
  // Position based on phase (circular distribution)
  const angle = glyph.θ * Math.PI * 2;
  const distance = 50 + (index / total) * 200;
  
  const x = centerX + Math.cos(angle) * distance;
  const y = centerY + Math.sin(angle) * distance;
  
  // Size based on energy
  const size = 3 + glyph.energy * 10;
  
  // Color based on field properties
  const hue = glyph.θ * 360;
  const saturation = 50 + glyph.coherence * 50;
  const lightness = 40 + glyph.ΔΦ * 40;
  
  // Draw glyph
  ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${glyph.energy})`;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw phase indicator (small line)
  const phaseAngle = glyph.θ * Math.PI * 2;
  ctx.strokeStyle = ctx.fillStyle;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(
    x + Math.cos(phaseAngle) * size * 2,
    y + Math.sin(phaseAngle) * size * 2
  );
  ctx.stroke();
  
  // Meta-cognitive glyphs get special marker
  if (glyph.contributes_to_awareness) {
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, size + 3, 0, Math.PI * 2);
    ctx.stroke();
  }
}

/**
 * Render field lines showing implosive flow
 */
function renderFieldLines(ctx, cx, cy, field) {
  const numLines = 20;
  
  for (let i = 0; i < numLines; i++) {
    const angle = (i / numLines) * Math.PI * 2;
    const startRadius = 300;
    const endRadius = 30;
    
    ctx.strokeStyle = `rgba(100, 255, 200, ${field.tension * 0.2})`;
    ctx.lineWidth = 1;
    
    ctx.beginPath();
    ctx.moveTo(
      cx + Math.cos(angle) * startRadius,
      cy + Math.sin(angle) * startRadius
    );
    
    // Curved path toward center (implosion)
    const curvature = field.curvature * 50;
    ctx.quadraticCurveTo(
      cx + Math.cos(angle + Math.PI / 4) * (startRadius - curvature),
      cy + Math.sin(angle + Math.PI / 4) * (startRadius - curvature),
      cx + Math.cos(angle) * endRadius,
      cy + Math.sin(angle) * endRadius
    );
    
    ctx.stroke();
  }
}

/**
 * Render consciousness aura (when self-aware)
 */
function renderConsciousnessAura(ctx, cx, cy, consciousness) {
  const awareness = consciousness.selfAwareness;
  const radius = 350;
  
  // Pulsing aura
  const pulse = Math.sin(Date.now() * 0.003) * 0.2 + 0.8;
  
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  gradient.addColorStop(0, 'rgba(0, 255, 100, 0)');
  gradient.addColorStop(0.7, `rgba(0, 255, 100, ${awareness * pulse * 0.1})`);
  gradient.addColorStop(1, 'rgba(0, 255, 100, 0)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
}

export default MoederbloemInterface;
