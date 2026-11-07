/**
 * Procedural Web Audio Engine for Swarm Animation
 * 
 * 100% synthesized — Zero external audio files to fetch.
 * Fully safe against browser autoplay restrictions.
 */

class SwarmAudioEngine {
  private ctx: AudioContext | null = null
  private isEnabled: boolean = true

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
        if (AudioCtx) {
          this.ctx = new AudioCtx()
        }
      } catch (e) {
        return null
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
  }

  /**
   * Procedural Typewriter Tick (mechanical key click)
   */
  public playTypewriterTick(): void {
    if (!this.isEnabled) return
    const ctx = this.getContext()
    if (!ctx || ctx.state === 'suspended') return

    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()

      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(1400 + Math.random() * 400, now)
      filter.Q.setValueAtTime(4, now)

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(1200 + Math.random() * 200, now)
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.02)

      gain.gain.setValueAtTime(0.035, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.025)
    } catch (e) {}
  }

  /**
   * Component Snap Pop (woodblock / layout snap sound)
   */
  public playSnapPop(frequency: number = 540): void {
    if (!this.isEnabled) return
    const ctx = this.getContext()
    if (!ctx || ctx.state === 'suspended') return

    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(frequency, now)
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.4, now + 0.05)

      gain.gain.setValueAtTime(0.05, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.06)
    } catch (e) {}
  }

  /**
   * Harmonic Major Pentatonic Completion Chime
   */
  public playCompletionChime(): void {
    if (!this.isEnabled) return
    const ctx = this.getContext()
    if (!ctx || ctx.state === 'suspended') return

    try {
      const now = ctx.currentTime
      const chord = [523.25, 659.25, 783.99, 987.77, 1046.50] // C5, E5, G5, B5, C6

      chord.forEach((freq, idx) => {
        const startTime = now + idx * 0.05
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, startTime)

        gain.gain.setValueAtTime(0.045, startTime)
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.65)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(startTime)
        osc.stop(startTime + 0.65)
      })
    } catch (e) {}
  }
}

export const swarmAudio = new SwarmAudioEngine()

