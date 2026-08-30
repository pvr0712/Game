export type CharacterId = 'harry' | 'ron' | 'hermione';

export type BackgroundThemeId = 'dark_clouds' | 'dark_dungeon' | 'creepy_forest';

export type GameState = 'LOADING' | 'CHARACTER_SELECT' | 'BACKGROUND_SELECT' | 'INSTRUCTIONS_MAP' | 'CHARACTER_LOADING' | 'MENU' | 'PLAYING' | 'PAUSED' | 'GAMEOVER' | 'VICTORY';

export type PlayerAction = 'IDLE' | 'RUNNING' | 'JUMPING' | 'FALLING' | 'HURT';

export type FacingDirection = 'LEFT' | 'RIGHT';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Platform extends Rect {
  id: string;
  type: 'solid' | 'drop_through' | 'floating_rune' | 'grand_stair';
  colorTheme?: string;
  hasArch?: boolean;
}

export interface Player {
  character: CharacterId;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  facing: FacingDirection;
  action: PlayerAction;
  isGrounded: boolean;
  invulnerableTimer: number; // in seconds
  animationTimer: number;
  frameIndex: number;
  sparkEffectTimer: number;
  lives: number;
  maxLives: number;
}

export interface Enemy {
  id: string;
  x: number;
  y: number;
  vx: number;
  width: number;
  height: number;
  facing: FacingDirection;
  minX: number;
  maxX: number;
  patrolSpeed: number;
  animationTimer: number;
  frameIndex: number;
  tauntTimer: number;
  platformId: string;
  laughCooldown?: number;
}

export interface DumbledoreBonus {
  id: string;
  x: number;
  y: number;
  baseY: number;
  width: number;
  height: number;
  facing: FacingDirection;
  collected: boolean;
  floatingPhase: number;
  isInAir: boolean;
  sparkleTimer: number;
}

export interface OwlHazard {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseY: number;
  width: number;
  height: number;
  facing: FacingDirection;
  flightType: 'high' | 'mid' | 'swoop'; // high passes overhead, mid jumped over, swoop waves
  wingPhase: number;
  letterCarried: boolean;
  warningTimer: number; // countdown before entering screen
  warningY: number;
  active: boolean;
}

export interface Coin {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;
  frame: number;
  frameTimer: number;
  value: number;
  floatOffset: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  maxLife: number;
  life: number;
  shape?: 'spark' | 'circle' | 'feather' | 'star' | 'smoke';
}

export interface Cloud {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  opacity: number;
  layer: number; // 0 = far, 1 = mid, 2 = near
  pixelData?: number[][];
}

export interface CastleSpire {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'tower' | 'bridge' | 'turret' | 'arch';
  windowLit: boolean;
}

export interface FloatingCandle {
  x: number;
  y: number;
  baseY: number;
  phase: number;
  speed: number;
}

export type GameLevel = 1 | 2 | 3;

export interface LevelConfig {
  level: GameLevel;
  name: string;
  maxPoints: number;
  minPoints: number;
  subtitle: string;
  themeColor: string;
}

export const LEVEL_CONFIGS: Record<GameLevel, LevelConfig> = {
  1: {
    level: 1,
    name: 'Year 1: Castle Corridors',
    minPoints: 0,
    maxPoints: 25,
    subtitle: 'Escape the lower castle battlements and reach 25 points!',
    themeColor: 'from-blue-600 to-cyan-500',
  },
  2: {
    level: 2,
    name: 'Year 2: High Spires & Dungeons',
    minPoints: 25,
    maxPoints: 50,
    subtitle: 'Scale high castle spires & evade faster swooping owls to reach 50 points!',
    themeColor: 'from-purple-600 to-indigo-500',
  },
  3: {
    level: 3,
    name: 'Year 3: The Grand Escape',
    minPoints: 50,
    maxPoints: 100,
    subtitle: 'Evade Lord Voldemort & reach 100 points for the Hogwarts House Cup!',
    themeColor: 'from-amber-500 to-yellow-400',
  },
};

export const CHARACTER_LEVEL_TITLES: Record<CharacterId, Record<GameLevel, { title: string; badge: string }>> = {
  harry: {
    1: { title: 'Gryffindor Seeker', badge: '⚡' },
    2: { title: 'Patronus Master', badge: '🦌' },
    3: { title: 'The Chosen One', badge: '🏆' },
  },
  ron: {
    1: { title: 'Wizard Chess Prodigy', badge: '♟️' },
    2: { title: 'Knight of Gryffindor', badge: '🛡️' },
    3: { title: 'Auror Champion', badge: '🏆' },
  },
  hermione: {
    1: { title: 'Time-Turner Scholar', badge: '⏳' },
    2: { title: 'Prefect of Spells', badge: '📖' },
    3: { title: 'Minister of Magic', badge: '🏆' },
  },
};

export interface GameSettings {
  soundEnabled: boolean;
  bgmEnabled: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
  showHitboxes: boolean;
}

export interface LeaderboardEntry {
  id: string;
  score: number;
  maxScore: number;
  level: GameLevel;
  date: string;
  timeSpent: number; // in seconds
  result: 'VICTORY' | 'DEFEAT';
  isNewHighScore?: boolean;
}

export interface ScoreComparison {
  currentScore: number;
  previousHighestScore: number;
  difference: number;
  isNewBest: boolean;
  rank: number;
  totalGames: number;
  level: GameLevel;
}
