import { Platform, Coin, Enemy, CastleSpire, Cloud, DumbledoreBonus } from '../types';

export interface LevelData {
  platforms: Platform[];
  coins: Coin[];
  enemies: Enemy[];
  dumbledores: DumbledoreBonus[];
  spires: CastleSpire[];
  clouds: Cloud[];
  worldWidth: number;
}

export function generateHogwartsLevel(): LevelData {
  const platforms: Platform[] = [];
  const coins: Coin[] = [];
  const enemies: Enemy[] = [];
  const dumbledores: DumbledoreBonus[] = [];
  const spires: CastleSpire[] = [];
  const clouds: Cloud[] = [];

  const worldWidth = 5200; // Large scrolling Hogwarts castle expanse

  // 1. Generate Hogwarts Spires & Towers in Background
  let spireX = 60;
  while (spireX < worldWidth + 800) {
    const isMainTower = Math.random() < 0.35;
    if (isMainTower) {
      spires.push({
        x: spireX,
        y: 120 + Math.random() * 80,
        width: 48 + Math.random() * 32,
        height: 380,
        type: 'tower',
        windowLit: Math.random() < 0.7,
      });
      spireX += 160 + Math.random() * 120;
    } else {
      spires.push({
        x: spireX,
        y: 220 + Math.random() * 60,
        width: 32 + Math.random() * 24,
        height: 260,
        type: 'turret',
        windowLit: Math.random() < 0.5,
      });
      spireX += 100 + Math.random() * 80;
    }
  }

  // Viaduct bridges between towers
  for (let bx = 300; bx < worldWidth; bx += 850) {
    spires.push({
      x: bx,
      y: 320,
      width: 220,
      height: 160,
      type: 'bridge',
      windowLit: false,
    });
  }

  // 2. Generate Parallax Floating Clouds
  for (let i = 0; i < 28; i++) {
    clouds.push({
      x: Math.random() * worldWidth,
      y: 20 + Math.random() * 240,
      width: 90 + Math.random() * 120,
      height: 35 + Math.random() * 45,
      speed: 0.15 + Math.random() * 0.35,
      opacity: 0.35 + Math.random() * 0.45,
      layer: i % 2 === 0 ? 0 : 1,
    });
  }

  // 3. Generate Platforms (Ground & Multi-Tier Hogwarts architecture)
  // Ground segments
  let gx = 0;
  while (gx < worldWidth) {
    const groundW = 400 + Math.random() * 300;
    platforms.push({
      id: `ground_${gx}`,
      x: gx,
      y: 520,
      width: groundW,
      height: 80,
      type: 'solid',
      hasArch: true,
    });
    gx += groundW + 40 + Math.random() * 40; // Small gaps
  }

  // Multi-tier Hogwarts Castle Ledges, Balconies, and Floating Rune stones
  // Level heights: Low (425), Mid (340), High (245), Tower Top (155)
  const tierY = [425, 340, 245, 155];

  for (let px = 180; px < worldWidth - 200; px += 160 + Math.random() * 80) {
    const numTiers = 2 + Math.floor(Math.random() * 2);
    const chosenTiers = [0, 1, 2, 3].sort(() => Math.random() - 0.5).slice(0, numTiers);

    chosenTiers.forEach((tierIdx, idx) => {
      const y = tierY[tierIdx];
      const width = 110 + Math.random() * 100;
      const pType = Math.random() < 0.45 ? 'drop_through' : Math.random() < 0.25 ? 'floating_rune' : 'solid';

      const platId = `plat_${px}_${tierIdx}_${idx}`;
      const plat: Platform = {
        id: platId,
        x: px + (idx * 20),
        y: y,
        width: width,
        height: pType === 'drop_through' ? 14 : pType === 'floating_rune' ? 16 : 22,
        type: pType,
        hasArch: pType === 'solid' && width >= 140,
      };
      platforms.push(plat);

      // Add Lord Voldemort to wide platforms
      if (width >= 150 && Math.random() < 0.48 && enemies.length < 16) {
        enemies.push({
          id: `voldemort_${platId}`,
          x: plat.x + width / 2,
          y: plat.y - 34,
          vx: Math.random() < 0.5 ? 1.2 : -1.2,
          width: 24,
          height: 34,
          facing: 'LEFT',
          minX: plat.x + 6,
          maxX: plat.x + width - 30,
          patrolSpeed: 1.15 + Math.random() * 0.4,
          animationTimer: 0,
          frameIndex: 0,
          tauntTimer: 0,
          platformId: platId,
          laughCooldown: 0,
        });
      }

      // Add Professor Dumbledore on some peaceful high/mid platforms
      if ((tierIdx === 2 || tierIdx === 3) && width >= 100 && Math.random() < 0.25 && dumbledores.length < 10) {
        dumbledores.push({
          id: `dumbledore_plat_${platId}`,
          x: plat.x + width / 2 - 12,
          y: plat.y - 36,
          baseY: plat.y - 36,
          width: 26,
          height: 36,
          facing: Math.random() < 0.5 ? 'RIGHT' : 'LEFT',
          collected: false,
          floatingPhase: Math.random() * Math.PI * 2,
          isInAir: false,
          sparkleTimer: 0,
        });
      }
    });
  }

  // Also add Lord Voldemort patrolling on ground stretches
  for (let ex = 450; ex < worldWidth - 300; ex += 440 + Math.random() * 180) {
    enemies.push({
      id: `voldemort_ground_${ex}`,
      x: ex,
      y: 520 - 34,
      vx: Math.random() < 0.5 ? 1.3 : -1.3,
      width: 24,
      height: 34,
      facing: 'LEFT',
      minX: ex - 120,
      maxX: ex + 140,
      patrolSpeed: 1.25,
      animationTimer: 0,
      frameIndex: 0,
      tauntTimer: 0,
      platformId: 'ground',
      laughCooldown: 0,
    });
  }

  // Add Dumbledore floating gracefully in the air between platforms (requiring jump skill!)
  for (let dx = 380; dx < worldWidth - 350; dx += 550 + Math.random() * 200) {
    const airY = 220 + Math.random() * 140;
    dumbledores.push({
      id: `dumbledore_air_${dx}`,
      x: dx,
      y: airY,
      baseY: airY,
      width: 26,
      height: 36,
      facing: Math.random() < 0.5 ? 'RIGHT' : 'LEFT',
      collected: false,
      floatingPhase: Math.random() * Math.PI * 2,
      isInAir: true,
      sparkleTimer: 0,
    });
  }

  // 4. Generate Exactly 100 Golden Coins (Galleons) across the castle!
  let coinId = 0;
  
  // Place on platforms
  platforms.forEach(p => {
    if (coinId >= 100) return;
    if (p.width > 60) {
      const numCoins = Math.min(3, Math.floor(p.width / 50));
      for (let c = 0; c < numCoins; c++) {
        if (coinId >= 100) break;
        const cx = p.x + 20 + c * 35;
        const cy = p.y - 24;
        coins.push({
          id: `coin_${coinId}`,
          x: cx,
          y: cy,
          width: 12,
          height: 12,
          collected: false,
          frame: coinId % 4,
          frameTimer: (coinId * 0.2) % 1,
          value: 1,
          floatOffset: 0,
        });
        coinId++;
      }
    }
  });

  // Place coins in jump arcs between platforms until we reach 100 coins
  let arcX = 120;
  while (coinId < 100 && arcX < worldWidth - 100) {
    const arcHeight = 280 + Math.random() * 120;
    coins.push({
      id: `coin_${coinId}`,
      x: arcX,
      y: arcHeight,
      width: 12,
      height: 12,
      collected: false,
      frame: coinId % 4,
      frameTimer: Math.random(),
      value: 1,
      floatOffset: 0,
    });
    coinId++;
    arcX += 45 + Math.random() * 30;
  }

  return {
    platforms,
    coins,
    enemies,
    dumbledores,
    spires,
    clouds,
    worldWidth,
  };
}
