/**
 * Message sound effects using the Web Audio API.
 * No external files needed — sounds are synthesised on-the-fly.
 * Inspired by WhatsApp's subtle sent / received tones.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    // Resume if suspended (browsers require user gesture first)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

/**
 * Short, bright "pop" for sent messages — like WhatsApp's outgoing sound.
 * Rising tone, very short duration.
 */
export function playSentSound(): void {
    try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;

        // Oscillator: short rising blip
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);

        // Gain envelope: quick attack & decay
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
    } catch {
        // Silently ignore — audio might not be available
    }
}

/**
 * Soft "ding" for received messages — like WhatsApp's incoming tone.
 * Two-tone descending chime, slightly longer.
 */
export function playReceivedSound(): void {
    try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;

        // First tone — higher note
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, now);

        const gain1 = ctx.createGain();
        gain1.gain.setValueAtTime(0, now);
        gain1.gain.linearRampToValueAtTime(0.12, now + 0.01);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.15);

        // Second tone — lower note, slightly delayed
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(660, now + 0.07);

        const gain2 = ctx.createGain();
        gain2.gain.setValueAtTime(0, now + 0.07);
        gain2.gain.linearRampToValueAtTime(0.1, now + 0.08);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.07);
        osc2.stop(now + 0.22);
    } catch {
        // Silently ignore
    }
}
