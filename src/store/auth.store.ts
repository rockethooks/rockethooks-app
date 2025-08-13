import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/services/auth/AuthService';

// Profile information beyond basic authentication
export interface Profile {
  displayName?: string;
  bio?: string;
  timezone?: string;
  avatar?: string;
  company?: string;
  role?: string;
  phone?: string;
  website?: string;
  location?: string;
  linkedIn?: string;
  twitter?: string;
  github?: string;
  preferences: {
    language:
      | 'en'
      | 'es'
      | 'fr'
      | 'de'
      | 'ja'
      | 'zh'
      | 'pt'
      | 'it'
      | 'ru'
      | 'ko';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      marketing: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'private' | 'organization';
      showEmail: boolean;
      showPhone: boolean;
    };
  };
  lastProfileUpdate?: string;
}

// User preferences for app behavior
export interface Preferences {
  theme: 'light' | 'dark' | 'system';
  sidebar: {
    collapsed: boolean;
    width: number;
  };
  dashboard: {
    layout: 'grid' | 'list';
    itemsPerPage: 10 | 20 | 50 | 100;
    showWelcomeMessage: boolean;
  };
  notifications: {
    sound: boolean;
    desktop: boolean;
    realtime: boolean;
    frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  };
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    fontSize: 'small' | 'medium' | 'large';
    screenReader: boolean;
  };
  developer: {
    showDebugInfo: boolean;
    enableBetaFeatures: boolean;
    apiCallLogging: boolean;
  };
  lastPreferencesUpdate?: string;
}

// Onboarding progress and state
export interface OnboardingState {
  isCompleted: boolean;
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
  skippedSteps: string[];
  startedAt?: string;
  completedAt?: string;
  lastInteractionAt?: string;
  data: {
    // Step 1: Welcome
    hasSeenWelcome?: boolean;
    // Step 2: Profile setup
    hasSetupProfile?: boolean;
    // Step 3: Preferences
    hasSetupPreferences?: boolean;
    // Step 4: First project
    hasCreatedFirstProject?: boolean;
    // Step 5: Integration
    hasConnectedIntegration?: boolean;
    // Step 6: Tutorial completion
    hasCompletedTutorial?: boolean;
  };
  metadata: {
    version: string;
    source: 'signup' | 'invitation' | 'demo';
    referrer?: string;
    utmParams?: Record<string, string>;
  };
}

interface AuthStoreState {
  // Authentication state
  isAuthenticated: boolean;
  user: User | null;
  sessionId: string | null;
  token: string | null;

  // Extended state
  profile: Profile | null;
  preferences: Preferences | null;
  onboarding: OnboardingState | null;

  // Initialization tracking
  isInitialized: boolean;
  isProfileLoaded: boolean;
  isPreferencesLoaded: boolean;
  isOnboardingLoaded: boolean;

  // Authentication actions
  setAuthenticated: (user: User, sessionId: string, token: string) => void;
  setUnauthenticated: () => void;
  updateToken: (token: string) => void;
  clearAuth: () => void;

  // Profile actions
  setProfile: (profile: Profile) => void;
  updateProfile: (updates: Partial<Profile>) => void;
  clearProfile: () => void;

  // Preferences actions
  setPreferences: (preferences: Preferences) => void;
  updatePreferences: (updates: Partial<Preferences>) => void;
  updateTheme: (theme: Preferences['theme']) => void;
  updateNotifications: (
    notifications: Partial<Preferences['notifications']>
  ) => void;
  updateAccessibility: (
    accessibility: Partial<Preferences['accessibility']>
  ) => void;
  clearPreferences: () => void;

  // Onboarding actions
  setOnboarding: (onboarding: OnboardingState) => void;
  updateOnboarding: (updates: Partial<OnboardingState>) => void;
  completeOnboardingStep: (stepName: string) => void;
  skipOnboardingStep: (stepName: string) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  clearOnboarding: () => void;

  // Initialization actions
  setInitialized: (initialized: boolean) => void;
  setProfileLoaded: (loaded: boolean) => void;
  setPreferencesLoaded: (loaded: boolean) => void;
  setOnboardingLoaded: (loaded: boolean) => void;
}

// Default preferences
const getDefaultPreferences = (): Preferences => ({
  theme: 'system',
  sidebar: {
    collapsed: false,
    width: 280,
  },
  dashboard: {
    layout: 'grid',
    itemsPerPage: 20,
    showWelcomeMessage: true,
  },
  notifications: {
    sound: true,
    desktop: true,
    realtime: true,
    frequency: 'immediate',
  },
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    fontSize: 'medium',
    screenReader: false,
  },
  developer: {
    showDebugInfo: false,
    enableBetaFeatures: false,
    apiCallLogging: false,
  },
});

// Default onboarding state
const getDefaultOnboarding = (): OnboardingState => ({
  isCompleted: false,
  currentStep: 0,
  totalSteps: 6,
  completedSteps: [],
  skippedSteps: [],
  data: {},
  metadata: {
    version: '1.0.0',
    source: 'signup',
  },
});

// Performance optimization: Reuse timestamp generation
const getCurrentTimestamp = () => new Date().toISOString();
export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set, get) => ({
      // Initial authentication state
      isAuthenticated: false,
      user: null,
      sessionId: null,
      token: null,

      // Initial extended state
      profile: null,
      preferences: null,
      onboarding: null,

      // Initial initialization state
      isInitialized: false,
      isProfileLoaded: false,
      isPreferencesLoaded: false,
      isOnboardingLoaded: false,

      // Authentication actions
      setAuthenticated: (user, sessionId, token) => {
        set({
          isAuthenticated: true,
          user,
          sessionId,
          token,
        });
      },

      setUnauthenticated: () => {
        set({
          isAuthenticated: false,
          user: null,
          sessionId: null,
          token: null,
        });
      },

      updateToken: (token) => {
        set((state) => ({
          ...state,
          token,
        }));
      },

      clearAuth: () => {
        set({
          isAuthenticated: false,
          user: null,
          sessionId: null,
          token: null,
          profile: null,
          preferences: null,
          onboarding: null,
          isInitialized: false,
          isProfileLoaded: false,
          isPreferencesLoaded: false,
          isOnboardingLoaded: false,
        });
      },

      // Profile actions
      setProfile: (profile) => {
        set({
          profile: {
            ...profile,
            lastProfileUpdate: getCurrentTimestamp(),
          },
          isProfileLoaded: true,
        });
      },

      updateProfile: (updates) => {
        const currentProfile = get().profile;
        set({
          profile: currentProfile
            ? {
                ...currentProfile,
                ...updates,
                lastProfileUpdate: getCurrentTimestamp(),
              }
            : null,
        });
      },

      clearProfile: () => {
        set({
          profile: null,
          isProfileLoaded: false,
        });
      },

      // Preferences actions
      setPreferences: (preferences) => {
        set({
          preferences: {
            ...preferences,
            lastPreferencesUpdate: getCurrentTimestamp(),
          },
          isPreferencesLoaded: true,
        });
      },

      updatePreferences: (updates) => {
        const currentPreferences = get().preferences;
        set({
          preferences: currentPreferences
            ? {
                ...currentPreferences,
                ...updates,
                lastPreferencesUpdate: getCurrentTimestamp(),
              }
            : null,
        });
      },

      updateTheme: (theme) => {
        const currentPreferences = get().preferences;
        if (currentPreferences) {
          set({
            preferences: {
              ...currentPreferences,
              theme,
              lastPreferencesUpdate: getCurrentTimestamp(),
            },
          });
        }
      },

      updateNotifications: (notifications) => {
        const currentPreferences = get().preferences;
        if (currentPreferences) {
          set({
            preferences: {
              ...currentPreferences,
              notifications: {
                ...currentPreferences.notifications,
                ...notifications,
              },
              lastPreferencesUpdate: getCurrentTimestamp(),
            },
          });
        }
      },

      updateAccessibility: (accessibility) => {
        const currentPreferences = get().preferences;
        if (currentPreferences) {
          set({
            preferences: {
              ...currentPreferences,
              accessibility: {
                ...currentPreferences.accessibility,
                ...accessibility,
              },
              lastPreferencesUpdate: getCurrentTimestamp(),
            },
          });
        }
      },

      clearPreferences: () => {
        set({
          preferences: null,
          isPreferencesLoaded: false,
        });
      },

      // Onboarding actions
      setOnboarding: (onboarding) => {
        set({
          onboarding: {
            ...onboarding,
            lastInteractionAt: getCurrentTimestamp(),
          },
          isOnboardingLoaded: true,
        });
      },

      updateOnboarding: (updates) => {
        const currentOnboarding = get().onboarding;
        set({
          onboarding: currentOnboarding
            ? {
                ...currentOnboarding,
                ...updates,
                lastInteractionAt: getCurrentTimestamp(),
              }
            : null,
        });
      },

      completeOnboardingStep: (stepName) => {
        const currentOnboarding = get().onboarding;
        if (currentOnboarding) {
          const newCompletedSteps = [...currentOnboarding.completedSteps];
          if (!newCompletedSteps.includes(stepName)) {
            newCompletedSteps.push(stepName);
          }

          const newSkippedSteps = currentOnboarding.skippedSteps.filter(
            (step) => step !== stepName
          );

          const newCurrentStep = Math.min(
            currentOnboarding.currentStep + 1,
            currentOnboarding.totalSteps
          );

          set({
            onboarding: {
              ...currentOnboarding,
              completedSteps: newCompletedSteps,
              skippedSteps: newSkippedSteps,
              currentStep: newCurrentStep,
              data: {
                ...currentOnboarding.data,
                [stepName]: true,
              },
              lastInteractionAt: getCurrentTimestamp(),
            },
          });
        }
      },

      skipOnboardingStep: (stepName) => {
        const currentOnboarding = get().onboarding;
        if (currentOnboarding) {
          const newSkippedSteps = [...currentOnboarding.skippedSteps];
          if (!newSkippedSteps.includes(stepName)) {
            newSkippedSteps.push(stepName);
          }

          const newCompletedSteps = currentOnboarding.completedSteps.filter(
            (step) => step !== stepName
          );

          const newCurrentStep = Math.min(
            currentOnboarding.currentStep + 1,
            currentOnboarding.totalSteps
          );

          set({
            onboarding: {
              ...currentOnboarding,
              completedSteps: newCompletedSteps,
              skippedSteps: newSkippedSteps,
              currentStep: newCurrentStep,
              lastInteractionAt: getCurrentTimestamp(),
            },
          });
        }
      },

      completeOnboarding: () => {
        const currentOnboarding = get().onboarding;
        if (currentOnboarding) {
          set({
            onboarding: {
              ...currentOnboarding,
              isCompleted: true,
              completedAt: getCurrentTimestamp(),
              lastInteractionAt: getCurrentTimestamp(),
            },
          });
        }
      },

      resetOnboarding: () => {
        set({
          onboarding: getDefaultOnboarding(),
        });
      },

      clearOnboarding: () => {
        set({
          onboarding: null,
          isOnboardingLoaded: false,
        });
      },

      // Initialization actions
      setInitialized: (initialized) => {
        set({ isInitialized: initialized });
      },

      setProfileLoaded: (loaded) => {
        set({ isProfileLoaded: loaded });
      },

      setPreferencesLoaded: (loaded) => {
        set({ isPreferencesLoaded: loaded });
      },

      setOnboardingLoaded: (loaded) => {
        set({ isOnboardingLoaded: loaded });
      },
    }),
    {
      name: 'auth-storage',
      // Only persist essential data, excluding sensitive tokens
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        sessionId: state.sessionId,
        profile: state.profile,
        preferences: state.preferences,
        onboarding: state.onboarding,
        isInitialized: state.isInitialized,
        isProfileLoaded: state.isProfileLoaded,
        isPreferencesLoaded: state.isPreferencesLoaded,
        isOnboardingLoaded: state.isOnboardingLoaded,
        // Note: token is not persisted for security reasons
      }),
    }
  )
);

// Memoized selector creators for performance optimization
const createMemoizedSelector = <T, R>(
  selector: (state: T) => R
): ((state: T) => R) => {
  let lastState: T | undefined;
  let lastResult: R;

  return (state: T) => {
    if (state === lastState) {
      return lastResult;
    }
    lastState = state;
    lastResult = selector(state);
    return lastResult;
  };
};

// Selectors for easy state access with memoization
export const authSelectors = {
  // Authentication selectors
  isAuthenticated: (state: AuthStoreState) => state.isAuthenticated,
  user: (state: AuthStoreState) => state.user,
  userId: (state: AuthStoreState) => state.user?.id,
  userEmail: (state: AuthStoreState) => state.user?.email,
  userName: createMemoizedSelector((state: AuthStoreState) => {
    if (state.user?.firstName && state.user.lastName) {
      return `${state.user.firstName} ${state.user.lastName}`;
    }
    return state.user?.firstName ?? state.user?.email ?? 'User';
  }),

  // Profile selectors
  profile: (state: AuthStoreState) => state.profile,
  displayName: createMemoizedSelector((state: AuthStoreState) => {
    // Can't use authSelectors.userName here since it would create circular dependency
    // Inline the logic instead
    let userName = 'User';
    if (state.user?.firstName && state.user.lastName) {
      userName = `${state.user.firstName} ${state.user.lastName}`;
    } else if (state.user?.firstName) {
      userName = state.user.firstName;
    } else if (state.user?.email) {
      userName = state.user.email;
    }
    return state.profile?.displayName ?? userName;
  }),
  profilePreferences: (state: AuthStoreState) => state.profile?.preferences,

  // Preferences selectors
  preferences: (state: AuthStoreState) => state.preferences,
  theme: (state: AuthStoreState) => state.preferences?.theme ?? 'system',
  sidebarCollapsed: (state: AuthStoreState) =>
    state.preferences?.sidebar.collapsed ?? false,
  dashboardLayout: (state: AuthStoreState) =>
    state.preferences?.dashboard.layout ?? 'grid',
  notificationSettings: (state: AuthStoreState) =>
    state.preferences?.notifications,
  accessibilitySettings: (state: AuthStoreState) =>
    state.preferences?.accessibility,

  // Onboarding selectors
  onboarding: (state: AuthStoreState) => state.onboarding,
  isOnboardingCompleted: (state: AuthStoreState) =>
    state.onboarding?.isCompleted ?? false,
  currentOnboardingStep: (state: AuthStoreState) =>
    state.onboarding?.currentStep ?? 0,
  onboardingProgress: createMemoizedSelector((state: AuthStoreState) => {
    const onboarding = state.onboarding;
    if (!onboarding) return 0;
    return (onboarding.completedSteps.length / onboarding.totalSteps) * 100;
  }),
  shouldShowOnboarding: createMemoizedSelector(
    (state: AuthStoreState) =>
      state.isAuthenticated &&
      !(state.onboarding?.isCompleted ?? false) &&
      state.isOnboardingLoaded
  ),

  // Initialization selectors
  isInitialized: (state: AuthStoreState) => state.isInitialized,
  isFullyLoaded: createMemoizedSelector(
    (state: AuthStoreState) =>
      state.isInitialized &&
      state.isProfileLoaded &&
      state.isPreferencesLoaded &&
      state.isOnboardingLoaded
  ),
  loadingStatus: createMemoizedSelector((state: AuthStoreState) => ({
    initialized: state.isInitialized,
    profile: state.isProfileLoaded,
    preferences: state.isPreferencesLoaded,
    onboarding: state.isOnboardingLoaded,
  })),
};

// Helper hooks for common use cases
export const useAuthSelectors = () => ({
  // Get all selectors bound to the store
  isAuthenticated: useAuthStore(authSelectors.isAuthenticated),
  user: useAuthStore(authSelectors.user),
  userId: useAuthStore(authSelectors.userId),
  userEmail: useAuthStore(authSelectors.userEmail),
  userName: useAuthStore(authSelectors.userName),

  profile: useAuthStore(authSelectors.profile),
  displayName: useAuthStore(authSelectors.displayName),

  preferences: useAuthStore(authSelectors.preferences),
  theme: useAuthStore(authSelectors.theme),
  sidebarCollapsed: useAuthStore(authSelectors.sidebarCollapsed),

  onboarding: useAuthStore(authSelectors.onboarding),
  isOnboardingCompleted: useAuthStore(authSelectors.isOnboardingCompleted),
  shouldShowOnboarding: useAuthStore(authSelectors.shouldShowOnboarding),

  isInitialized: useAuthStore(authSelectors.isInitialized),
  isFullyLoaded: useAuthStore(authSelectors.isFullyLoaded),
  loadingStatus: useAuthStore(authSelectors.loadingStatus),
});

// Initialize default preferences and onboarding for new users
export const initializeNewUser = () => {
  const store = useAuthStore.getState();

  if (!store.preferences) {
    store.setPreferences(getDefaultPreferences());
  }

  if (!store.onboarding) {
    store.setOnboarding(getDefaultOnboarding());
  }

  if (!store.isInitialized) {
    store.setInitialized(true);
  }
};
