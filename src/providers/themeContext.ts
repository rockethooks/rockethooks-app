import { createContext } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderState = {
  theme: Theme;
  resolvedTheme: 'dark' | 'light';
  setTheme: (theme: Theme) => void;
};

export const ThemeProviderContext = createContext<
  ThemeProviderState | undefined
>(undefined);
export type { Theme, ThemeProviderState };
