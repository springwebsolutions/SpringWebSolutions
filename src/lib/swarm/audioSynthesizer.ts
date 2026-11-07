/**
 * Audio Synthesizer — Procedural Web Audio API sound generator for Swarm
 * 
 * 100% synthetic — zero external audio files (.mp3/.wav) to download.
 * Respects browser autoplay policy and admin/user mute settings.
 */

class SwarmAudioSynthesizer {
  private ctx: AudioContext | null = null
  private isMuted: boolean = true
  private isUnlocked: boolean = false

  constructor() {
    // Initialized lazily on first user interaction or toggle
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        this.isUnlocked = true
      }).catch(() => {})
    }
    return this.ctx
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted
    if (!muted) {
      this.initContext()
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted
  }

  /**
   * Procedural Typewriter Tick
   * High-pass filtered noise burst simulating mechanical switch click
   */
  public playTypewriterTick(): void {
    if (this.isMuted) return
    const ctx = this.initContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()

      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(1400 + Math.random() * 400, now)
      filter.Q.setValueAtTime(4, now)

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(1200 + Math.random() * 300, now)
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.02)

      gain.gain.setValueAtTime(0.04, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.025)
    } catch (e) {
      // Audio playback failed silently
    }
  }

  /**
   * Component Snap Pop / Alignment Click
   * Soft sine pop gliding up (pitch envelope)
   */
  public playSnapPop(frequency: number = 520): void {
    if (this.isMuted) return
    const ctx = this.initContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(frequency, now)
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, now + 0.06)

      gain.gain.setValueAtTime(0.06, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.07)
    } catch (e) {}
  }

  /**
   * Marquee Drag Swish
   * Very gentle white-noise swoosh
   */
  public playMarqueeSwish(): void {
    if (this.isMuted) return
    const ctx = this.initContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const bufferSize = ctx.sampleRate * 0.05
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }

      const noise = ctx.createBufferSource()
      noise.buffer = buffer

      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(800, now)
      filter.frequency.exponentialRampToValueAtTime(2400, now + 0.05)

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.02, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05)

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      noise.start(now)
      noise.stop(now + 0.05)
    } catch (e) {}
  }

  /**
   * Pentatonic Build Complete Chime
   * Plays a 5-note modern synth chord arpeggio
   */
  public playBuildCompleteChime(): void {
    if (this.isMuted) return
    const ctx = this.initContext()
    if (!ctx) return

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51] // C5, E5, G5, C6, E6
      const baseTime = ctx.currentTime

      notes.forEach((freq, idx) => {
        const noteTime = baseTime + idx * 0.06
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, noteTime)

        gain.gain.setValueAtTime(0.07, noteTime)
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.35)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(noteTime)
        osc.stop(noteTime + 0.35)
      })
    } catch (e) {}
  }
}

export const swarmAudio = new SwarmAudioSynthesizer()
