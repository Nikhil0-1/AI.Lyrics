import { BackgroundSettings } from '../types/background';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  alpha: number;
  color: string;
}

interface BokehOrb {
  x: number;
  y: number;
  radius: number;
  speed: number;
  alpha: number;
  hue: number;
}

export class BackgroundEngine {
  private particles: Particle[] = [];
  private bokehOrbs: BokehOrb[] = [];
  private lastWidth = 0;
  private lastHeight = 0;

  constructor() {
    this.initParticles(65, 1920, 1080);
    this.initBokeh(25, 1920, 1080);
  }

  private initParticles(count: number, width: number, height: number) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      const baseSize = Math.random() * 3 + 1.5;
      this.particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -Math.random() * 1.2 - 0.3,
        size: baseSize,
        baseSize,
        alpha: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.4 ? '#6366f1' : '#38bdf8'
      });
    }
  }

  private initBokeh(count: number, width: number, height: number) {
    this.bokehOrbs = [];
    for (let i = 0; i < count; i++) {
      this.bokehOrbs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 80 + 30,
        speed: Math.random() * 0.4 + 0.1,
        alpha: Math.random() * 0.25 + 0.05,
        hue: Math.random() * 40 + 220
      });
    }
  }

  public render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    currentTime: number,
    settings: BackgroundSettings,
    frequencyData: Uint8Array,
    beatPulse: number
  ) {
    if (width !== this.lastWidth || height !== this.lastHeight) {
      this.lastWidth = width;
      this.lastHeight = height;
      this.initParticles(settings.particleCount || 65, width, height);
      this.initBokeh(25, width, height);
    }

    ctx.save();

    const reactive = (settings.reactiveIntensity || 0.5) * beatPulse;
    const speed = settings.speed || 1.0;
    const time = currentTime * speed;

    switch (settings.type) {
      case 'cinematicGradient': {
        const cx = width / 2;
        const cy = height / 2;
        const grad = ctx.createRadialGradient(
          cx + Math.sin(time * 0.8) * (width * 0.25),
          cy + Math.cos(time * 0.6) * (height * 0.25),
          50,
          cx,
          cy,
          Math.max(width, height) * (0.8 + reactive * 0.2)
        );
        grad.addColorStop(0, settings.accentColor || '#4338ca');
        grad.addColorStop(0.5, settings.secondaryColor || '#1e1b4b');
        grad.addColorStop(1, settings.primaryColor || '#090a16');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
        break;
      }

      case 'darkCinematic': {
        const cx = width / 2;
        const cy = height / 2;
        const coreRadius = (Math.min(width, height) * 0.35) * (1 + reactive * 0.35);
        const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(width, height) * 0.75);
        grad.addColorStop(0, settings.accentColor || '#6366f1');
        grad.addColorStop(0.4, settings.secondaryColor || '#12131c');
        grad.addColorStop(1, settings.primaryColor || '#050508');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
        break;
      }

      case 'particles': {
        // Base dark tone
        ctx.fillStyle = settings.primaryColor || '#0b0c10';
        ctx.fillRect(0, 0, width, height);

        // Ambient radial glow behind particles
        const radGrad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.6);
        radGrad.addColorStop(0, `${settings.accentColor || '#66fcf1'}22`);
        radGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, width, height);

        // Draw and update particles
        for (const p of this.particles) {
          p.y += p.vy * (1 + reactive * 2);
          p.x += p.vx * (1 + reactive * 0.5);

          if (p.y < -20) p.y = height + 20;
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;

          const currentSize = p.baseSize * (1 + reactive * 1.5);
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.min(1, p.alpha * (1 + reactive));
          ctx.shadowBlur = 10 * (1 + reactive);
          ctx.shadowColor = p.color;
          ctx.fill();
        }
        break;
      }

      case 'waveform': {
        ctx.fillStyle = settings.primaryColor || '#0a0a0f';
        ctx.fillRect(0, 0, width, height);

        const centerY = height * 0.65;
        const sliceWidth = width / 64;

        ctx.strokeStyle = settings.accentColor || '#a855f7';
        ctx.lineWidth = 3 + reactive * 4;
        ctx.shadowBlur = 15;
        ctx.shadowColor = settings.accentColor || '#a855f7';

        ctx.beginPath();
        for (let i = 0; i < 64; i++) {
          const freq = frequencyData[i] || 30;
          const amp = (freq / 255) * (height * 0.25) * (1 + reactive * 0.5);
          const x = i * sliceWidth;
          const y = i % 2 === 0 ? centerY - amp : centerY + amp;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        break;
      }

      case 'equalizer': {
        ctx.fillStyle = settings.primaryColor || '#030712';
        ctx.fillRect(0, 0, width, height);

        const barCount = 48;
        const barWidth = (width / barCount) * 0.7;
        const gap = (width / barCount) * 0.3;
        const bottom = height * 0.9;

        for (let i = 0; i < barCount; i++) {
          const freq = frequencyData[i * 2] || 15;
          const barHeight = Math.max(10, (freq / 255) * (height * 0.45) * (1 + reactive * 0.4));
          const x = i * (barWidth + gap) + gap / 2;
          const y = bottom - barHeight;

          const barGrad = ctx.createLinearGradient(0, bottom, 0, y);
          barGrad.addColorStop(0, settings.secondaryColor || '#111827');
          barGrad.addColorStop(0.6, settings.accentColor || '#10b981');
          barGrad.addColorStop(1, '#ffffff');

          ctx.fillStyle = barGrad;
          ctx.shadowBlur = 12 * (1 + reactive);
          ctx.shadowColor = settings.accentColor || '#10b981';
          ctx.fillRect(x, y, barWidth, barHeight);
        }
        break;
      }

      case 'bokeh': {
        ctx.fillStyle = settings.primaryColor || '#050505';
        ctx.fillRect(0, 0, width, height);

        for (const orb of this.bokehOrbs) {
          orb.y -= orb.speed * (1 + reactive * 1.2);
          if (orb.y < -orb.radius) orb.y = height + orb.radius;

          const r = orb.radius * (1 + reactive * 0.25);
          const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, r);
          grad.addColorStop(0, `hsla(${orb.hue}, 80%, 65%, ${orb.alpha * (1 + reactive * 0.5)})`);
          grad.addColorStop(1, 'transparent');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

      case 'lightStreaks': {
        ctx.fillStyle = settings.primaryColor || '#020617';
        ctx.fillRect(0, 0, width, height);

        const count = 7;
        for (let i = 0; i < count; i++) {
          const offset = (time * 80 + i * 250) % (width + height);
          const x1 = offset;
          const y1 = 0;
          const x2 = offset - height * 0.5;
          const y2 = height;

          const streakGrad = ctx.createLinearGradient(x1, y1, x2, y2);
          streakGrad.addColorStop(0, 'transparent');
          streakGrad.addColorStop(0.5, settings.accentColor || '#38bdf8');
          streakGrad.addColorStop(1, 'transparent');

          ctx.strokeStyle = streakGrad;
          ctx.lineWidth = (15 + i * 5) * (1 + reactive * 0.8);
          ctx.shadowBlur = 20;
          ctx.shadowColor = settings.accentColor || '#38bdf8';
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
        break;
      }

      case 'minimalSolid':
      default: {
        ctx.fillStyle = settings.primaryColor || '#090a0f';
        ctx.fillRect(0, 0, width, height);

        // Subtle studio border vignette
        const grad = ctx.createRadialGradient(width / 2, height / 2, width * 0.3, width / 2, height / 2, width * 0.8);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
        break;
      }
    }

    ctx.restore();
  }
}
