import {
  Player,
  Enemy,
  OwlHazard,
  Coin,
  Platform,
  Particle,
  GameState,
  Cloud,
  CastleSpire,
  LeaderboardEntry,
  ScoreComparison,
  DumbledoreBonus,
  CharacterId,
  BackgroundThemeId,
  GameLevel,
  LEVEL_CONFIGS,
  CHARACTER_LEVEL_TITLES,
} from '../types';
import { generateHogwartsLevel, LevelData } from './levelGenerator';
import { soundManager } from '../audio/soundManager';

export interface GameInputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  jump: boolean;
  spark: boolean;
}

export interface LevelAnnouncement {
  level: GameLevel;
  title: string;
  subtitle: string;
  timer: number;
  characterTitle: string;
}

export class GameEngine {
  public gameState: GameState = 'LOADING';
  public selectedCharacter: CharacterId = 'harry';
  public selectedBackground: BackgroundThemeId = 'dark_clouds';
  public score: number = 0;
  public maxScore: number = 100;
  public highScore: number = 0;
  public gameTime: number = 0;
  public cameraX: number = 0;
  public canvasWidth: number = 800;
  public canvasHeight: number = 600;

  // 3-Level Progression System
  // Level 1: 0 - 25 pts (Year 1)
  // Level 2: 25 - 50 pts (Year 2)
  // Level 3: 50 - 100 pts (Year 3 - Grand Escape)
  public lastAnnouncedLevel: GameLevel = 1;
  public levelAnnouncement: LevelAnnouncement | null = null;

  public get currentLevel(): GameLevel {
    if (this.score < 25) return 1;
    if (this.score < 50) return 2;
    return 3;
  }

  public leaderboard: LeaderboardEntry[] = [];
  public lastComparison: ScoreComparison | null = null;

  public player: Player;
  public enemies: Enemy[] = [];
  public dumbledores: DumbledoreBonus[] = [];
  public owls: OwlHazard[] = [];
  public coins: Coin[] = [];
  public platforms: Platform[] = [];
  public spires: CastleSpire[] = [];
  public clouds: Cloud[] = [];
  public particles: Particle[] = [];
  public worldWidth: number = 5200;

  // Owl spawn timer
  private owlSpawnTimer: number = 3.5;
  private coinPickupFloats: { text: string; x: number; y: number; alpha: number }[] = [];

  public inputs: GameInputState = {
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
    spark: false,
  };

  private prevJumpKey: boolean = false;
  private prevSparkKey: boolean = false;

  public onStateChange?: () => void;

  public notifyStateChange() {
    if (this.onStateChange) {
      try {
        this.onStateChange();
      } catch (err) {
        console.error('Error in onStateChange callback:', err);
      }
    }
  }

  constructor() {
    this.player = this.createDefaultPlayer();
    this.loadLeaderboardAndHighScore();
    this.resetGame();
  }

  public setCharacter(char: CharacterId) {
    this.selectedCharacter = char;
    if (this.player) {
      this.player.character = char;
    }
  }

  public setBackground(theme: BackgroundThemeId) {
    this.selectedBackground = theme;
    try {
      localStorage.setItem('hogwarts_pixel_escape_background', theme);
    } catch {
      // ignore
    }
  }

  public setCanvasDimensions(width: number, height: number) {
    this.canvasWidth = Math.max(800, width);
    this.canvasHeight = Math.max(400, height);
  }

  private createDefaultPlayer(): Player {
    return {
      character: this.selectedCharacter || 'harry',
      x: 80,
      y: 440,
      vx: 0,
      vy: 0,
      width: 22,
      height: 32,
      facing: 'RIGHT',
      action: 'IDLE',
      isGrounded: false,
      invulnerableTimer: 0,
      animationTimer: 0,
      frameIndex: 0,
      sparkEffectTimer: 0,
      lives: 3,
      maxLives: 3,
    };
  }

  public loadLeaderboardAndHighScore() {
    try {
      const savedLeaderboard = localStorage.getItem('hogwarts_pixel_escape_leaderboard');
      if (savedLeaderboard) {
        this.leaderboard = JSON.parse(savedLeaderboard);
      } else {
        this.leaderboard = [];
      }

      const savedHigh = localStorage.getItem('hogwarts_pixel_escape_high_score');
      if (savedHigh) {
        this.highScore = parseInt(savedHigh, 10) || 0;
      } else if (this.leaderboard.length > 0) {
        this.highScore = Math.max(...this.leaderboard.map(e => e.score));
      }

      const savedBg = localStorage.getItem('hogwarts_pixel_escape_background') as BackgroundThemeId | null;
      if (savedBg && (savedBg === 'dark_clouds' || savedBg === 'dark_dungeon' || savedBg === 'creepy_forest')) {
        this.selectedBackground = savedBg;
      }
    } catch {
      this.leaderboard = [];
      this.highScore = 0;
    }
  }

  public recordGameCompletion(result: 'VICTORY' | 'DEFEAT'): ScoreComparison {
    const previousHighest = this.highScore;
    const currentScore = this.score;
    const isNewBest = currentScore > previousHighest;
    const diff = currentScore - previousHighest;

    // Create entry
    const now = new Date();
    const formattedDate = `${now.getMonth() + 1}/${now.getDate()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newEntry: LeaderboardEntry = {
      id: `run_${Date.now()}`,
      score: currentScore,
      maxScore: this.maxScore,
      level: this.currentLevel,
      date: formattedDate,
      timeSpent: Math.round(this.gameTime),
      result,
      isNewHighScore: isNewBest,
    };

    // Add to list and sort by score descending, then timeSpent ascending
    const updated = [...this.leaderboard, newEntry];
    updated.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.timeSpent - b.timeSpent;
    });

    // Keep top 30 runs
    this.leaderboard = updated.slice(0, 30);

    // Save to localStorage
    try {
      localStorage.setItem('hogwarts_pixel_escape_leaderboard', JSON.stringify(this.leaderboard));
      if (isNewBest || currentScore >= this.highScore) {
        this.highScore = currentScore;
        localStorage.setItem('hogwarts_pixel_escape_high_score', this.highScore.toString());
      }
    } catch {}

    // Find rank of this new entry
    const rank = this.leaderboard.findIndex(e => e.id === newEntry.id) + 1;

    this.lastComparison = {
      currentScore,
      previousHighestScore: previousHighest,
      difference: diff,
      isNewBest,
      rank: rank > 0 ? rank : 1,
      totalGames: this.leaderboard.length,
      level: this.currentLevel,
    };

    return this.lastComparison;
  }

  public saveHighScore() {
    try {
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem('hogwarts_pixel_escape_high_score', this.highScore.toString());
      }
    } catch {}
  }

  public clearLeaderboard() {
    this.leaderboard = [];
    this.highScore = 0;
    this.lastComparison = null;
    try {
      localStorage.removeItem('hogwarts_pixel_escape_leaderboard');
      localStorage.removeItem('hogwarts_pixel_escape_high_score');
    } catch {}
  }

  public resetGame() {
    const level: LevelData = generateHogwartsLevel();
    this.platforms = level.platforms;
    this.coins = level.coins;
    this.enemies = level.enemies;
    this.dumbledores = level.dumbledores;
    this.spires = level.spires;
    this.clouds = level.clouds;
    this.worldWidth = level.worldWidth;

    this.player = this.createDefaultPlayer();
    this.owls = [];
    this.particles = [];
    this.coinPickupFloats = [];
    this.score = 0;
    this.gameTime = 0;
    this.cameraX = 0;
    this.owlSpawnTimer = 4.0;
    this.lastAnnouncedLevel = 1;
    this.levelAnnouncement = null;
    this.inputs = {
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false,
      spark: false,
    };
    this.prevJumpKey = false;
    this.prevSparkKey = false;
  }

  public startGame() {
    this.resetGame();
    this.gameState = 'PLAYING';
    soundManager.startBgm();
    this.notifyStateChange();
  }

  public pauseGame() {
    if (this.gameState === 'PLAYING') {
      this.gameState = 'PAUSED';
    } else if (this.gameState === 'PAUSED') {
      this.gameState = 'PLAYING';
    }
    this.notifyStateChange();
  }

  public update(dt: number) {
    if (this.gameState !== 'PLAYING') {
      // Update background clouds slowly in menu/game over
      this.clouds.forEach(c => {
        c.x -= c.speed * dt * 30;
        if (c.x + c.width < -100) {
          c.x = this.worldWidth + 100;
        }
      });
      return;
    }

    // Clamp delta time to avoid large physics steps
    const delta = Math.min(Math.max(dt, 0.001), 0.033);
    this.gameTime += delta;

    // 1. Update Player
    this.updatePlayer(delta);

    // 2. Update Lord Voldemort Enemies
    this.updateEnemies(delta);

    // 3. Update Professor Dumbledore Encounters
    this.updateDumbledores(delta);

    // 4. Update Owls
    this.updateOwls(delta);

    // 5. Update Coins
    this.updateCoins(delta);

    // 6. Update Particles & Popups
    this.updateParticles(delta);

    // 7. Update Clouds
    this.updateClouds(delta);

    // 8. Update Camera
    this.updateCamera();

    // 9. Update Level-Up Announcement Toast Timer
    if (this.levelAnnouncement) {
      this.levelAnnouncement.timer -= delta;
      if (this.levelAnnouncement.timer <= 0) {
        this.levelAnnouncement = null;
      }
    }

    // Check Win Condition: 100 Points reached (Level 3 Cleared - Final House Cup Victory)!
    if (this.score >= this.maxScore && this.gameState === 'PLAYING') {
      this.gameState = 'VICTORY';
      this.recordGameCompletion('VICTORY');
      soundManager.playVictory();
      this.spawnVictoryFireworks();
      this.notifyStateChange();
    }
  }

  private updatePlayer(dt: number) {
    const p = this.player;

    // Invulnerability timer
    if (p.invulnerableTimer > 0) {
      p.invulnerableTimer -= dt;
    }

    // Spark effect timer
    if (p.sparkEffectTimer > 0) {
      p.sparkEffectTimer -= dt;
    }

    // Horizontal Movement
    const speed = 210;
    const accel = 1200;
    const friction = 1400;

    p.height = 32; // Normal standing height

    if (this.inputs.left && !this.inputs.right) {
      p.vx = Math.max(-speed, p.vx - accel * dt);
      p.facing = 'LEFT';
      if (p.isGrounded) p.action = 'RUNNING';
    } else if (this.inputs.right && !this.inputs.left) {
      p.vx = Math.min(speed, p.vx + accel * dt);
      p.facing = 'RIGHT';
      if (p.isGrounded) p.action = 'RUNNING';
    } else {
      // Friction when no key pressed
      if (p.vx > 0) {
        p.vx = Math.max(0, p.vx - friction * dt);
      } else if (p.vx < 0) {
        p.vx = Math.min(0, p.vx + friction * dt);
      }
      if (p.isGrounded && Math.abs(p.vx) < 5) {
        p.action = 'IDLE';
      }
    }

    // Jump Logic
    const jumpPressed = (this.inputs.up || this.inputs.jump) && !this.prevJumpKey;
    this.prevJumpKey = this.inputs.up || this.inputs.jump;

    if (jumpPressed) {
      // Check if dropping through a drop-through platform with Down + Jump
      if (this.inputs.down && p.isGrounded) {
        // Drop down through platform
        p.y += 4;
        p.isGrounded = false;
      } else if (p.isGrounded) {
        p.vy = -540;
        p.isGrounded = false;
        p.action = 'JUMPING';
        soundManager.playJump();
        this.createDustParticles(p.x + p.width / 2, p.y + p.height, 4);
      }
    }

    // Gravity
    const gravity = 1350;
    p.vy += gravity * dt;
    if (p.vy > 800) p.vy = 800; // Terminal velocity

    if (!p.isGrounded) {
      p.action = p.vy < 0 ? 'JUMPING' : 'FALLING';
    }

    // Wand Spark action (Lumos / Sparks)
    const sparkPressed = this.inputs.spark && !this.prevSparkKey;
    this.prevSparkKey = this.inputs.spark;
    if (sparkPressed) {
      p.sparkEffectTimer = 0.3;
      soundManager.playSpellSpark();
      this.createWandSparks(
        p.facing === 'RIGHT' ? p.x + p.width + 6 : p.x - 6,
        p.y + 16
      );
    }

    // Move X
    p.x += p.vx * dt;
    // World bounds
    if (p.x < 10) {
      p.x = 10;
      p.vx = 0;
    }
    if (p.x > this.worldWidth - p.width - 20) {
      p.x = this.worldWidth - p.width - 20;
      p.vx = 0;
    }

    // Move Y & Platform Collision
    const oldY = p.y;
    p.y += p.vy * dt;
    p.isGrounded = false;

    // Check collision against platforms with stable edge tolerances
    for (const plat of this.platforms) {
      // Horizontal overlap (with a 3px edge tolerance)
      const hasHorizontalOverlap = (p.x + p.width > plat.x + 3) && (p.x < plat.x + plat.width - 3);
      if (!hasHorizontalOverlap) continue;

      if (plat.type === 'solid') {
        // Solid platform collision (Top landing and bottom blocking)
        if (p.vy >= 0) {
          if (oldY + p.height <= plat.y + 10 && p.y + p.height >= plat.y) {
            p.y = plat.y - p.height;
            p.vy = 0;
            p.isGrounded = true;
            break; // Grounded on top of solid platform
          }
        } else if (p.vy < 0) {
          if (oldY >= plat.y + plat.height - 8 && p.y < plat.y + plat.height) {
            p.y = plat.y + plat.height;
            p.vy = 0;
          }
        }
      } else {
        // One-way / drop-through platform (only land when falling downwards from above)
        const isDroppingDown = this.inputs.down && (this.inputs.jump || this.inputs.up);
        if (!isDroppingDown && p.vy >= 0) {
          if (oldY + p.height <= plat.y + 10 && p.y + p.height >= plat.y) {
            p.y = plat.y - p.height;
            p.vy = 0;
            p.isGrounded = true;
            break; // Grounded on top of drop-through platform
          }
        }
      }
    }

    // Pit fall check (fell off castle)
    if (p.y > 620) {
      this.handlePlayerDamage('pit');
    }

    // Animation frame timing
    p.animationTimer += dt;
    if (p.action === 'RUNNING') {
      p.frameIndex += dt * 10;
      // Footstep dust
      if (Math.floor(p.frameIndex) % 2 === 0 && Math.random() < 0.2) {
        this.createDustParticles(p.x + p.width / 2, p.y + p.height, 1);
      }
    } else {
      p.frameIndex += dt * 3;
    }
  }

  private updateEnemies(dt: number) {
    this.enemies.forEach(voldemort => {
      // Lord Voldemort patrols within his designated platform or ground bounds
      voldemort.x += voldemort.vx * dt * 50 * voldemort.patrolSpeed;

      if (voldemort.x <= voldemort.minX) {
        voldemort.x = voldemort.minX;
        voldemort.vx = Math.abs(voldemort.vx);
        voldemort.facing = 'RIGHT';
      } else if (voldemort.x >= voldemort.maxX) {
        voldemort.x = voldemort.maxX;
        voldemort.vx = -Math.abs(voldemort.vx);
        voldemort.facing = 'LEFT';
      }

      voldemort.animationTimer += dt;
      voldemort.frameIndex += dt * 6;

      if (voldemort.laughCooldown && voldemort.laughCooldown > 0) {
        voldemort.laughCooldown -= dt;
      }

      const isVisibleOnScreen = (
        voldemort.x + voldemort.width >= this.cameraX - 40 &&
        voldemort.x <= this.cameraX + this.canvasWidth + 40
      );

      // Proximity check: When Harry encounters Voldemort on screen (within 130px), Voldemort laughs his cackle!
      if (isVisibleOnScreen) {
        const distToHarry = Math.hypot(
          (this.player.x + this.player.width / 2) - (voldemort.x + voldemort.width / 2),
          (this.player.y + this.player.height / 2) - (voldemort.y + voldemort.height / 2)
        );

        if (distToHarry < 130 && (!voldemort.laughCooldown || voldemort.laughCooldown <= 0)) {
          voldemort.tauntTimer = 1.6;
          voldemort.laughCooldown = 6.0; // Cooldown between automatic laugh triggers
          soundManager.playVoldemortLaugh();
        }
      }

      if (voldemort.tauntTimer > 0) {
        voldemort.tauntTimer -= dt;
      }

      // Check collision with Harry Potter
      if (this.checkCollision(this.player, voldemort)) {
        // Player should escape from Voldemort by moving up/down or jumping over!
        if (!voldemort.laughCooldown || voldemort.laughCooldown <= 1.0) {
          soundManager.playVoldemortLaugh();
          voldemort.laughCooldown = 4.0;
        }
        this.handlePlayerDamage('voldemort');
      }
    });
  }

  // Update Professor Dumbledore HP Bonus Collectibles
  private updateDumbledores(dt: number) {
    this.dumbledores.forEach(dumbledore => {
      if (dumbledore.collected) return;

      dumbledore.sparkleTimer += dt;
      // Ambient phoenix sparkles
      if (dumbledore.sparkleTimer > 0.25) {
        dumbledore.sparkleTimer = 0;
        if (Math.random() < 0.6) {
          const dy = dumbledore.baseY + Math.sin(this.gameTime * 3.5 + dumbledore.floatingPhase) * (dumbledore.isInAir ? 7 : 3);
          this.particles.push({
            x: dumbledore.x + Math.random() * dumbledore.width,
            y: dy + Math.random() * dumbledore.height,
            vx: (Math.random() - 0.5) * 20,
            vy: -15 - Math.random() * 25,
            size: 2.5,
            color: Math.random() < 0.5 ? '#fbbf24' : '#ef4444',
            alpha: 0.9,
            maxLife: 0.6,
            life: 0.6,
            shape: 'spark',
          });
        }
      }

      // Collision with Harry Potter: Grants +1 Extra HP!
      const floatY = dumbledore.baseY + Math.sin(this.gameTime * 3.5 + dumbledore.floatingPhase) * (dumbledore.isInAir ? 7 : 3);
      const dumbledoreBox = {
        x: dumbledore.x,
        y: floatY,
        width: dumbledore.width,
        height: dumbledore.height,
      };

      if (this.checkCollision(this.player, dumbledoreBox)) {
        dumbledore.collected = true;
        
        // Boost Harry's HP (max 5)
        this.player.lives = Math.min(5, this.player.lives + 1);
        soundManager.playDumbledoreBlessing();
        this.notifyStateChange();

        // Spawn glorious phoenix aura sparkles
        this.createDumbledoreSparkles(dumbledore.x + 13, floatY + 16);

        // Show floating message
        this.coinPickupFloats.push({
          text: '+1 HP (DUMBLEDORE)',
          x: dumbledore.x - 10,
          y: floatY - 14,
          alpha: 1.0,
        });
      }
    });
  }

  private updateOwls(dt: number) {
    // Spawn Owls flying across the sky periodically - frequency scales by level
    this.owlSpawnTimer -= dt;
    if (this.owlSpawnTimer <= 0) {
      this.spawnOwlHazard();
      const currentLv = this.currentLevel;
      if (currentLv === 1) {
        this.owlSpawnTimer = 3.6 + Math.random() * 2.8;
      } else if (currentLv === 2) {
        this.owlSpawnTimer = 2.4 + Math.random() * 2.2;
      } else {
        this.owlSpawnTimer = 1.7 + Math.random() * 1.6;
      }
    }

    // Update active owls
    for (let i = this.owls.length - 1; i >= 0; i--) {
      const owl = this.owls[i];

      if (owl.warningTimer > 0) {
        owl.warningTimer -= dt;
        if (owl.warningTimer <= 0) {
          soundManager.playOwlHoot();
        }
        continue;
      }

      // Flying movement (flying from right to left across the screen)
      owl.x += owl.vx * dt;
      owl.wingPhase += dt * 4;

      if (owl.flightType === 'swoop') {
        // Swooping sine wave path
        owl.y = owl.baseY + Math.sin(owl.wingPhase * 2.5) * 45;
      }

      // Check collision with player
      if (this.checkCollision(this.player, owl)) {
        this.handlePlayerDamage('owl');
      }

      // Remove owl if far off screen
      if (owl.x < this.cameraX - 300) {
        this.owls.splice(i, 1);
      }
    }
  }

  private spawnOwlHazard() {
    // Spawn owl relative to player's current view/position
    const spawnX = this.cameraX + this.canvasWidth + 120;
    const flightTypes: ('high' | 'mid' | 'swoop')[] = ['mid', 'high', 'swoop'];
    const type = flightTypes[Math.floor(Math.random() * flightTypes.length)];

    let spawnY = 280;
    if (type === 'mid') {
      // Lower flight: player can leap over with a jump!
      spawnY = this.player.y + 8;
    } else if (type === 'high') {
      // High sky owl (safely passes overhead while standing, avoid jumping into it)
      spawnY = Math.max(60, this.player.y - 52);
    } else {
      // Swooping owl
      spawnY = this.player.y - 40;
    }

    // Owl flight speed scales slightly with level
    const currentLv = this.currentLevel;
    const baseSpeed = currentLv === 1 ? 230 : currentLv === 2 ? 275 : 320;

    const owl: OwlHazard = {
      id: `owl_${Date.now()}_${Math.random()}`,
      x: spawnX,
      y: spawnY,
      vx: -(baseSpeed + Math.random() * 60), // Fast flight
      vy: 0,
      baseY: spawnY,
      width: 24,
      height: 18,
      facing: 'LEFT',
      flightType: type,
      wingPhase: 0,
      letterCarried: Math.random() < 0.7,
      warningTimer: currentLv === 3 ? 1.0 : 1.3, // Warning alert box on screen edge before entering
      warningY: spawnY,
      active: true,
    };

    this.owls.push(owl);
  }

  public triggerLevelUp(level: GameLevel) {
    soundManager.playLevelUp(level);

    // Reward player: +1 Extra Life HP (max 5)
    this.player.lives = Math.min(5, this.player.lives + 1);

    const char = this.player.character || this.selectedCharacter || 'harry';
    const charTitleObj = CHARACTER_LEVEL_TITLES[char]?.[level] || { title: 'Champion', badge: '🏆' };
    const cfg = LEVEL_CONFIGS[level];

    this.levelAnnouncement = {
      level,
      title: `LEVEL ${level} UNLOCKED! (${cfg.minPoints} PTS)`,
      subtitle: `${cfg.name} • ${charTitleObj.badge} ${charTitleObj.title}`,
      timer: 3.8,
      characterTitle: `${charTitleObj.badge} ${charTitleObj.title}`,
    };

    // Celebration particles & burst
    this.spawnLevelUpFireworks(level);
    this.notifyStateChange();

    // Floating announcement over player
    this.coinPickupFloats.push({
      text: `★ LEVEL ${level} UNLOCKED! ★`,
      x: this.player.x - 30,
      y: this.player.y - 30,
      alpha: 1.5,
    });
  }

  private spawnLevelUpFireworks(level: GameLevel) {
    const colors = level === 2
      ? ['#a855f7', '#38bdf8', '#fbbf24', '#ffffff', '#c084fc']
      : ['#fbbf24', '#f59e0b', '#dc2626', '#10b981', '#ffffff'];

    for (let f = 0; f < 6; f++) {
      const fx = this.player.x + (Math.random() - 0.5) * 320;
      const fy = Math.max(80, this.player.y - 80 + (Math.random() - 0.5) * 120);
      for (let p = 0; p < 18; p++) {
        const angle = (Math.PI * 2 * p) / 18 + (Math.random() - 0.5) * 0.3;
        const spd = 60 + Math.random() * 90;
        this.particles.push({
          x: fx,
          y: fy,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd - 25,
          size: 3.5,
          color: colors[f % colors.length],
          alpha: 1.0,
          maxLife: 1.1,
          life: 1.1,
          shape: 'spark',
        });
      }
    }
  }

  private updateCoins(dt: number) {
    this.coins.forEach(coin => {
      if (coin.collected) return;

      coin.frameTimer += dt * 6;
      if (coin.frameTimer >= 1) {
        coin.frame = (coin.frame + 1) % 4;
        coin.frameTimer = 0;
      }
      coin.floatOffset = Math.sin(this.gameTime * 4 + coin.x) * 3;

      // Check collection by Harry / Ron / Hermione
      if (this.checkCollision(this.player, coin)) {
        coin.collected = true;
        const prevScore = this.score;
        this.score += coin.value;
        if (this.score > this.maxScore) this.score = this.maxScore;
        this.saveHighScore();
        soundManager.playCoin();

        // Check 3 Levels Thresholds
        // Level 1: 0 to 25 pts
        // Level 2: 25 to 50 pts
        // Level 3: 50 to 100 pts
        if (prevScore < 25 && this.score >= 25 && this.lastAnnouncedLevel < 2) {
          this.lastAnnouncedLevel = 2;
          this.triggerLevelUp(2);
        } else if (prevScore < 50 && this.score >= 50 && this.lastAnnouncedLevel < 3) {
          this.lastAnnouncedLevel = 3;
          this.triggerLevelUp(3);
        }

        // Sparkle particles
        this.createCoinSparkles(coin.x + coin.width / 2, coin.y + coin.height / 2);
        // Float "+1"
        this.coinPickupFloats.push({
          text: '+1',
          x: coin.x,
          y: coin.y - 10,
          alpha: 1.0,
        });
        this.notifyStateChange();
      }
    });
  }

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    for (let i = this.coinPickupFloats.length - 1; i >= 0; i--) {
      const f = this.coinPickupFloats[i];
      f.y -= dt * 30;
      f.alpha -= dt * 1.5;
      if (f.alpha <= 0) {
        this.coinPickupFloats.splice(i, 1);
      }
    }
  }

  private updateClouds(dt: number) {
    this.clouds.forEach(c => {
      c.x -= c.speed * dt * 45;
      if (c.x + c.width < this.cameraX - 150) {
        c.x = this.cameraX + this.canvasWidth + 150;
      }
    });
  }

  private updateCamera() {
    // Smooth camera following Harry Potter
    const targetX = this.player.x - this.canvasWidth * 0.35;
    this.cameraX += (targetX - this.cameraX) * 0.12;

    // Bounds
    if (this.cameraX < 0) this.cameraX = 0;
    if (this.cameraX > this.worldWidth - this.canvasWidth) {
      this.cameraX = this.worldWidth - this.canvasWidth;
    }
  }

  private checkCollision(a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  private handlePlayerDamage(source: 'voldemort' | 'draco' | 'owl' | 'pit') {
    if (this.gameState !== 'PLAYING') return;

    const p = this.player;
    if (p.invulnerableTimer > 0 && source !== 'pit') return;

    soundManager.playHurt();
    p.lives = Math.max(0, p.lives - 1);

    // Knockback
    p.vy = -340;
    p.vx = p.facing === 'RIGHT' ? -180 : 180;

    // Damage particles
    this.createDamageSparks(p.x + p.width / 2, p.y + p.height / 2);

    if (source === 'pit') {
      // Find nearest safe solid platform to respawn on
      const safePlat =
        this.platforms
          .slice()
          .reverse()
          .find(plat => plat.type === 'solid' && plat.x <= p.x && plat.y <= 460) ||
        this.platforms[0];

      if (safePlat) {
        p.x = safePlat.x + Math.min(20, safePlat.width / 2);
        p.y = safePlat.y - p.height - 4;
      } else {
        p.x = 80;
        p.y = 350;
      }
      p.vy = 0;
      p.vx = 0;
    }

    if (p.lives <= 0) {
      p.lives = 0;
      p.invulnerableTimer = 0;
      this.gameState = 'GAMEOVER';
      this.recordGameCompletion('DEFEAT');
      soundManager.playGameOver();
      this.notifyStateChange();
    } else {
      p.invulnerableTimer = 1.8; // Grace period with blinking
      this.notifyStateChange();
    }
  }

  // Particle Generators
  private createDumbledoreSparkles(x: number, y: number) {
    const colors = ['#fef08a', '#fbbf24', '#f59e0b', '#ef4444', '#f43f5e', '#ffffff'];
    for (let i = 0; i < 18; i++) {
      const angle = (Math.PI * 2 * i) / 18 + (Math.random() - 0.5) * 0.4;
      const speed = 70 + Math.random() * 80;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 20,
        size: 3.5,
        color: colors[i % colors.length],
        alpha: 1.0,
        maxLife: 0.9,
        life: 0.9,
        shape: 'spark',
      });
    }
  }
  private createDustParticles(x: number, y: number, count: number) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 12,
        y: y - 2,
        vx: (Math.random() - 0.5) * 40,
        vy: -Math.random() * 30 - 10,
        size: 3,
        color: '#64748b',
        alpha: 0.8,
        maxLife: 0.4,
        life: 0.4,
        shape: 'smoke',
      });
    }
  }

  private createCoinSparkles(x: number, y: number) {
    const colors = ['#fef08a', '#fbbf24', '#f59e0b', '#ffffff'];
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const speed = 60 + Math.random() * 50;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3,
        color: colors[i % colors.length],
        alpha: 1.0,
        maxLife: 0.5,
        life: 0.5,
        shape: 'spark',
      });
    }
  }

  private createWandSparks(x: number, y: number) {
    const colors = ['#fef08a', '#67e8f9', '#f472b6', '#a78bfa'];
    for (let i = 0; i < 10; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        vx: (this.player.facing === 'RIGHT' ? 1 : -1) * (90 + Math.random() * 90),
        vy: (Math.random() - 0.5) * 80,
        size: 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1.0,
        maxLife: 0.4,
        life: 0.4,
        shape: 'spark',
      });
    }
  }

  private createDamageSparks(x: number, y: number) {
    for (let i = 0; i < 12; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 160,
        vy: (Math.random() - 0.5) * 160,
        size: 3,
        color: '#dc2626',
        alpha: 1.0,
        maxLife: 0.6,
        life: 0.6,
        shape: 'spark',
      });
    }
  }

  private spawnVictoryFireworks() {
    const colors = ['#fbbf24', '#dc2626', '#3b82f6', '#10b981', '#a855f7'];
    for (let f = 0; f < 5; f++) {
      const fx = this.player.x + (Math.random() - 0.5) * 400;
      const fy = 100 + Math.random() * 200;
      for (let p = 0; p < 20; p++) {
        const angle = (Math.PI * 2 * p) / 20;
        const spd = 70 + Math.random() * 90;
        this.particles.push({
          x: fx,
          y: fy,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          size: 4,
          color: colors[f % colors.length],
          alpha: 1.0,
          maxLife: 1.2,
          life: 1.2,
          shape: 'spark',
        });
      }
    }
  }

  public drawScorePickups(ctx: CanvasRenderingContext2D) {
    ctx.save();
    this.coinPickupFloats.forEach(f => {
      ctx.globalAlpha = Math.max(0, f.alpha);
      ctx.fillStyle = '#fbbf24';
      ctx.font = '10px "Press Start 2P"';
      ctx.fillText(f.text, f.x - this.cameraX, f.y);
    });
    ctx.restore();
  }
}
