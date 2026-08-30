import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine, GameInputState } from '../game/GameEngine';
import { PixelRenderer } from '../graphics/pixelRenderer';
import { ScoreBoard } from './ScoreBoard';
import { VirtualControls } from './VirtualControls';
import { MenuOverlay } from './MenuOverlay';
import { GameOverModal } from './GameOverModal';
import { InstructionsModal } from './InstructionsModal';
import { LeaderboardModal } from './LeaderboardModal';
import { LoadingScreen } from './LoadingScreen';
import { CharacterSelectScreen } from './CharacterSelectScreen';
import { BackgroundSelectScreen } from './BackgroundSelectScreen';
import { MapInstructionsScreen } from './MapInstructionsScreen';
import { CharacterLoadingScreen } from './CharacterLoadingScreen';
import { OrientationPrompt } from './OrientationPrompt';
import { soundManager } from '../audio/soundManager';
import { CharacterId, BackgroundThemeId } from '../types';

export const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<GameEngine>(new GameEngine());
  const rendererRef = useRef<PixelRenderer | null>(null);
  const reqIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // UI state synchronizer
  const [, setTick] = useState(0);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [soundMuted, setSoundMuted] = useState(soundManager.isMuted);
  const [bgmMuted, setBgmMuted] = useState(soundManager.isBgmMuted);
  
  // Mobile / Landscape detection
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isPortraitMobile, setIsPortraitMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const engine = engineRef.current;

  // Touch and orientation & Fullscreen detection
  useEffect(() => {
    const checkTouchAndOrientation = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(hasTouch);

      const isMobileWidth = window.innerWidth <= 900;
      const isPortrait = window.innerHeight > window.innerWidth;
      setIsPortraitMobile(hasTouch && isMobileWidth && isPortrait);
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    checkTouchAndOrientation();
    window.addEventListener('resize', checkTouchAndOrientation);
    window.addEventListener('orientationchange', checkTouchAndOrientation);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('resize', checkTouchAndOrientation);
      window.removeEventListener('orientationchange', checkTouchAndOrientation);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Dynamic Widescreen Canvas Resize (Edge-to-Edge Full Screen for PC & Mobile Landscape)
  useEffect(() => {
    const updateCanvasResolution = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientWidth = rect.width || window.innerWidth;
      const clientHeight = rect.height || window.innerHeight;
      if (clientWidth <= 0 || clientHeight <= 0) return;

      const baseHeight = 600;
      const aspect = clientWidth / clientHeight;
      const calculatedWidth = Math.max(800, Math.round(baseHeight * aspect));

      const canvas = canvasRef.current;
      if (Math.abs(canvas.width - calculatedWidth) > 2 || canvas.height !== baseHeight) {
        canvas.width = calculatedWidth;
        canvas.height = baseHeight;
        engine.setCanvasDimensions(calculatedWidth, baseHeight);
      }
    };

    updateCanvasResolution();
    const observer = new ResizeObserver(() => {
      updateCanvasResolution();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('resize', updateCanvasResolution);
    window.addEventListener('orientationchange', updateCanvasResolution);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateCanvasResolution);
      window.removeEventListener('orientationchange', updateCanvasResolution);
    };
  }, [engine]);

  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if ((elem as unknown as { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
          await (elem as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as unknown as { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
          await (document as unknown as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  };

  // Keyboard Event Handlers

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling when pressing arrow keys or space
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === 'KeyP' || e.code === 'Escape') {
        engine.pauseGame();
        setTick(t => t + 1);
        return;
      }

      const inputUpdates: Partial<GameInputState> = {};
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') inputUpdates.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') inputUpdates.right = true;
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
        inputUpdates.up = true;
        inputUpdates.jump = true;
      }
      if (e.code === 'ArrowDown' || e.code === 'KeyS') inputUpdates.down = true;
      if (e.code === 'KeyF' || e.code === 'KeyX' || e.code === 'KeyC') inputUpdates.spark = true;

      Object.assign(engine.inputs, inputUpdates);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const inputUpdates: Partial<GameInputState> = {};
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') inputUpdates.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') inputUpdates.right = false;
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
        inputUpdates.up = false;
        inputUpdates.jump = false;
      }
      if (e.code === 'ArrowDown' || e.code === 'KeyS') inputUpdates.down = false;
      if (e.code === 'KeyF' || e.code === 'KeyX' || e.code === 'KeyC') inputUpdates.spark = false;

      Object.assign(engine.inputs, inputUpdates);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [engine]);

  // Attach real-time engine state change listener
  useEffect(() => {
    engine.onStateChange = () => {
      setTick(t => t + 1);
    };
    return () => {
      engine.onStateChange = undefined;
    };
  }, [engine]);

  // Main Canvas Render & Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    rendererRef.current = new PixelRenderer(ctx);
    const renderer = rendererRef.current;

    let prevGameState = engine.gameState;
    let prevLives = engine.player.lives;
    let prevScore = engine.score;
    let prevLevel = engine.currentLevel;

    const loop = (currentTime: number) => {
      try {
        const rawDt = (currentTime - lastTimeRef.current) / 1000;
        const dt = Math.min(Math.max(rawDt, 0.001), 0.033);
        lastTimeRef.current = currentTime;

        // Update engine
        engine.update(dt);

        // Immediate detection of Game Over, Victory, Level, Lives, or Score changes
        if (
          engine.gameState !== prevGameState ||
          engine.player.lives !== prevLives ||
          engine.score !== prevScore ||
          engine.currentLevel !== prevLevel
        ) {
          prevGameState = engine.gameState;
          prevLives = engine.player.lives;
          prevScore = engine.score;
          prevLevel = engine.currentLevel;
          setTick(t => t + 1);
        }

        // Render Everything
        // 1. Unified Dynamic Background (Dark Clouds, Dark Dungeon, or Creepy Forest)
        renderer.drawBackground(
          canvas.width,
          canvas.height,
          engine.gameTime,
          engine.clouds,
          engine.cameraX,
          engine.spires,
          engine.selectedBackground
        );

        // 2. Platforms & Archways
        renderer.drawPlatforms(engine.platforms, engine.cameraX, engine.gameTime);

        // 4. Galleon Coins
        engine.coins.forEach(coin => renderer.drawCoin(coin, engine.cameraX));

        // 5. Lord Voldemort Patrolling Enemies
        engine.enemies.forEach(voldemort => renderer.drawEnemy(voldemort, engine.cameraX, engine.gameTime));

        // 6. Professor Dumbledore Extra HP Blessings
        engine.dumbledores.forEach(dumbledore => renderer.drawDumbledore(dumbledore, engine.cameraX, engine.gameTime));

        // 7. Flying Owls
        engine.owls.forEach(owl => renderer.drawOwl(owl, engine.cameraX, engine.gameTime));

        // 8. Player Sprite (Harry, Ron, or Hermione)
        renderer.drawPlayer(engine.player, engine.cameraX, engine.gameTime);

        // 9. Magic Particles
        renderer.drawParticles(engine.particles, engine.cameraX);

        // 10. Coin & HP Pickup Float Text (+1)
        engine.drawScorePickups(ctx);

        // 11. Level-Up Toast Announcement
        renderer.drawLevelAnnouncement(engine.levelAnnouncement, canvas.width, canvas.height);
      } catch (err) {
        console.error('Error during game loop execution:', err);
      }

      reqIdRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    reqIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (reqIdRef.current) {
        cancelAnimationFrame(reqIdRef.current);
      }
    };
  }, [engine]);

  // Virtual Controls input receiver
  const handleVirtualInput = useCallback((state: Partial<GameInputState>) => {
    Object.assign(engine.inputs, state);
  }, [engine]);

  const handleLoadingComplete = () => {
    engine.gameState = 'CHARACTER_SELECT';
    setTick(t => t + 1);
  };

  const handleCharacterSelect = (char: CharacterId) => {
    engine.setCharacter(char);
    engine.gameState = 'BACKGROUND_SELECT';
    setTick(t => t + 1);
  };

  const handleBackgroundSelect = (theme: BackgroundThemeId) => {
    engine.setBackground(theme);
    engine.gameState = 'INSTRUCTIONS_MAP';
    setTick(t => t + 1);
  };

  const handleStartFromMapInstructions = () => {
    engine.gameState = 'CHARACTER_LOADING';
    setTick(t => t + 1);
  };

  const handleBackToBackgroundSelect = () => {
    engine.gameState = 'BACKGROUND_SELECT';
    setTick(t => t + 1);
  };

  const handleCharacterLoadingComplete = () => {
    engine.startGame();
    setTick(t => t + 1);
  };

  const handleGoToMenu = (char: CharacterId) => {
    engine.setCharacter(char);
    engine.gameState = 'MENU';
    setTick(t => t + 1);
  };

  const handleOpenCharacterSelect = () => {
    engine.gameState = 'CHARACTER_SELECT';
    setTick(t => t + 1);
  };

  const handleStartGame = () => {
    engine.gameState = 'CHARACTER_LOADING';
    setTick(t => t + 1);
  };

  const handleRestart = () => {
    engine.gameState = 'CHARACTER_LOADING';
    setTick(t => t + 1);
  };

  const handleExitToMenu = () => {
    engine.gameState = 'MENU';
    soundManager.stopBgm();
    setTick(t => t + 1);
  };

  const handleTogglePause = () => {
    engine.pauseGame();
    setTick(t => t + 1);
  };

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setSoundMuted(muted);
  };

  const handleToggleBgm = () => {
    const bgmMutedVal = soundManager.toggleBgmMute();
    setBgmMuted(bgmMutedVal);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-slate-950 overflow-hidden select-none"
    >
      {/* 100% Full Screen Edge-to-Edge Canvas Area (No Letterboxing / Full Bleed) */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-slate-950">
        
        {/* Native Scaled Widescreen Pixel Canvas */}
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-full block select-none"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* 1. Hogwarts Pixel Escape Loading Screen */}
        {engine.gameState === 'LOADING' && (
          <LoadingScreen onComplete={handleLoadingComplete} />
        )}

        {/* 2. Character Selection Screen (Harry, Ron, Hermione) */}
        {engine.gameState === 'CHARACTER_SELECT' && (
          <CharacterSelectScreen
            initialCharacter={engine.selectedCharacter}
            onSelectCharacter={handleCharacterSelect}
            onGoToMenu={handleGoToMenu}
          />
        )}

        {/* 2.5. Background Selection Screen (Clouds, Dungeon, Forest) */}
        {engine.gameState === 'BACKGROUND_SELECT' && (
          <BackgroundSelectScreen
            character={engine.player.character || engine.selectedCharacter}
            initialTheme={engine.selectedBackground}
            onSelectBackground={handleBackgroundSelect}
            onBackToCharacterSelect={handleOpenCharacterSelect}
          />
        )}

        {/* 2.75. Marauder's Old Map Instructions Page (Pixel Form) */}
        {engine.gameState === 'INSTRUCTIONS_MAP' && (
          <MapInstructionsScreen
            character={engine.player.character || engine.selectedCharacter}
            backgroundTheme={engine.selectedBackground}
            onStartGame={handleStartFromMapInstructions}
            onBackToBackgroundSelect={handleBackToBackgroundSelect}
            onBackToCharacterSelect={handleOpenCharacterSelect}
          />
        )}

        {/* 3. Character-Specific Animated Pixel Loading Screen */}
        {engine.gameState === 'CHARACTER_LOADING' && (
          <CharacterLoadingScreen
            character={engine.player.character || engine.selectedCharacter}
            onComplete={handleCharacterLoadingComplete}
          />
        )}

        {/* 4. Menu Overlay */}
        {engine.gameState === 'MENU' && (
          <MenuOverlay
            character={engine.player.character || engine.selectedCharacter}
            onStartGame={handleStartGame}
            onOpenCharacterSelect={handleOpenCharacterSelect}
            onOpenHelp={() => setIsHelpOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            highScore={engine.highScore}
          />
        )}

        {/* 5. Game Over / Pause / Victory Modal */}
        <GameOverModal
          gameState={engine.gameState}
          score={engine.score}
          maxScore={engine.maxScore}
          highScore={engine.highScore}
          character={engine.player.character || engine.selectedCharacter}
          lastComparison={engine.lastComparison}
          leaderboard={engine.leaderboard}
          onRestart={handleRestart}
          onResume={() => {
            engine.gameState = 'PLAYING';
            setTick(t => t + 1);
          }}
          onExitGame={handleExitToMenu}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onOpenCharacterSelect={handleOpenCharacterSelect}
        />
      </div>

      {/* Floating Top Hogwarts Score & HUD Overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-auto">
        <ScoreBoard
          score={engine.score}
          maxScore={engine.maxScore}
          highScore={engine.highScore}
          lives={engine.player.lives}
          maxLives={engine.player.maxLives}
          character={engine.player.character || engine.selectedCharacter}
          onChangeCharacter={handleOpenCharacterSelect}
          isPaused={engine.gameState === 'PAUSED'}
          onTogglePause={handleTogglePause}
          soundMuted={soundMuted}
          bgmMuted={bgmMuted}
          onToggleSound={handleToggleSound}
          onToggleBgm={handleToggleBgm}
          onOpenHelp={() => setIsHelpOpen(true)}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
        />
      </div>

      {/* Bottom Floating Virtual Controls (Overlaid for Mobile & Touch Screen) */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none pb-1 sm:pb-2">
        <VirtualControls
          onInputStateChange={handleVirtualInput}
          isLandscapeMobile={isTouchDevice}
        />
      </div>

      {/* Mobile Landscape Orientation Advisory Prompt */}
      <OrientationPrompt isPortrait={isPortraitMobile} />

      {/* Instructions / How to Play Modal */}
      <InstructionsModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Hogwarts Self Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        leaderboard={engine.leaderboard}
        lastComparison={engine.lastComparison}
        onClear={() => {
          engine.clearLeaderboard();
          setTick(t => t + 1);
        }}
      />

    </div>
  );
};
