import React, { useRef, useEffect } from 'react';
import { CharacterId } from '../types';
import { PixelRenderer } from '../graphics/pixelRenderer';

interface CharacterPreviewCanvasProps {
  character: CharacterId;
}

export const CharacterPreviewCanvas: React.FC<CharacterPreviewCanvasProps> = ({ character }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const renderer = new PixelRenderer(ctx);

    const render = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gameTime = time / 1000;
      const fakePlayer = {
        character,
        x: 28,
        y: 20,
        vx: 0,
        vy: 0,
        width: 24,
        height: 32,
        facing: 'RIGHT' as const,
        action: 'IDLE' as const,
        isGrounded: true,
        invulnerableTimer: 0,
        animationTimer: gameTime,
        frameIndex: (gameTime * 4) % 4,
        sparkEffectTimer: 0,
        lives: 3,
        maxLives: 3,
      };

      renderer.drawPlayer(fakePlayer, 0, gameTime);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [character]);

  return (
    <canvas
      ref={canvasRef}
      width={80}
      height={64}
      className="w-20 h-16 bg-slate-950/80 rounded border border-amber-900/40 pixelated mx-auto shadow-inner"
    />
  );
};
