/**
 * Theme definitions for ChatApp.
 * Each theme provides a full set of CSS custom properties that get applied to :root.
 * Colors are intentionally muted/soft to be easy on the eyes.
 */

export interface ThemeColors {
    // Backgrounds
    bgPrimary: string;
    bgSurface: string;
    bgElevated: string;
    bgGlass: string;
    bgGlassStrong: string;

    // Text
    textPrimary: string;
    textSecondary: string;
    textMuted: string;

    // Borders
    borderSubtle: string;
    borderActive: string;

    // Accent colors
    accent: string;
    accentSecondary: string;
    accentGradientFrom: string;
    accentGradientTo: string;

    // Bubbles
    sentBubbleFrom: string;
    sentBubbleTo: string;
    sentBubbleText: string;
    receivedBubble: string;
    receivedBubbleText: string;
    receivedBubbleBorder: string;

    // Active / selected state
    activeGradientFrom: string;
    activeGradientTo: string;
    activeBorder: string;

    // Status
    onlineColor: string;
    onlineGlow: string;
    typingColor: string;

    // Misc
    scrollThumb: string;
    selectionBg: string;
    dangerBg: string;
    dangerBorder: string;
    dangerText: string;

    // Logo / header gradient blobs
    blobColor1: string;
    blobColor2: string;
    blobColor3: string;
}

export interface Theme {
    id: string;
    name: string;
    emoji: string;
    description: string;
    colors: ThemeColors;
}

export const themes: Theme[] = [
    {
        id: 'midnight',
        name: 'Midnight',
        emoji: '🌙',
        description: 'Deep purple vibes',
        colors: {
            bgPrimary: '#0c0c1d',
            bgSurface: '#12122b',
            bgElevated: '#1a1a3e',
            bgGlass: 'rgba(18, 18, 43, 0.75)',
            bgGlassStrong: 'rgba(18, 18, 43, 0.9)',
            textPrimary: '#e8e8f0',
            textSecondary: 'rgba(232, 232, 240, 0.55)',
            textMuted: 'rgba(232, 232, 240, 0.3)',
            borderSubtle: 'rgba(139, 92, 246, 0.12)',
            borderActive: 'rgba(139, 92, 246, 0.35)',
            accent: '#a78bfa',
            accentSecondary: '#67e8f9',
            accentGradientFrom: '#7c3aed',
            accentGradientTo: '#c026d3',
            sentBubbleFrom: '#6d28d9',
            sentBubbleTo: '#a855f7',
            sentBubbleText: '#ffffff',
            receivedBubble: 'rgba(255, 255, 255, 0.06)',
            receivedBubbleText: 'rgba(232, 232, 240, 0.9)',
            receivedBubbleBorder: 'rgba(255, 255, 255, 0.06)',
            activeGradientFrom: 'rgba(124, 58, 237, 0.15)',
            activeGradientTo: 'rgba(192, 38, 211, 0.08)',
            activeBorder: 'rgba(139, 92, 246, 0.2)',
            onlineColor: '#34d399',
            onlineGlow: 'rgba(52, 211, 153, 0.5)',
            typingColor: '#a78bfa',
            scrollThumb: 'rgba(139, 92, 246, 0.2)',
            selectionBg: 'rgba(139, 92, 246, 0.3)',
            dangerBg: 'rgba(239, 68, 68, 0.1)',
            dangerBorder: 'rgba(239, 68, 68, 0.2)',
            dangerText: '#fca5a5',
            blobColor1: 'rgba(124, 58, 237, 0.12)',
            blobColor2: 'rgba(192, 38, 211, 0.08)',
            blobColor3: 'rgba(6, 182, 212, 0.08)',
        },
    },
    {
        id: 'ocean',
        name: 'Ocean',
        emoji: '🌊',
        description: 'Calm deep blues',
        colors: {
            bgPrimary: '#0a1628',
            bgSurface: '#0f1f38',
            bgElevated: '#162a48',
            bgGlass: 'rgba(15, 31, 56, 0.75)',
            bgGlassStrong: 'rgba(15, 31, 56, 0.9)',
            textPrimary: '#e0eaff',
            textSecondary: 'rgba(224, 234, 255, 0.55)',
            textMuted: 'rgba(224, 234, 255, 0.3)',
            borderSubtle: 'rgba(56, 189, 248, 0.1)',
            borderActive: 'rgba(56, 189, 248, 0.3)',
            accent: '#38bdf8',
            accentSecondary: '#818cf8',
            accentGradientFrom: '#0284c7',
            accentGradientTo: '#0ea5e9',
            sentBubbleFrom: '#0369a1',
            sentBubbleTo: '#0ea5e9',
            sentBubbleText: '#ffffff',
            receivedBubble: 'rgba(255, 255, 255, 0.05)',
            receivedBubbleText: 'rgba(224, 234, 255, 0.88)',
            receivedBubbleBorder: 'rgba(255, 255, 255, 0.05)',
            activeGradientFrom: 'rgba(3, 105, 161, 0.15)',
            activeGradientTo: 'rgba(14, 165, 233, 0.08)',
            activeBorder: 'rgba(56, 189, 248, 0.2)',
            onlineColor: '#34d399',
            onlineGlow: 'rgba(52, 211, 153, 0.5)',
            typingColor: '#38bdf8',
            scrollThumb: 'rgba(56, 189, 248, 0.18)',
            selectionBg: 'rgba(56, 189, 248, 0.3)',
            dangerBg: 'rgba(239, 68, 68, 0.1)',
            dangerBorder: 'rgba(239, 68, 68, 0.2)',
            dangerText: '#fca5a5',
            blobColor1: 'rgba(3, 105, 161, 0.1)',
            blobColor2: 'rgba(14, 165, 233, 0.08)',
            blobColor3: 'rgba(99, 102, 241, 0.06)',
        },
    },
    {
        id: 'forest',
        name: 'Forest',
        emoji: '🌿',
        description: 'Natural greens',
        colors: {
            bgPrimary: '#0a1a14',
            bgSurface: '#0f2418',
            bgElevated: '#162e20',
            bgGlass: 'rgba(15, 36, 24, 0.75)',
            bgGlassStrong: 'rgba(15, 36, 24, 0.9)',
            textPrimary: '#dcf5e7',
            textSecondary: 'rgba(220, 245, 231, 0.55)',
            textMuted: 'rgba(220, 245, 231, 0.3)',
            borderSubtle: 'rgba(52, 211, 153, 0.1)',
            borderActive: 'rgba(52, 211, 153, 0.3)',
            accent: '#34d399',
            accentSecondary: '#a3e635',
            accentGradientFrom: '#059669',
            accentGradientTo: '#10b981',
            sentBubbleFrom: '#047857',
            sentBubbleTo: '#10b981',
            sentBubbleText: '#ffffff',
            receivedBubble: 'rgba(255, 255, 255, 0.05)',
            receivedBubbleText: 'rgba(220, 245, 231, 0.88)',
            receivedBubbleBorder: 'rgba(255, 255, 255, 0.05)',
            activeGradientFrom: 'rgba(5, 150, 105, 0.15)',
            activeGradientTo: 'rgba(16, 185, 129, 0.08)',
            activeBorder: 'rgba(52, 211, 153, 0.2)',
            onlineColor: '#a3e635',
            onlineGlow: 'rgba(163, 230, 53, 0.5)',
            typingColor: '#34d399',
            scrollThumb: 'rgba(52, 211, 153, 0.18)',
            selectionBg: 'rgba(52, 211, 153, 0.3)',
            dangerBg: 'rgba(239, 68, 68, 0.1)',
            dangerBorder: 'rgba(239, 68, 68, 0.2)',
            dangerText: '#fca5a5',
            blobColor1: 'rgba(5, 150, 105, 0.1)',
            blobColor2: 'rgba(16, 185, 129, 0.08)',
            blobColor3: 'rgba(163, 230, 53, 0.05)',
        },
    },
    {
        id: 'sunset',
        name: 'Sunset',
        emoji: '🌅',
        description: 'Warm amber tones',
        colors: {
            bgPrimary: '#1a0f0a',
            bgSurface: '#241710',
            bgElevated: '#2e1f16',
            bgGlass: 'rgba(36, 23, 16, 0.75)',
            bgGlassStrong: 'rgba(36, 23, 16, 0.9)',
            textPrimary: '#fde8d8',
            textSecondary: 'rgba(253, 232, 216, 0.55)',
            textMuted: 'rgba(253, 232, 216, 0.3)',
            borderSubtle: 'rgba(251, 146, 60, 0.12)',
            borderActive: 'rgba(251, 146, 60, 0.3)',
            accent: '#fb923c',
            accentSecondary: '#f472b6',
            accentGradientFrom: '#ea580c',
            accentGradientTo: '#f97316',
            sentBubbleFrom: '#c2410c',
            sentBubbleTo: '#f97316',
            sentBubbleText: '#ffffff',
            receivedBubble: 'rgba(255, 255, 255, 0.05)',
            receivedBubbleText: 'rgba(253, 232, 216, 0.88)',
            receivedBubbleBorder: 'rgba(255, 255, 255, 0.05)',
            activeGradientFrom: 'rgba(194, 65, 12, 0.15)',
            activeGradientTo: 'rgba(249, 115, 22, 0.08)',
            activeBorder: 'rgba(251, 146, 60, 0.2)',
            onlineColor: '#34d399',
            onlineGlow: 'rgba(52, 211, 153, 0.5)',
            typingColor: '#fb923c',
            scrollThumb: 'rgba(251, 146, 60, 0.18)',
            selectionBg: 'rgba(251, 146, 60, 0.3)',
            dangerBg: 'rgba(239, 68, 68, 0.1)',
            dangerBorder: 'rgba(239, 68, 68, 0.2)',
            dangerText: '#fca5a5',
            blobColor1: 'rgba(194, 65, 12, 0.1)',
            blobColor2: 'rgba(249, 115, 22, 0.08)',
            blobColor3: 'rgba(244, 114, 182, 0.06)',
        },
    },
    {
        id: 'rose',
        name: 'Rosé',
        emoji: '🌸',
        description: 'Soft pink warmth',
        colors: {
            bgPrimary: '#1a0d14',
            bgSurface: '#24131c',
            bgElevated: '#2e1926',
            bgGlass: 'rgba(36, 19, 28, 0.75)',
            bgGlassStrong: 'rgba(36, 19, 28, 0.9)',
            textPrimary: '#fce4ec',
            textSecondary: 'rgba(252, 228, 236, 0.55)',
            textMuted: 'rgba(252, 228, 236, 0.3)',
            borderSubtle: 'rgba(244, 114, 182, 0.12)',
            borderActive: 'rgba(244, 114, 182, 0.3)',
            accent: '#f472b6',
            accentSecondary: '#c084fc',
            accentGradientFrom: '#db2777',
            accentGradientTo: '#ec4899',
            sentBubbleFrom: '#be185d',
            sentBubbleTo: '#ec4899',
            sentBubbleText: '#ffffff',
            receivedBubble: 'rgba(255, 255, 255, 0.05)',
            receivedBubbleText: 'rgba(252, 228, 236, 0.88)',
            receivedBubbleBorder: 'rgba(255, 255, 255, 0.05)',
            activeGradientFrom: 'rgba(190, 24, 93, 0.15)',
            activeGradientTo: 'rgba(236, 72, 153, 0.08)',
            activeBorder: 'rgba(244, 114, 182, 0.2)',
            onlineColor: '#34d399',
            onlineGlow: 'rgba(52, 211, 153, 0.5)',
            typingColor: '#f472b6',
            scrollThumb: 'rgba(244, 114, 182, 0.18)',
            selectionBg: 'rgba(244, 114, 182, 0.3)',
            dangerBg: 'rgba(239, 68, 68, 0.1)',
            dangerBorder: 'rgba(239, 68, 68, 0.2)',
            dangerText: '#fca5a5',
            blobColor1: 'rgba(190, 24, 93, 0.1)',
            blobColor2: 'rgba(236, 72, 153, 0.08)',
            blobColor3: 'rgba(192, 132, 252, 0.06)',
        },
    },
    {
        id: 'mono',
        name: 'Mono',
        emoji: '⚫',
        description: 'Clean black & white',
        colors: {
            bgPrimary: '#0a0a0a',
            bgSurface: '#141414',
            bgElevated: '#1e1e1e',
            bgGlass: 'rgba(20, 20, 20, 0.8)',
            bgGlassStrong: 'rgba(20, 20, 20, 0.92)',
            textPrimary: '#e5e5e5',
            textSecondary: 'rgba(229, 229, 229, 0.55)',
            textMuted: 'rgba(229, 229, 229, 0.3)',
            borderSubtle: 'rgba(255, 255, 255, 0.08)',
            borderActive: 'rgba(255, 255, 255, 0.2)',
            accent: '#a3a3a3',
            accentSecondary: '#737373',
            accentGradientFrom: '#525252',
            accentGradientTo: '#737373',
            sentBubbleFrom: '#404040',
            sentBubbleTo: '#525252',
            sentBubbleText: '#ffffff',
            receivedBubble: 'rgba(255, 255, 255, 0.05)',
            receivedBubbleText: 'rgba(229, 229, 229, 0.88)',
            receivedBubbleBorder: 'rgba(255, 255, 255, 0.06)',
            activeGradientFrom: 'rgba(255, 255, 255, 0.08)',
            activeGradientTo: 'rgba(255, 255, 255, 0.04)',
            activeBorder: 'rgba(255, 255, 255, 0.1)',
            onlineColor: '#a3a3a3',
            onlineGlow: 'rgba(163, 163, 163, 0.4)',
            typingColor: '#a3a3a3',
            scrollThumb: 'rgba(255, 255, 255, 0.12)',
            selectionBg: 'rgba(255, 255, 255, 0.2)',
            dangerBg: 'rgba(239, 68, 68, 0.1)',
            dangerBorder: 'rgba(239, 68, 68, 0.2)',
            dangerText: '#fca5a5',
            blobColor1: 'rgba(255, 255, 255, 0.03)',
            blobColor2: 'rgba(255, 255, 255, 0.02)',
            blobColor3: 'rgba(255, 255, 255, 0.02)',
        },
    },
    {
        id: 'cotton',
        name: 'Cotton',
        emoji: '☁️',
        description: 'Soft light mode',
        colors: {
            bgPrimary: '#f0f0f5',
            bgSurface: '#e8e8ef',
            bgElevated: '#ffffff',
            bgGlass: 'rgba(255, 255, 255, 0.8)',
            bgGlassStrong: 'rgba(255, 255, 255, 0.92)',
            textPrimary: '#1a1a2e',
            textSecondary: 'rgba(26, 26, 46, 0.6)',
            textMuted: 'rgba(26, 26, 46, 0.35)',
            borderSubtle: 'rgba(0, 0, 0, 0.08)',
            borderActive: 'rgba(124, 58, 237, 0.3)',
            accent: '#7c3aed',
            accentSecondary: '#06b6d4',
            accentGradientFrom: '#7c3aed',
            accentGradientTo: '#a855f7',
            sentBubbleFrom: '#7c3aed',
            sentBubbleTo: '#a855f7',
            sentBubbleText: '#ffffff',
            receivedBubble: 'rgba(0, 0, 0, 0.04)',
            receivedBubbleText: 'rgba(26, 26, 46, 0.85)',
            receivedBubbleBorder: 'rgba(0, 0, 0, 0.06)',
            activeGradientFrom: 'rgba(124, 58, 237, 0.1)',
            activeGradientTo: 'rgba(168, 85, 247, 0.05)',
            activeBorder: 'rgba(124, 58, 237, 0.15)',
            onlineColor: '#10b981',
            onlineGlow: 'rgba(16, 185, 129, 0.4)',
            typingColor: '#7c3aed',
            scrollThumb: 'rgba(0, 0, 0, 0.1)',
            selectionBg: 'rgba(124, 58, 237, 0.2)',
            dangerBg: 'rgba(239, 68, 68, 0.08)',
            dangerBorder: 'rgba(239, 68, 68, 0.15)',
            dangerText: '#dc2626',
            blobColor1: 'rgba(124, 58, 237, 0.06)',
            blobColor2: 'rgba(168, 85, 247, 0.04)',
            blobColor3: 'rgba(6, 182, 212, 0.04)',
        },
    },
    {
        id: 'amoled',
        name: 'AMOLED',
        emoji: '🖤',
        description: 'Pure black, saves battery',
        colors: {
            bgPrimary: '#000000',
            bgSurface: '#0a0a0a',
            bgElevated: '#141414',
            bgGlass: 'rgba(10, 10, 10, 0.85)',
            bgGlassStrong: 'rgba(10, 10, 10, 0.95)',
            textPrimary: '#e0e0e0',
            textSecondary: 'rgba(224, 224, 224, 0.55)',
            textMuted: 'rgba(224, 224, 224, 0.3)',
            borderSubtle: 'rgba(255, 255, 255, 0.06)',
            borderActive: 'rgba(139, 92, 246, 0.3)',
            accent: '#a78bfa',
            accentSecondary: '#67e8f9',
            accentGradientFrom: '#7c3aed',
            accentGradientTo: '#a855f7',
            sentBubbleFrom: '#6d28d9',
            sentBubbleTo: '#8b5cf6',
            sentBubbleText: '#ffffff',
            receivedBubble: 'rgba(255, 255, 255, 0.04)',
            receivedBubbleText: 'rgba(224, 224, 224, 0.88)',
            receivedBubbleBorder: 'rgba(255, 255, 255, 0.04)',
            activeGradientFrom: 'rgba(109, 40, 217, 0.12)',
            activeGradientTo: 'rgba(139, 92, 246, 0.06)',
            activeBorder: 'rgba(139, 92, 246, 0.15)',
            onlineColor: '#34d399',
            onlineGlow: 'rgba(52, 211, 153, 0.5)',
            typingColor: '#a78bfa',
            scrollThumb: 'rgba(139, 92, 246, 0.15)',
            selectionBg: 'rgba(139, 92, 246, 0.3)',
            dangerBg: 'rgba(239, 68, 68, 0.08)',
            dangerBorder: 'rgba(239, 68, 68, 0.15)',
            dangerText: '#fca5a5',
            blobColor1: 'rgba(109, 40, 217, 0.06)',
            blobColor2: 'rgba(139, 92, 246, 0.04)',
            blobColor3: 'rgba(103, 232, 249, 0.03)',
        },
    },
];

/** Get a theme by ID, fallback to midnight */
export function getTheme(id: string): Theme {
    return themes.find((t) => t.id === id) || themes[0];
}

/** Apply a theme's CSS variables to the document root */
export function applyTheme(theme: Theme): void {
    const root = document.documentElement;
    const c = theme.colors;

    root.style.setProperty('--bg-primary', c.bgPrimary);
    root.style.setProperty('--bg-surface', c.bgSurface);
    root.style.setProperty('--bg-elevated', c.bgElevated);
    root.style.setProperty('--bg-glass', c.bgGlass);
    root.style.setProperty('--bg-glass-strong', c.bgGlassStrong);
    root.style.setProperty('--text-primary', c.textPrimary);
    root.style.setProperty('--text-secondary', c.textSecondary);
    root.style.setProperty('--text-muted', c.textMuted);
    root.style.setProperty('--border-subtle', c.borderSubtle);
    root.style.setProperty('--border-active', c.borderActive);
    root.style.setProperty('--accent', c.accent);
    root.style.setProperty('--accent-secondary', c.accentSecondary);
    root.style.setProperty('--accent-gradient-from', c.accentGradientFrom);
    root.style.setProperty('--accent-gradient-to', c.accentGradientTo);
    root.style.setProperty('--sent-bubble-from', c.sentBubbleFrom);
    root.style.setProperty('--sent-bubble-to', c.sentBubbleTo);
    root.style.setProperty('--sent-bubble-text', c.sentBubbleText);
    root.style.setProperty('--received-bubble', c.receivedBubble);
    root.style.setProperty('--received-bubble-text', c.receivedBubbleText);
    root.style.setProperty('--received-bubble-border', c.receivedBubbleBorder);
    root.style.setProperty('--active-gradient-from', c.activeGradientFrom);
    root.style.setProperty('--active-gradient-to', c.activeGradientTo);
    root.style.setProperty('--active-border', c.activeBorder);
    root.style.setProperty('--online-color', c.onlineColor);
    root.style.setProperty('--online-glow', c.onlineGlow);
    root.style.setProperty('--typing-color', c.typingColor);
    root.style.setProperty('--scroll-thumb', c.scrollThumb);
    root.style.setProperty('--selection-bg', c.selectionBg);
    root.style.setProperty('--danger-bg', c.dangerBg);
    root.style.setProperty('--danger-border', c.dangerBorder);
    root.style.setProperty('--danger-text', c.dangerText);
    root.style.setProperty('--blob-color-1', c.blobColor1);
    root.style.setProperty('--blob-color-2', c.blobColor2);
    root.style.setProperty('--blob-color-3', c.blobColor3);

    // Also set meta theme-color for browser chrome
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) metaThemeColor.setAttribute('content', c.bgPrimary);
}
