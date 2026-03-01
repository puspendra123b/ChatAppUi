import { create } from 'zustand';
import { getTheme, applyTheme, type Theme } from '@/config/themes';

const STORAGE_KEY = 'vybe_theme';

interface ThemeState {
    themeId: string;
    theme: Theme;
    setTheme: (id: string) => void;
    initTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
    themeId: 'midnight',
    theme: getTheme('midnight'),

    setTheme: (id: string) => {
        const theme = getTheme(id);
        applyTheme(theme);
        localStorage.setItem(STORAGE_KEY, id);
        set({ themeId: id, theme });
    },

    initTheme: () => {
        const savedId = localStorage.getItem(STORAGE_KEY) || 'midnight';
        const theme = getTheme(savedId);
        applyTheme(theme);
        set({ themeId: savedId, theme });
    },
}));
