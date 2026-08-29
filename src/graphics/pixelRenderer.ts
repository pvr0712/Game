import { Player, Enemy, OwlHazard, Coin, Platform, Particle, Cloud, CastleSpire, DumbledoreBonus } from '../types';

export class PixelRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  // Draw pixel rectangle helper
  public pRect(x: number, y: number, w: number, h: number, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
  }

  // Draw sky and moon with clouds
  public drawSky(
    width: number,
    height: number,
    gameTime: number,
    clouds: Cloud[],
    cameraX: number
  ) {
    // Midnight Hogwarts Sky gradient
    const grad = this.ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#060814');
    grad.addColorStop(0.4, '#0d132b');
    grad.addColorStop(0.75, '#161c3d');
    grad.addColorStop(1, '#1e2447');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, width, height);

    // Twinkling stars
    const starCount = 45;
    for (let i = 0; i < starCount; i++) {
      const sx = (i * 73 + 17) % width;
      const sy = (i * 37 + 29) % (height * 0.55);
      const twinkle = Math.sin(gameTime * 2.5 + i * 1.7) * 0.5 + 0.5;
      const starColor = twinkle > 0.6 ? '#ffffff' : twinkle > 0.3 ? '#cbd5e1' : '#64748b';
      const size = i % 7 === 0 ? 3 : i % 3 === 0 ? 2 : 1;
      this.pRect(sx, sy, size, size, starColor);
      if (size === 3 && twinkle > 0.7) {
        this.pRect(sx - 1, sy + 1, 1, 1, 'rgba(255,255,255,0.7)');
        this.pRect(sx + 3, sy + 1, 1, 1, 'rgba(255,255,255,0.7)');
        this.pRect(sx + 1, sy - 1, 1, 1, 'rgba(255,255,255,0.7)');
        this.pRect(sx + 1, sy + 3, 1, 1, 'rgba(255,255,255,0.7)');
      }
    }

    // Glowing Full Moon
    const moonX = width - 130 - (cameraX * 0.05);
    const moonY = 65;
    const moonRadius = 34;

    // Moon outer soft glow
    this.ctx.fillStyle = 'rgba(254, 240, 138, 0.06)';
    this.ctx.beginPath();
    this.ctx.arc(moonX, moonY, moonRadius + 22, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = 'rgba(254, 240, 138, 0.15)';
    this.ctx.beginPath();
    this.ctx.arc(moonX, moonY, moonRadius + 10, 0, Math.PI * 2);
    this.ctx.fill();

    // Moon pixelated disk
    for (let dy = -moonRadius; dy <= moonRadius; dy += 2) {
      for (let dx = -moonRadius; dx <= moonRadius; dx += 2) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= moonRadius) {
          // Crater textures
          const isCrater =
            (dx > -12 && dx < -2 && dy > -8 && dy < 4) ||
            (dx > 6 && dx < 18 && dy > 4 && dy < 16) ||
            (dx > -4 && dx < 8 && dy > -20 && dy < -10);

          let color = '#fef08a';
          if (dist > moonRadius - 4) {
            color = '#fef9c3';
          }
          if (isCrater) {
            color = '#eab308';
          }
          this.pRect(moonX + dx, moonY + dy, 2, 2, color);
        }
      }
    }

    // Draw Far Clouds (Parallax Layer 0)
    this.drawClouds(clouds.filter(c => c.layer === 0), cameraX * 0.1, '#1e293b', 0.45);
  }

  // Draw Castle Silhouettes
  public drawCastleBackground(
    width: number,
    height: number,
    cameraX: number,
    spires: CastleSpire[],
    gameTime: number
  ) {
    this.ctx.save();
    const offsetX = -(cameraX * 0.25);

    if (Array.isArray(spires)) {
      spires.forEach(spire => {
        const sx = spire.x + offsetX;
        const sy = spire.y;
        const sw = spire.width;
        const sh = spire.height;

        // Only draw if on screen
        if (sx + sw < -50 || sx > width + 50) return;

        // Dark Hogwarts stone silhouette
        const stoneColor = '#0b0f1f';
        const highlightColor = '#1e293b';

        if (spire.type === 'tower') {
          // Main tower body
          this.pRect(sx, sy, sw, sh, stoneColor);
          // Tower left rim highlight
          this.pRect(sx, sy, 3, sh, highlightColor);

          // Conical roof
          const roofHeight = 40;
          for (let r = 0; r < roofHeight; r += 2) {
            const stepW = sw * (1 - r / roofHeight);
            const rx = sx + (sw - stepW) / 2;
            this.pRect(rx, sy - r, stepW, 2, '#0f172a');
          }
          // Spire pinnacle needle
          this.pRect(sx + sw / 2 - 1, sy - roofHeight - 12, 3, 14, '#1e293b');

          // Battlements / crenellations
          const battlementW = 6;
          for (let b = 0; b < sw; b += battlementW * 2) {
            this.pRect(sx + b, sy - 8, battlementW, 8, stoneColor);
          }

          // Stained glass lit windows
          if (spire.windowLit) {
            const winY = sy + 30;
            const flicker = Math.sin(gameTime * 3 + sx) * 0.15 + 0.85;
            const winColor = `rgba(251, 191, 36, ${flicker})`;
            this.pRect(sx + sw / 2 - 4, winY, 8, 14, winColor);
            this.pRect(sx + sw / 2 - 2, winY - 3, 4, 3, winColor);
            // Window frame cross
            this.pRect(sx + sw / 2 - 1, winY, 2, 14, '#090d1a');
            this.pRect(sx + sw / 2 - 4, winY + 6, 8, 2, '#090d1a');
          }
        } else if (spire.type === 'bridge') {
          // Viaduct bridge with arches
          this.pRect(sx, sy, sw, 16, stoneColor);
          this.pRect(sx, sy, sw, 3, highlightColor);

          // Arches
          const archSpan = 32;
          for (let a = 0; a < sw; a += archSpan) {
            this.pRect(sx + a, sy + 16, 6, sh - 16, stoneColor);
          }
        } else if (spire.type === 'turret') {
          // Smaller turret
          this.pRect(sx, sy, sw, sh, stoneColor);
          const roofH = 26;
          for (let r = 0; r < roofH; r += 2) {
            const stepW = sw * (1 - r / roofH);
            this.pRect(sx + (sw - stepW) / 2, sy - r, stepW, 2, '#111827');
          }
        }
      });
    }

    this.ctx.restore();
  }

  // Draw Clouds
  public drawClouds(clouds: Cloud[], offset: number, baseColor: string, alpha: number) {
    this.ctx.save();
    this.ctx.globalAlpha = alpha;

    clouds.forEach(cloud => {
      const cx = cloud.x - offset;
      const cy = cloud.y;
      const cw = cloud.width;
      const ch = cloud.height;

      // Draw layered pixel puff cloud
      const puffs = [
        { dx: cw * 0.2, dy: ch * 0.3, r: ch * 0.4 },
        { dx: cw * 0.45, dy: ch * 0.15, r: ch * 0.55 },
        { dx: cw * 0.7, dy: ch * 0.35, r: ch * 0.4 },
        { dx: cw * 0.5, dy: ch * 0.5, r: ch * 0.4 },
      ];

      this.ctx.fillStyle = baseColor;
      puffs.forEach(p => {
        const px = cx + p.dx;
        const py = cy + p.dy;
        const radius = p.r;
        for (let dy = -radius; dy <= radius; dy += 3) {
          for (let dx = -radius; dx <= radius; dx += 3) {
            if (dx * dx + dy * dy <= radius * radius) {
              this.pRect(px + dx, py + dy, 3, 3, baseColor);
            }
          }
        }
      });
    });

    this.ctx.restore();
  }

  // Draw Platforms
  public drawPlatforms(platforms: Platform[], cameraX: number, gameTime: number) {
    platforms.forEach(p => {
      const px = p.x - cameraX;
      const py = p.y;
      const pw = p.width;
      const ph = p.height;

      if (p.type === 'solid') {
        // Hogwarts Castle Stone Platform
        // Top stone ledge
        this.pRect(px, py, pw, 5, '#64748b'); // Top highlight
        this.pRect(px, py + 5, pw, ph - 5, '#334155'); // Main stone
        this.pRect(px, py + ph - 4, pw, 4, '#1e293b'); // Bottom shadow

        // Brick masonry lines
        const brickW = 20;
        const brickH = 8;
        let row = 0;
        for (let by = py + 5; by < py + ph - 4; by += brickH) {
          const shift = (row % 2) * (brickW / 2);
          for (let bx = px + shift; bx < px + pw; bx += brickW) {
            // Mortar line
            this.pRect(bx, by, 2, Math.min(brickH, py + ph - by), '#1e293b');
            // Stone variation speckles
            if ((bx + by) % 17 === 0) {
              this.pRect(bx + 4, by + 3, 3, 2, '#475569');
            }
            // Moss / ivy in crevices
            if ((bx + by) % 23 === 0) {
              this.pRect(bx + 2, by + 1, 4, 3, '#15803d');
            }
          }
          this.pRect(px, by, pw, 1, '#1e293b');
          row++;
        }

        // Stone Arch Support under thick platforms
        if (p.hasArch && pw >= 80) {
          const archW = Math.min(60, pw * 0.6);
          const archX = px + (pw - archW) / 2;
          this.pRect(archX, py + ph, archW, 12, '#1e293b');
          this.pRect(archX + 4, py + ph + 2, archW - 8, 10, '#0f172a');
        }

        // Torch on platform if wide enough
        if (pw > 140) {
          const torchX = px + 24;
          const torchY = py - 18;
          // Bracket
          this.pRect(torchX, torchY + 10, 4, 8, '#78350f');
          this.pRect(torchX - 2, torchY + 16, 8, 3, '#451a03');
          // Flame
          const flamePhase = Math.sin(gameTime * 12 + px) * 2;
          this.pRect(torchX - 1 + flamePhase * 0.5, torchY + 4, 6, 6, '#ea580c');
          this.pRect(torchX + flamePhase * 0.3, torchY + 1, 4, 5, '#f59e0b');
          this.pRect(torchX + 1, torchY - 2, 2, 4, '#fef08a');
        }
      } else if (p.type === 'drop_through') {
        // Wooden Hogwarts Balcony / Stair landing (can drop through with DOWN/S key)
        this.pRect(px, py, pw, 4, '#b45309'); // Wood top highlight
        this.pRect(px, py + 4, pw, ph - 4, '#78350f'); // Wood plank
        this.pRect(px, py + ph - 2, pw, 2, '#451a03'); // Shadow

        // Wooden balustrade / railings
        const postW = 4;
        for (let bx = px + 6; bx < px + pw - 6; bx += 14) {
          this.pRect(bx, py - 10, postW, 10, '#92400e');
          this.pRect(bx + 1, py - 10, 2, 10, '#d97706');
        }
        // Top handrail
        this.pRect(px + 4, py - 12, pw - 8, 3, '#f59e0b');
        this.pRect(px + 4, py - 9, pw - 8, 1, '#78350f');

        // Drop-through hint icon (small subtle down arrow dots)
        if (pw >= 60) {
          const midX = px + pw / 2;
          this.pRect(midX - 2, py + 2, 4, 1, '#fef08a');
          this.pRect(midX - 1, py + 3, 2, 1, '#fef08a');
        }
      } else if (p.type === 'floating_rune') {
        // Floating Ancient Hogwarts Rune Platform
        const bob = Math.sin(gameTime * 3 + p.x) * 3;
        const curY = py + bob;

        // Magic amethyst / cyan crystal base
        this.pRect(px, curY, pw, 3, '#c084fc');
        this.pRect(px, curY + 3, pw, ph - 3, '#7e22ce');
        this.pRect(px, curY + ph - 3, pw, 3, '#3b0764');

        // Glowing runes across the platform
        const runeCount = Math.floor(pw / 24);
        for (let r = 0; r < runeCount; r++) {
          const rx = px + 12 + r * 24;
          const glow = Math.sin(gameTime * 4 + r * 1.5) * 0.4 + 0.6;
          this.ctx.fillStyle = `rgba(232, 121, 249, ${glow})`;
          // Little rune glyph
          this.pRect(rx, curY + 4, 4, 4, `rgba(244, 114, 182, ${glow})`);
          this.pRect(rx + 1, curY + 2, 2, 2, `rgba(250, 232, 255, ${glow})`);
        }

        // Particle sparkle underneath
        if (Math.random() < 0.15) {
          this.pRect(px + Math.random() * pw, curY + ph + Math.random() * 6, 2, 2, '#f472b6');
        }
      }
    });
  }

  // Draw Player Sprite (Harry Potter, Ron Weasley, or Hermione Granger)
  public drawPlayer(player: Player, cameraX: number, gameTime: number) {
    const px = Math.floor(player.x - cameraX);
    const py = Math.floor(player.y);
    const isFacingLeft = player.facing === 'LEFT';
    const character = player.character || 'harry';

    // Invulnerability blink
    if (player.invulnerableTimer > 0) {
      if (Math.floor(gameTime * 15) % 2 === 0) {
        return; // Flash invisibly
      }
    }

    this.ctx.save();
    // Translate and flip if facing left
    if (isFacingLeft) {
      this.ctx.translate(px + player.width, py);
      this.ctx.scale(-1, 1);
    } else {
      this.ctx.translate(px, py);
    }

    const isRunning = player.action === 'RUNNING';
    const isJumping = player.action === 'JUMPING' || player.action === 'FALLING';
    const legPhase = Math.floor(player.frameIndex) % 4;

    // --- STANDING / RUNNING / JUMPING POSE (Height ~32px) ---
    const bounce = isRunning ? (legPhase % 2 === 0 ? 1 : -1) : 0;
      const headY = 2 + bounce;

      // Legs / Robe Bottom
      if (isJumping) {
        this.pRect(4, 24, 6, 6, '#0f172a');
        this.pRect(12, 22, 6, 6, '#0f172a');
        this.pRect(3, 29, 6, 3, '#020617');
        this.pRect(13, 27, 6, 3, '#020617');
      } else if (isRunning) {
        if (legPhase === 0) {
          this.pRect(4, 22, 5, 8, '#0f172a');
          this.pRect(13, 22, 5, 6, '#0f172a');
          this.pRect(2, 29, 6, 3, '#020617');
          this.pRect(14, 27, 6, 3, '#020617');
        } else if (legPhase === 1) {
          this.pRect(7, 22, 5, 8, '#0f172a');
          this.pRect(10, 22, 5, 8, '#0f172a');
          this.pRect(6, 29, 6, 3, '#020617');
          this.pRect(10, 29, 6, 3, '#020617');
        } else if (legPhase === 2) {
          this.pRect(13, 22, 5, 8, '#0f172a');
          this.pRect(4, 22, 5, 6, '#0f172a');
          this.pRect(14, 29, 6, 3, '#020617');
          this.pRect(2, 27, 6, 3, '#020617');
        } else {
          this.pRect(8, 22, 6, 8, '#0f172a');
          this.pRect(7, 29, 7, 3, '#020617');
        }
      } else {
        this.pRect(5, 22, 5, 8, '#0f172a');
        this.pRect(12, 22, 5, 8, '#0f172a');
        this.pRect(4, 29, 6, 3, '#020617');
        this.pRect(12, 29, 6, 3, '#020617');
      }

      // Torso / Hogwarts Uniform / Robe
      this.pRect(4, 12 + bounce, 14, 11, '#0f172a'); // Black robe
      this.pRect(8, 13 + bounce, 6, 9, '#7f1d1d'); // Maroon inner vest/tie
      this.pRect(9, 13 + bounce, 4, 3, '#f1f5f9'); // White shirt collar
      this.pRect(10, 15 + bounce, 2, 4, '#dc2626'); // Red tie

      // Gryffindor Scarf
      this.pRect(5, 10 + bounce, 12, 4, '#b91c1c'); // Neck scarf
      this.pRect(8, 10 + bounce, 4, 4, '#f59e0b'); // Gold stripe
      this.pRect(13, 10 + bounce, 3, 4, '#b91c1c');

      // Scarf Tail Waving
      if (isRunning || isJumping) {
        const wave = Math.sin(gameTime * 14) * 2;
        this.pRect(-4, 11 + bounce + wave, 6, 3, '#b91c1c');
        this.pRect(-7, 12 + bounce + wave, 4, 3, '#f59e0b');
        this.pRect(-10, 13 + bounce + wave, 4, 2, '#b91c1c');
      } else {
        this.pRect(3, 13 + bounce, 3, 6, '#b91c1c');
        this.pRect(3, 15 + bounce, 3, 2, '#f59e0b');
      }

      // Head / Face
      this.pRect(6, headY + 2, 10, 8, character === 'ron' ? '#fde047' : '#fed7aa'); // Skin

      if (character === 'ron') {
        // --- RON WEASLEY (Bright ginger hair, freckles, blue eyes) ---
        this.pRect(5, headY, 13, 5, '#c2410c'); // Bright ginger red hair
        this.pRect(3, headY + 2, 4, 5, '#ea580c');
        this.pRect(15, headY + 1, 4, 5, '#c2410c');
        this.pRect(7, headY, 5, 2, '#fb923c'); // Hair sheen
        // Ron's cute freckles
        this.pRect(8, headY + 5, 1, 1, '#b45309');
        this.pRect(10, headY + 5, 1, 1, '#b45309');
        this.pRect(12, headY + 6, 1, 1, '#b45309');
        // Expressive blue eyes
        this.pRect(10, headY + 4, 4, 4, '#0369a1');
        this.pRect(11, headY + 5, 2, 2, '#38bdf8');
        this.pRect(12, headY + 5, 1, 1, '#ffffff'); // Glint
        // Wand & Arm
        this.pRect(14, 14 + bounce, 4, 3, '#fde047');
        this.pRect(17, 14 + bounce, 7, 2, '#b45309');
        this.pRect(23, 13 + bounce, 2, 4, '#fdba74'); // Warm golden spark
      } else if (character === 'hermione') {
        // --- HERMIONE GRANGER (Bushy voluminous brown curls, intelligent amber eyes, book strap) ---
        this.pRect(4, headY - 1, 15, 6, '#78350f'); // Big bushy brown hair
        this.pRect(1, headY + 1, 6, 12, '#92400e'); // Left bushy side mane
        this.pRect(14, headY + 1, 6, 12, '#78350f'); // Right bushy side mane
        this.pRect(7, headY - 1, 5, 2, '#b45309'); // Highlights
        // Big warm amber-brown eyes
        this.pRect(10, headY + 4, 4, 4, '#713f12');
        this.pRect(11, headY + 5, 2, 2, '#d97706');
        this.pRect(12, headY + 5, 1, 1, '#ffffff'); // Glint
        // Wand & Arm
        this.pRect(14, 14 + bounce, 4, 3, '#fed7aa');
        this.pRect(17, 14 + bounce, 7, 2, '#451a03'); // Dark vine wood wand
        this.pRect(23, 13 + bounce, 2, 4, '#c084fc'); // Lumos / magical violet tip
      } else {
        // --- HARRY POTTER (Messy jet-black hair, lightning scar, round glasses & green eyes) ---
        this.pRect(5, headY, 12, 4, '#0f172a');
        this.pRect(3, headY + 2, 4, 4, '#0f172a');
        this.pRect(15, headY + 1, 3, 4, '#0f172a');
        this.pRect(8, headY, 4, 2, '#334155'); // Highlight
        // Lightning Bolt Scar on forehead
        this.pRect(8, headY + 3, 2, 1, '#dc2626');
        this.pRect(9, headY + 4, 1, 1, '#f59e0b');
        // Round Glasses & Green Eyes
        this.pRect(10, headY + 4, 5, 5, '#020617'); // Frame
        this.pRect(11, headY + 5, 3, 3, '#a7f3d0'); // Green lens
        this.pRect(12, headY + 5, 1, 2, '#047857'); // Iris
        this.pRect(13, headY + 5, 1, 1, '#ffffff'); // Glint
        // Wand & Arm
        this.pRect(14, 14 + bounce, 4, 3, '#fed7aa'); // Hand
        this.pRect(17, 14 + bounce, 7, 2, '#78350f'); // Wooden wand
        this.pRect(23, 13 + bounce, 2, 4, '#fef08a'); // Wand tip glow
      }

    this.ctx.restore();
  }

  // Draw Lord Voldemort Sprite (Patrolling Dark Lord Enemy)
  public drawEnemy(enemy: Enemy, cameraX: number, gameTime: number) {
    const ex = Math.floor(enemy.x - cameraX);
    const ey = Math.floor(enemy.y);
    const isFacingLeft = enemy.facing === 'LEFT';

    this.ctx.save();
    if (isFacingLeft) {
      this.ctx.translate(ex + enemy.width, ey);
      this.ctx.scale(-1, 1);
    } else {
      this.ctx.translate(ex, ey);
    }

    const legPhase = Math.floor(enemy.frameIndex) % 4;
    const bounce = legPhase % 2 === 0 ? 1 : 0;
    const headY = 1 + bounce;

    // Dark smoke / Death Eater ethereal mist swirling beneath his robes
    const mistWave = Math.sin(gameTime * 6 + enemy.x) * 2;
    this.pRect(0, 28, 22, 4, 'rgba(2, 6, 23, 0.7)');
    this.pRect(2, 30, 18, 3, 'rgba(6, 78, 59, 0.4)');

    // Billowing Dark Obsidian Silk Robes (Flowing, ghostly movement)
    this.pRect(4, 12 + bounce, 14, 12, '#090d16'); // Dark cloak body
    this.pRect(2, 16 + bounce, 18, 12, '#05070e'); // Flared bottom robes
    this.pRect(6, 14 + bounce, 10, 14, '#0f172a'); // Center pleat
    this.pRect(8, 13 + bounce, 6, 12, '#042f2e'); // Sinister green-black undertone

    // Feet / Bare ghostly hem
    if (legPhase === 0) {
      this.pRect(3, 27, 6, 4, '#020617');
      this.pRect(13, 26, 6, 4, '#020617');
      this.pRect(1, 29, 4, 2, 'rgba(16, 185, 129, 0.3)');
    } else if (legPhase === 1 || legPhase === 3) {
      this.pRect(6, 27, 6, 4, '#020617');
      this.pRect(10, 27, 6, 4, '#020617');
    } else {
      this.pRect(13, 27, 6, 4, '#020617');
      this.pRect(3, 26, 6, 4, '#020617');
      this.pRect(15, 29, 4, 2, 'rgba(16, 185, 129, 0.3)');
    }

    // High pointed collar of Death Eater robes
    this.pRect(3, 8 + bounce, 4, 5, '#020617');
    this.pRect(15, 8 + bounce, 4, 5, '#020617');

    // Voldemort's Pale Serpent Head (Chalk white, bald, gaunt cheekbones)
    this.pRect(6, headY + 1, 10, 9, '#f1f5f9'); // Chalk pale skin
    this.pRect(7, headY, 8, 2, '#f8fafc'); // Bald dome top
    this.pRect(5, headY + 2, 2, 6, '#e2e8f0'); // Left jawline
    this.pRect(15, headY + 2, 2, 6, '#cbd5e1'); // Right shadow jaw

    // Veins on pale scalp
    this.pRect(9, headY + 1, 2, 2, 'rgba(148, 163, 184, 0.6)');

    // Piercing Blood-Red Slit Eyes (Demonic snake eyes)
    this.pRect(10, headY + 4, 5, 3, '#7f1d1d'); // Red socket
    this.pRect(11, headY + 4, 3, 2, '#ef4444'); // Glowing ruby eye
    this.pRect(12, headY + 4, 1, 2, '#000000'); // Vertical serpent slit pupil
    this.pRect(13, headY + 4, 1, 1, '#fca5a5'); // Glint

    // Snake Slit Nostrils (No human nose!)
    this.pRect(11, headY + 7, 1, 2, '#334155');
    this.pRect(13, headY + 7, 1, 2, '#334155');

    // Cruel thin lip mouth / cackle
    this.pRect(10, headY + 9, 5, 1, '#1e293b');
    if (enemy.tauntTimer > 0) {
      // Open mouth laughing
      this.pRect(11, headY + 9, 3, 2, '#450a0a');
    }

    // Pale Skeletal Arm holding Yew / Bone Wand
    this.pRect(14, 13 + bounce, 4, 3, '#f1f5f9'); // Pale skeletal hand
    this.pRect(17, 12 + bounce, 7, 2, '#fef08a'); // 13½ inch bone-white yew wand
    this.pRect(23, 11 + bounce, 2, 4, '#22c55e'); // Green Avada Kedavra spark

    // Crackling dark green magical aura around wand tip
    const sparkFlicker = Math.sin(gameTime * 20 + enemy.x) > 0;
    if (sparkFlicker) {
      this.pRect(24, 9 + bounce, 3, 3, '#4ade80');
      this.pRect(26, 12 + bounce, 2, 2, '#86efac');
    }

    // Voldemort Laugh Speech Bubble / Dark Mark
    if (enemy.tauntTimer > 0) {
      const bubbleY = headY - 18;
      // Speech balloon
      this.pRect(0, bubbleY, 26, 14, '#090d16');
      this.pRect(1, bubbleY + 1, 24, 12, '#022c22');
      this.pRect(8, bubbleY + 14, 4, 3, '#022c22');

      // "NYEH HEH!" / Dark Mark Skull symbol in bubble
      this.ctx.fillStyle = '#4ade80';
      this.ctx.font = 'bold 5px "Press Start 2P"';
      this.ctx.fillText('HEH!', 3, bubbleY + 9);
      
      // Floating skull icon
      this.pRect(18, bubbleY + 3, 5, 4, '#86efac');
      this.pRect(19, bubbleY + 7, 3, 3, '#4ade80');
      this.pRect(19, bubbleY + 4, 1, 1, '#022c22');
      this.pRect(21, bubbleY + 4, 1, 1, '#022c22');
    }

    this.ctx.restore();
  }

  // Draw Professor Albus Dumbledore (Friendly Master Wizard NPC - Gives HP Boost)
  public drawDumbledore(dumbledore: DumbledoreBonus, cameraX: number, gameTime: number) {
    if (dumbledore.collected) return;

    const dx = Math.floor(dumbledore.x - cameraX);
    const floatY = dumbledore.baseY + Math.sin(gameTime * 3.5 + dumbledore.floatingPhase) * (dumbledore.isInAir ? 7 : 3);
    const dy = Math.floor(floatY);
    const isFacingLeft = dumbledore.facing === 'LEFT';

    this.ctx.save();

    // Golden Phoenix / Fawkes Halo & Warm Magic Aura
    const auraPulse = Math.sin(gameTime * 4 + dumbledore.floatingPhase) * 0.15 + 0.85;
    this.ctx.fillStyle = `rgba(251, 191, 36, ${0.2 * auraPulse})`;
    this.ctx.beginPath();
    this.ctx.arc(dx + 13, dy + 16, 26, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = `rgba(245, 158, 11, ${0.35 * auraPulse})`;
    this.ctx.beginPath();
    this.ctx.arc(dx + 13, dy + 16, 18, 0, Math.PI * 2);
    this.ctx.fill();

    if (isFacingLeft) {
      this.ctx.translate(dx + dumbledore.width, dy);
      this.ctx.scale(-1, 1);
    } else {
      this.ctx.translate(dx, dy);
    }

    // Floating Rune Ring beneath Dumbledore if in air
    if (dumbledore.isInAir) {
      const runeW = 24;
      const runeY = 32;
      this.pRect(2, runeY, runeW, 3, '#f59e0b');
      this.pRect(6, runeY + 2, runeW - 8, 2, '#fbbf24');
      this.pRect(10, runeY + 4, runeW - 16, 2, '#fef08a');
    }

    // Magnificent Plum & Midnight Blue Robes with Gold Trim
    this.pRect(4, 13, 18, 16, '#312e81'); // Midnight Indigo robe
    this.pRect(6, 14, 14, 15, '#4c1d95'); // Rich plum body
    this.pRect(2, 22, 22, 7, '#312e81'); // Wide flowing bottom
    // Golden Astrological Star & Moon embroidery
    this.pRect(8, 18, 2, 2, '#fbbf24');
    this.pRect(15, 23, 2, 2, '#fbbf24');
    this.pRect(10, 25, 3, 2, '#fde047');
    this.pRect(18, 17, 2, 2, '#fde047');
    // Gold robe hem
    this.pRect(2, 28, 22, 2, '#d97706');
    this.pRect(4, 29, 18, 1, '#fef08a');

    // Purple Buckled Wizard Boots
    this.pRect(5, 30, 5, 3, '#1e1b4b');
    this.pRect(15, 30, 5, 3, '#1e1b4b');
    this.pRect(6, 31, 2, 1, '#f59e0b');
    this.pRect(16, 31, 2, 1, '#f59e0b');

    // Dumbledore's Head & Warm Face
    this.pRect(7, 4, 12, 10, '#fde68a'); // Warm kindly skin
    this.pRect(8, 3, 10, 2, '#fde68a');

    // Pointed Purple Wizard Hat with Gold Stars
    this.pRect(3, 3, 20, 3, '#4338ca'); // Wide brim
    this.pRect(5, 0, 16, 4, '#4c1d95'); // Hat base
    this.pRect(7, -4, 12, 4, '#4c1d95'); // Mid cone
    this.pRect(9, -8, 8, 4, '#3730a3'); // Tapered cone
    this.pRect(11, -11, 4, 3, '#312e81'); // Tip bent backwards
    this.pRect(13, -13, 3, 2, '#fbbf24'); // Golden hat star tip

    // Flowing Silver-White Hair
    this.pRect(4, 4, 4, 10, '#f8fafc'); // Left side locks
    this.pRect(18, 4, 4, 10, '#f8fafc'); // Right side locks
    this.pRect(3, 12, 3, 6, '#e2e8f0');

    // Long Majestic Silver Beard (Tucked elegantly or flowing down to belt)
    this.pRect(7, 12, 12, 14, '#ffffff'); // Center beard
    this.pRect(9, 24, 8, 5, '#f8fafc'); // Lower beard
    this.pRect(10, 28, 6, 3, '#e2e8f0'); // Beard tip
    this.pRect(11, 22, 4, 2, '#cbd5e1'); // Silver beard belt buckle clasp

    // Half-Moon Spectacles & Twinkling Bright Blue Eyes
    this.pRect(11, 6, 5, 3, '#f59e0b'); // Gold frame
    this.pRect(12, 7, 3, 2, '#67e8f9'); // Cyan/blue twinkle lens
    this.pRect(13, 7, 1, 1, '#ffffff'); // Glint of wisdom

    // Kindly Smile & Crooked Nose
    this.pRect(10, 7, 2, 3, '#d97706'); // Famous crooked nose
    this.pRect(12, 11, 3, 1, '#b45309'); // Warm smile

    // Elder Wand in hand releasing Fawkes Phoenix Sparkles
    this.pRect(18, 14, 4, 3, '#fde68a'); // Hand
    this.pRect(20, 12, 6, 2, '#78350f'); // Elder wand
    this.pRect(21, 11, 2, 4, '#d97706'); // Wand elderberry nodules
    this.pRect(26, 11, 3, 3, '#fbbf24'); // Golden tip flame

    // Golden Phoenix Sparks dancing from wand
    const fawkesSparks = Math.floor(gameTime * 8) % 3;
    if (fawkesSparks === 0) {
      this.pRect(28, 8, 2, 2, '#ef4444'); // Phoenix scarlet spark
      this.pRect(30, 10, 2, 2, '#fbbf24'); // Phoenix gold spark
    } else if (fawkesSparks === 1) {
      this.pRect(29, 13, 2, 2, '#f59e0b');
      this.pRect(31, 7, 2, 2, '#ffffff');
    } else {
      this.pRect(27, 6, 2, 2, '#fbbf24');
    }

    // "+1 HP" Heart Badge above Dumbledore
    const badgeY = -22;
    this.pRect(3, badgeY, 20, 9, '#0f172a');
    this.pRect(4, badgeY + 1, 18, 7, '#7f1d1d');
    // Mini heart
    this.pRect(6, badgeY + 2, 2, 2, '#ef4444');
    this.pRect(9, badgeY + 2, 2, 2, '#ef4444');
    this.pRect(5, badgeY + 3, 7, 2, '#ef4444');
    this.pRect(6, badgeY + 5, 5, 2, '#ef4444');
    this.pRect(7, badgeY + 6, 3, 1, '#ef4444');

    this.ctx.fillStyle = '#fef08a';
    this.ctx.font = 'bold 5px "Press Start 2P"';
    this.ctx.fillText('+HP', 13, badgeY + 7);

    this.ctx.restore();
  }

  // Draw Flying Owl Hazard
  public drawOwl(owl: OwlHazard, cameraX: number, gameTime: number) {
    const ox = Math.floor(owl.x - cameraX);
    const oy = Math.floor(owl.y);
    const isFacingLeft = owl.facing === 'LEFT';

    // Off-screen warning indicator
    if (owl.warningTimer > 0) {
      const warnX = 800 - 32;
      const warnY = Math.max(30, Math.min(500, owl.warningY));
      const blink = Math.floor(gameTime * 10) % 2 === 0;

      this.ctx.save();
      // Warning box
      this.pRect(warnX, warnY - 12, 26, 24, blink ? '#dc2626' : '#7f1d1d');
      this.pRect(warnX + 2, warnY - 10, 22, 20, '#000000');

      // Owl silhouette in warning box
      this.pRect(warnX + 6, warnY - 6, 14, 10, '#fbbf24');
      this.pRect(warnX + 11, warnY - 4, 4, 3, '#ffffff');
      this.pRect(warnX + 12, warnY - 3, 2, 2, '#000000');
      // Down arrow if swooping, or Crouch/Jump hint
      if (owl.flightType === 'mid') {
        this.ctx.fillStyle = '#fef08a';
        this.ctx.font = '6px "Press Start 2P"';
        this.ctx.fillText('DUCK', warnX - 28, warnY + 4);
      } else {
        this.ctx.fillStyle = '#fef08a';
        this.ctx.font = '6px "Press Start 2P"';
        this.ctx.fillText('JUMP', warnX - 28, warnY + 4);
      }
      this.ctx.restore();
      return;
    }

    this.ctx.save();
    if (isFacingLeft) {
      this.ctx.translate(ox + owl.width, oy);
      this.ctx.scale(-1, 1);
    } else {
      this.ctx.translate(ox, oy);
    }

    const wingCycle = Math.sin(owl.wingPhase * 10);
    // Body (Hedwig snowy / barn owl mottled feathers)
    this.pRect(6, 6, 14, 10, '#f8fafc'); // White plumage
    this.pRect(8, 8, 10, 8, '#e2e8f0');
    this.pRect(10, 9, 3, 2, '#94a3b8'); // Speckled feathers
    this.pRect(14, 11, 2, 2, '#94a3b8');

    // Owl Head & Piercing Yellow Eyes
    this.pRect(14, 3, 8, 8, '#f8fafc');
    this.pRect(18, 5, 4, 4, '#facc15'); // Yellow eye
    this.pRect(20, 6, 2, 2, '#0f172a'); // Black pupil
    this.pRect(22, 7, 3, 2, '#d97706'); // Beak

    // Flapping Wings
    if (wingCycle > 0.3) {
      // Wings Up
      this.pRect(6, -4, 10, 8, '#f8fafc');
      this.pRect(4, -8, 8, 8, '#e2e8f0');
      this.pRect(2, -10, 6, 6, '#cbd5e1');
    } else if (wingCycle < -0.3) {
      // Wings Down
      this.pRect(6, 12, 10, 8, '#f8fafc');
      this.pRect(4, 16, 8, 8, '#e2e8f0');
      this.pRect(2, 20, 6, 6, '#cbd5e1');
    } else {
      // Wings Gliding / Flat
      this.pRect(0, 7, 16, 4, '#f8fafc');
      this.pRect(-4, 8, 8, 3, '#cbd5e1');
    }

    // Tail Feathers
    this.pRect(0, 10, 6, 4, '#cbd5e1');

    // Hogwarts Letter Carried in Talons
    if (owl.letterCarried) {
      this.pRect(12, 16, 8, 6, '#fef08a'); // Parchment envelope
      this.pRect(14, 18, 3, 3, '#b91c1c'); // Red wax seal
    }

    this.ctx.restore();
  }

  // Draw Golden Coins (Galleons)
  public drawCoin(coin: Coin, cameraX: number) {
    if (coin.collected) return;

    const cx = Math.floor(coin.x - cameraX);
    const cy = Math.floor(coin.y + coin.floatOffset);
    const frame = coin.frame % 4;

    this.ctx.save();

    // Golden Coin 4-frame rotation
    if (frame === 0) {
      // Full circle coin
      this.pRect(cx + 2, cy, 8, 12, '#fbbf24');
      this.pRect(cx, cy + 2, 12, 8, '#fbbf24');
      this.pRect(cx + 2, cy + 2, 8, 8, '#fef08a'); // Shiny inner
      this.pRect(cx + 4, cy + 4, 4, 4, '#d97706'); // G emblem
      // Sparkle
      this.pRect(cx + 3, cy + 3, 2, 2, '#ffffff');
    } else if (frame === 1) {
      // 3/4 angled coin
      this.pRect(cx + 3, cy, 6, 12, '#fbbf24');
      this.pRect(cx + 1, cy + 2, 10, 8, '#fbbf24');
      this.pRect(cx + 3, cy + 2, 6, 8, '#fef08a');
      this.pRect(cx + 4, cy + 4, 3, 4, '#d97706');
    } else if (frame === 2) {
      // Thin side profile coin
      this.pRect(cx + 4, cy, 4, 12, '#fbbf24');
      this.pRect(cx + 5, cy + 1, 2, 10, '#fef9c3');
    } else {
      // 3/4 angled other side
      this.pRect(cx + 3, cy, 6, 12, '#f59e0b');
      this.pRect(cx + 1, cy + 2, 10, 8, '#fbbf24');
      this.pRect(cx + 3, cy + 2, 6, 8, '#fef08a');
    }

    this.ctx.restore();
  }

  // Draw Magic Particles
  public drawParticles(particles: Particle[], cameraX: number) {
    particles.forEach(p => {
      const px = p.x - cameraX;
      const py = p.y;
      const alpha = p.life / p.maxLife;

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      this.ctx.fillStyle = p.color;

      if (p.shape === 'spark') {
        this.pRect(px, py, p.size, p.size, p.color);
        this.pRect(px - 1, py + 1, 1, 1, '#ffffff');
        this.pRect(px + p.size, py + 1, 1, 1, '#ffffff');
      } else if (p.shape === 'feather') {
        this.pRect(px, py, 4, 2, '#f8fafc');
        this.pRect(px + 1, py - 1, 2, 4, '#cbd5e1');
      } else {
        this.pRect(px, py, p.size, p.size, p.color);
      }
      this.ctx.restore();
    });
  }
}
