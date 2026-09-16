import { LyricLine } from '../types/lyrics';
import { ProjectData } from '../types/project';
import { ANIMATION_PRESETS } from './presets/animationPresets';
import { KaraokeEngine } from './KaraokeEngine';

export class KineticTypographyEngine {
  public static renderLine(
    ctx: CanvasRenderingContext2D,
    line: LyricLine,
    currentTime: number,
    project: ProjectData,
    width: number,
    height: number,
    beatPulse: number
  ) {
    // If not within active window (with margin for in/out transitions)
    const presetId = line.style.animationPreset || project.globalStyle.animationPreset || 'smoothReveal';
    const preset = ANIMATION_PRESETS[presetId] || ANIMATION_PRESETS.smoothReveal;
    const transitionDuration = preset.duration || 0.5;

    const entryStart = line.start - 0.05;
    const exitEnd = line.end + transitionDuration;

    if (currentTime < entryStart || currentTime > exitEnd) {
      return; // line is not visible
    }

    ctx.save();

    // Base position
    const posX = (line.style.positionX !== undefined ? line.style.positionX : 50) / 100 * width;
    const posY = (line.style.positionY !== undefined ? line.style.positionY : 50) / 100 * height;

    // Font styling
    const baseFontSize = (line.style.fontSize || project.globalStyle.fontSize || 64) * (width / 1080);
    const fontFamily = line.style.fontFamily || project.globalStyle.fontFamily || 'Inter, sans-serif';
    const fontWeight = line.style.fontWeight || 800;
    const letterSpacing = line.style.letterSpacing || 0;
    const textAlign = line.style.textAlign || 'center';

    // Transition progress
    const elapsedSinceStart = currentTime - line.start;
    const inProgress = Math.max(0, Math.min(1, elapsedSinceStart / transitionDuration));
    const timeUntilEnd = line.end - currentTime;
    const outProgress = timeUntilEnd < transitionDuration 
      ? Math.max(0, Math.min(1, timeUntilEnd / transitionDuration)) 
      : 1.0;

    // Base transform values
    let alpha = 1.0;
    let scaleX = line.style.scale || 1.0;
    let scaleY = line.style.scale || 1.0;
    let transX = 0;
    let transY = 0;
    let rotation = (line.style.rotation || 0) * (Math.PI / 180);
    let blurPx = 0;
    let trackingAdd = 0;

    // Evaluate preset animation curves
    switch (presetId) {
      case 'fadeIn':
        alpha = inProgress * outProgress;
        break;

      case 'fadeOut':
        alpha = outProgress;
        break;

      case 'smoothReveal':
        alpha = inProgress * outProgress;
        transY = (1 - inProgress) * 40;
        blurPx = (1 - inProgress) * 8;
        break;

      case 'blurReveal':
        alpha = inProgress * outProgress;
        blurPx = (1 - inProgress) * 20;
        scaleX *= 0.95 + inProgress * 0.05;
        scaleY *= 0.95 + inProgress * 0.05;
        break;

      case 'slideUp':
        alpha = inProgress * outProgress;
        transY = (1 - inProgress) * 80;
        break;

      case 'slideDown':
        alpha = inProgress * outProgress;
        transY = -(1 - inProgress) * 80;
        break;

      case 'slideLeft':
        alpha = inProgress * outProgress;
        transX = (1 - inProgress) * 120;
        break;

      case 'slideRight':
        alpha = inProgress * outProgress;
        transX = -(1 - inProgress) * 120;
        break;

      case 'scaleIn':
        alpha = inProgress * outProgress;
        const scaleFactor = 0.5 + inProgress * 0.5;
        scaleX *= scaleFactor;
        scaleY *= scaleFactor;
        break;

      case 'scaleOut':
        alpha = inProgress * outProgress;
        const sOut = 1.0 + (1 - outProgress) * 0.4;
        scaleX *= sOut;
        scaleY *= sOut;
        break;

      case 'pop':
        alpha = inProgress * outProgress;
        const popCurve = inProgress < 0.7 
          ? (inProgress / 0.7) * 1.2 
          : 1.2 - ((inProgress - 0.7) / 0.3) * 0.2;
        scaleX *= popCurve;
        scaleY *= popCurve;
        break;

      case 'bounce':
        alpha = inProgress * outProgress;
        const bounceY = Math.sin(inProgress * Math.PI * 2.5) * (1 - inProgress) * 40;
        transY -= bounceY;
        break;

      case 'trackingReveal':
        alpha = inProgress * outProgress;
        trackingAdd = (1 - inProgress) * 12;
        break;

      case 'cinematicReveal':
        alpha = inProgress * outProgress;
        blurPx = (1 - inProgress) * 15;
        trackingAdd = (1 - inProgress) * 16;
        scaleX *= 0.92 + inProgress * 0.08;
        scaleY *= 0.92 + inProgress * 0.08;
        break;

      case 'beatPulse':
        alpha = inProgress * outProgress;
        const pulse = 1.0 + beatPulse * 0.12 * (line.style.animationIntensity || 0.8);
        scaleX *= pulse;
        scaleY *= pulse;
        break;

      case 'impact':
        alpha = inProgress * outProgress;
        const impactS = 1.0 + Math.max(0, 1 - inProgress * 3) * 0.6;
        scaleX *= impactS;
        scaleY *= impactS;
        break;

      case 'shake':
        alpha = inProgress * outProgress;
        if (beatPulse > 0.4) {
          transX += (Math.random() - 0.5) * 12;
          transY += (Math.random() - 0.5) * 8;
        }
        break;

      case 'glitch':
        alpha = inProgress * outProgress;
        if (Math.random() < 0.15 && beatPulse > 0.3) {
          transX += (Math.random() - 0.5) * 20;
          ctx.fillStyle = Math.random() > 0.5 ? '#22d3ee' : '#ec4899';
        }
        break;

      case 'rotation':
        alpha = inProgress * outProgress;
        rotation += Math.sin(inProgress * Math.PI) * 0.06;
        break;

      case 'floating':
        alpha = inProgress * outProgress;
        transY += Math.sin(currentTime * 2.5) * 10;
        break;

      case 'kineticTypography':
      default:
        alpha = inProgress * outProgress;
        const kineticS = 0.85 + inProgress * 0.15 + (beatPulse * 0.08);
        scaleX *= kineticS;
        scaleY *= kineticS;
        transY = (1 - inProgress) * 30;
        break;
    }

    // Apply global canvas filter if blur is present
    if (blurPx > 0.5) {
      ctx.filter = `blur(${blurPx.toFixed(1)}px)`;
    }

    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.translate(posX + transX, posY + transY);
    ctx.rotate(rotation);
    ctx.scale(scaleX, scaleY);

    // Setup font
    ctx.font = `${fontWeight} ${baseFontSize}px ${fontFamily}`;
    ctx.textAlign = textAlign;
    ctx.textBaseline = 'middle';

    // Shadows & Glow
    const shadowColor = line.style.shadowColor || 'rgba(0, 0, 0, 0.85)';
    const shadowBlur = (line.style.shadowBlur !== undefined ? line.style.shadowBlur : 12) * (width / 1080);
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = shadowBlur;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;

    const karaokeEnabled = project.settings.karaokeModeEnabled;
    const wordStates = karaokeEnabled && line.words && line.words.length > 0
      ? KaraokeEngine.getWordStates(line.words, currentTime, project.settings.karaokeStyle)
      : [];

    // If word-level karaoke is active, render word by word
    if (karaokeEnabled && line.words && line.words.length > 0) {
      this.renderWords(ctx, line.words, wordStates, baseFontSize, letterSpacing + trackingAdd, line.style, project);
    } else {
      // Render full line directly
      this.renderSingleText(ctx, line.text, line.style, project);
    }

    ctx.restore();
  }

  private static renderSingleText(
    ctx: CanvasRenderingContext2D,
    text: string,
    style: LyricLine['style'],
    project: ProjectData
  ) {
    const fillColor = style.fillColor || project.globalStyle.fillColor || '#FFFFFF';
    const outlineColor = style.outlineColor;
    const outlineWidth = (style.outlineWidth || 0);

    // Glow effect
    if (style.glowColor && (style.glowIntensity || 0) > 0) {
      ctx.save();
      ctx.shadowColor = style.glowColor;
      ctx.shadowBlur = 25 * (style.glowIntensity || 0.5);
      ctx.fillStyle = fillColor;
      ctx.fillText(text, 0, 0);
      ctx.restore();
    }

    // Outline stroke
    if (outlineColor && outlineWidth > 0) {
      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = outlineWidth * 2;
      ctx.lineJoin = 'round';
      ctx.strokeText(text, 0, 0);
    }

    // Main fill
    ctx.fillStyle = fillColor;
    ctx.fillText(text, 0, 0);
  }

  private static renderWords(
    ctx: CanvasRenderingContext2D,
    words: LyricLine['words'],
    states: ReturnType<typeof KaraokeEngine.getWordStates>,
    fontSize: number,
    letterSpacing: number,
    style: LyricLine['style'],
    project: ProjectData
  ) {
    // Measure words and space width
    const spaceWidth = ctx.measureText(' ').width + letterSpacing;
    const measuredWords = words.map(w => ({
      word: w.word,
      width: ctx.measureText(w.word).width + letterSpacing
    }));

    const totalWidth = measuredWords.reduce((acc, w) => acc + w.width, 0) + (words.length - 1) * spaceWidth;
    let startX = -totalWidth / 2;

    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      const state = states[i];
      const mw = measuredWords[i];
      const wordCenter = startX + mw.width / 2;

      ctx.save();
      ctx.translate(wordCenter, 0);
      ctx.scale(state.scale, state.scale);

      // Active word badge pill background
      if (state.isActive && project.settings.karaokeStyle.activeWordBg) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        const padX = 12;
        const padY = 8;
        const pillW = mw.width + padX * 2;
        const pillH = fontSize + padY * 2;
        ctx.beginPath();
        ctx.roundRect(-pillW / 2, -pillH / 2, pillW, pillH, 8);
        ctx.fill();
      }

      // Active word neon glow
      if (state.glow) {
        ctx.shadowColor = state.highlightColor;
        ctx.shadowBlur = 20;
      }

      // Base color vs active singing color
      const defaultColor = style.fillColor || project.globalStyle.fillColor || '#FFFFFF';
      const color = state.isActive 
        ? state.highlightColor 
        : state.isPast 
          ? defaultColor 
          : 'rgba(255, 255, 255, 0.75)';

      // Outline
      if (style.outlineColor && (style.outlineWidth || 0) > 0) {
        ctx.strokeStyle = style.outlineColor;
        ctx.lineWidth = (style.outlineWidth || 1) * 2;
        ctx.lineJoin = 'round';
        ctx.strokeText(w.word, 0, 0);
      }

      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(w.word, 0, 0);

      ctx.restore();

      startX += mw.width + spaceWidth;
    }
  }
}
