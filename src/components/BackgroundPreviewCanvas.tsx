import React, { useEffect, useRef } from 'react';
import { BackgroundThemeId } from '../types';
import { PixelRenderer } from '../graphics/pixelRenderer';

interface BackgroundPreviewCanvasProps {
  theme: BackgroundThemeId;
  width?: number;
  height?: number;
}

export const BackgroundPreviewCanvas: React.FC<BackgroundPreviewCanvasProps> = ({
  theme,
  width = 160,
  height = 96,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const renderer = new PixelRenderer(ctx);
    let reqId: number;
    let startTime = performance.now();

    // Mock clouds and spires for preview
    const previewClouds = [
      { x: 10, y: 15, width: 40, height: 16, speed: 10, opacity: 0.8, layer: 0 },
      { x: 70, y: 35, width: 50, height: 18, speed: 15, opacity: 0.8, layer: 0 },
      { x: 120, y: 20, width: 35, height: 14, speed: 12, opacity: 0.8, layer: 0 },
    ];

    const previewSpires = [
      { x: 20, y: 45, width: 22, height: 55, type: 'tower' as const, windowLit: true },
      { x: 60, y: 60, width: 34, height: 40, type: 'bridge' as const, windowLit: false },
      { x: 110, y: 40, width: 26, height: 60, type: 'tower' as const, windowLit: true },
    ];

    const loop = (currentTime: number) => {
      const gameTime = (currentTime - startTime) / 1000;
      const cameraX = (gameTime * 20) % 500;

      // Render background theme
      renderer.drawBackground(
        width,
        height,
        gameTime,
        previewClouds,
        cameraX,
        previewSpires,
        theme
      );

      reqId = requestAnimationFrame(loop);
    };

    reqId = requestAnimationFrame(loop);

    return () => {
      if (reqId) {
        cancelAnimationFrame(reqId);
      }
    };
  }, [theme, width, height]);

  return (
    <div className="relative overflow-hidden rounded border border-amber-600/60 shadow-inner bg-slate-950 flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-auto block select-none"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};
