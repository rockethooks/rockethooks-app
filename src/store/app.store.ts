import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createDevtoolsConfig } from './devtools.config';

interface AppState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  setTheme: (theme: AppState['theme']) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        theme: 'system',
        sidebarOpen: true,
        setTheme: (theme) => {
          set({ theme }, false, 'app/setTheme');
        },
        toggleSidebar: () => {
          set(
            (state) => ({ sidebarOpen: !state.sidebarOpen }),
            false,
            'app/toggleSidebar'
          );
        },
      }),
      {
        name: 'app-storage',
      }
    ),
    createDevtoolsConfig('App')
  )
);
