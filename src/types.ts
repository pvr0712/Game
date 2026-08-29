export type CharacterId = 'harry' | 'ron' | 'hermione';

export type GameState = 'LOADING' | 'CHARACTER_SELECT' | 'CHARACTER_LOADING' | 'MENU' | 'PLAYING' | 'PAUSED' | 'GAMEOVER' | 'VICTORY';

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
}
