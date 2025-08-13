import type { Draft } from 'immer';
import type { Transition } from './stateMachine';

// Base context type for state machines with common patterns
export interface BaseStateMachineContext extends Record<string, unknown> {
  currentStep?: number;
  totalSteps?: number;
  completedSteps?: Set<string> | string[];
  skippedSteps?: Set<string> | string[];
  errors?: Array<{ message: string; timestamp: string }>;
}

/**
 * Transition builder for cleaner syntax
 * Creates a transition object with event mapping
 *
 * @param event - The event name that triggers this transition
 * @param target - The target state to transition to
 * @param options - Optional guard condition and action
 * @returns A transition object with event mapping
 *
 * @example
 * ```typescript
 * const nextTransition = transition('NEXT', 'loading', {
 *   guard: guards.hasValue('userId'),
 *   action: actions.setStep(2)
 * });
 * ```
 */
export function transition<Context>(
  event: string,
  target: string,
  options?: {
    guard?: (ctx: Context) => boolean;
    action?: (ctx: Context | Draft<Context>) => void;
  }
): Record<string, Transition<Context>> {
  const transitionObject: Transition<Context> = { target };

  if (options?.guard) {
    transitionObject.guard = options.guard;
  }

  if (options?.action) {
    transitionObject.action = options.action;
  }

  return {
    [event]: transitionObject,
  };
}

/**
 * State builder for cleaner state configuration
 * Combines multiple transition objects into a single state configuration
 *
 * @param transitions - Array of transition objects to combine
 * @returns A state configuration object with all transitions
 *
 * @example
 * ```typescript
 * const loadingState = state(
 *   transition('SUCCESS', 'success', { action: actions.setData }),
 *   transition('ERROR', 'error', { action: actions.setError })
 * );
 * ```
 */
export function state<Context>(
  ...transitions: Array<Record<string, Transition<Context>>>
): {
  on: Record<string, Transition<Context>>;
} {
  return {
    on: transitions.reduce<Record<string, Transition<Context>>>(
      (acc, transition) => {
        return { ...acc, ...transition };
      },
      {}
    ),
  };
}

/**
 * State builder with entry and exit actions
 * Creates a state configuration with lifecycle hooks
 *
 * @param config - State configuration with optional entry/exit actions
 * @param transitions - Array of transition objects to combine
 * @returns A complete state configuration
 *
 * @example
 * ```typescript
 * const activeState = stateWithLifecycle({
 *   entry: (ctx) => { ctx.startTime = Date.now(); },
 *   exit: (ctx) => { ctx.endTime = Date.now(); }
 * }, transition('PAUSE', 'paused'));
 * ```
 */
export function stateWithLifecycle<Context>(
  config: {
    entry?: (context: Context | Draft<Context>) => void;
    exit?: (context: Context | Draft<Context>) => void;
  },
  ...transitions: Array<Record<string, Transition<Context>>>
): {
  entry?: (context: Context | Draft<Context>) => void;
  exit?: (context: Context | Draft<Context>) => void;
  on: Record<string, Transition<Context>>;
} {
  return {
    ...config,
    on: transitions.reduce<Record<string, Transition<Context>>>(
      (acc, transition) => {
        return { ...acc, ...transition };
      },
      {}
    ),
  };
}

/**
 * Common guard conditions for state machine transitions
 * Reusable guard functions for common validation scenarios
 */
export const guards = {
  /**
   * Checks if a context property has a truthy value
   * @param key - The property key to check
   * @returns Guard function that validates the property exists and is truthy
   */
  hasValue:
    <T extends Record<string, unknown>>(key: keyof T) =>
    (ctx: T): boolean =>
      Boolean(ctx[key]),

  /**
   * Checks if a context property equals a specific value
   * @param key - The property key to check
   * @param value - The expected value
   * @returns Guard function that validates equality
   */
  equals:
    <T extends Record<string, unknown>, K extends keyof T>(
      key: K,
      value: T[K]
    ) =>
    (ctx: T): boolean =>
      ctx[key] === value,

  /**
   * Checks if a numeric context property is greater than a value
   * @param key - The property key to check
   * @param value - The minimum value (exclusive)
   * @returns Guard function that validates the numeric condition
   */
  greaterThan:
    <T extends Record<string, unknown>>(key: keyof T, value: number) =>
    (ctx: T): boolean =>
      typeof ctx[key] === 'number' && (ctx[key] as number) > value,

  /**
   * Checks if a step is marked as completed
   * @param step - The step identifier to check
   * @returns Guard function that validates step completion
   */
  isComplete:
    (step: string) =>
    (ctx: BaseStateMachineContext): boolean => {
      if (!ctx.completedSteps) return false;
      if (ctx.completedSteps instanceof Set) {
        return ctx.completedSteps.has(step);
      }
      if (Array.isArray(ctx.completedSteps)) {
        return ctx.completedSteps.includes(step);
      }
      return false;
    },

  /**
   * Combines multiple guards with AND logic
   * @param guardFunctions - Array of guard functions to combine
   * @returns Combined guard function that requires all guards to pass
   */
  and:
    <Context>(...guardFunctions: Array<(ctx: Context) => boolean>) =>
    (ctx: Context): boolean =>
      guardFunctions.every((guard) => guard(ctx)),

  /**
   * Combines multiple guards with OR logic
   * @param guardFunctions - Array of guard functions to combine
   * @returns Combined guard function that requires at least one guard to pass
   */
  or:
    <Context>(...guardFunctions: Array<(ctx: Context) => boolean>) =>
    (ctx: Context): boolean =>
      guardFunctions.some((guard) => guard(ctx)),

  /**
   * Negates a guard function
   * @param guardFunction - The guard function to negate
   * @returns Negated guard function
   */
  not:
    <Context>(guardFunction: (ctx: Context) => boolean) =>
    (ctx: Context): boolean =>
      !guardFunction(ctx),
};

/**
 * Common action functions for state machine transitions
 * Reusable action functions for common state modifications
 */
export const actions = {
  /**
   * Sets the current step in a multi-step process
   * @param step - The step number to set
   * @returns Action function that updates the current step
   */
  setStep:
    (step: number) =>
    (ctx: BaseStateMachineContext | Draft<BaseStateMachineContext>): void => {
      ctx.currentStep = step;
    },

  /**
   * Marks a step as completed
   * @param step - The step identifier to mark as complete
   * @returns Action function that adds the step to completed steps
   */
  addCompleted:
    (step: string) =>
    (ctx: BaseStateMachineContext | Draft<BaseStateMachineContext>): void => {
      ctx.completedSteps ??= new Set<string>();

      if (ctx.completedSteps instanceof Set) {
        ctx.completedSteps.add(step);
      } else if (Array.isArray(ctx.completedSteps)) {
        if (!ctx.completedSteps.includes(step)) {
          ctx.completedSteps.push(step);
        }
      }
    },

  /**
   * Marks a step as skipped
   * @param step - The step identifier to mark as skipped
   * @returns Action function that adds the step to skipped steps
   */
  addSkipped:
    (step: string) =>
    (ctx: BaseStateMachineContext | Draft<BaseStateMachineContext>): void => {
      ctx.skippedSteps ??= new Set<string>();

      if (ctx.skippedSteps instanceof Set) {
        ctx.skippedSteps.add(step);
      } else if (Array.isArray(ctx.skippedSteps)) {
        if (!ctx.skippedSteps.includes(step)) {
          ctx.skippedSteps.push(step);
        }
      }
    },

  /**
   * Increments the current step by one
   * @returns Action function that increments the current step
   */
  incrementStep:
    () =>
    (ctx: BaseStateMachineContext | Draft<BaseStateMachineContext>): void => {
      ctx.currentStep = (ctx.currentStep ?? 0) + 1;
    },

  /**
   * Sets a timestamp property in the context
   * @param key - The property key for the timestamp
   * @returns Action function that sets the timestamp to current time
   */
  setTimestamp:
    <T extends Record<string, unknown>>(key: keyof T) =>
    (ctx: T | Draft<T>): void => {
      (ctx as Record<string, unknown>)[key as string] =
        new Date().toISOString();
    },

  /**
   * Adds an error message to the context
   * @param message - The error message to add
   * @returns Action function that appends the error
   */
  addError:
    (message: string) =>
    (ctx: BaseStateMachineContext | Draft<BaseStateMachineContext>): void => {
      ctx.errors ??= [];

      ctx.errors.push({
        message,
        timestamp: new Date().toISOString(),
      });
    },

  /**
   * Clears all error messages from the context
   * @returns Action function that resets the errors array
   */
  clearErrors:
    () =>
    (ctx: BaseStateMachineContext | Draft<BaseStateMachineContext>): void => {
      ctx.errors = [];
    },

  /**
   * Combines multiple actions to execute in sequence
   * @param actionFunctions - Array of action functions to combine
   * @returns Combined action function that executes all actions
   */
  combine:
    <Context>(
      ...actionFunctions: Array<(ctx: Context | Draft<Context>) => void>
    ) =>
    (ctx: Context | Draft<Context>): void => {
      actionFunctions.forEach((action) => {
        action(ctx);
      });
    },
};

/**
 * Utility functions for working with state machines
 */
export const utils = {
  /**
   * Creates a state machine configuration validator
   * @param config - The state machine configuration to validate
   * @returns Validation results with errors if any
   */
  validateConfig: <States extends string>(config: {
    id: string;
    initial: States;
    context: unknown;
    states: Record<States, { on?: Record<string, { target: string }> }>;
  }): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!config.id || typeof config.id !== 'string') {
      errors.push('State machine must have a valid string ID');
    }

    if (!config.initial || typeof config.initial !== 'string') {
      errors.push('State machine must have a valid initial state');
    }

    if (typeof config.states !== 'object') {
      errors.push('State machine must have a states configuration');
    } else if (!(config.initial in config.states)) {
      errors.push(
        `Initial state "${config.initial}" not found in states configuration`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Creates a state machine visualization helper
   * @param config - The state machine configuration
   * @returns Mermaid diagram string for visualization
   */
  toMermaidDiagram: <States extends string>(config: {
    id: string;
    initial: States;
    states: Record<States, { on?: Record<string, { target: string }> }>;
  }): string => {
    const lines = ['stateDiagram-v2'];
    lines.push(`    [*] --> ${config.initial}`);

    Object.keys(config.states).forEach((stateName) => {
      const state = config.states[stateName as States];
      if (state.on) {
        Object.entries(state.on).forEach(([eventName, transition]) => {
          lines.push(`    ${stateName} --> ${transition.target}: ${eventName}`);
        });
      }
    });

    return lines.join('\n');
  },
};

/**
 * Type-safe builder pattern for creating state machine configurations
 */
export class StateMachineBuilder<
  States extends string = never,
  Events extends string = never,
  Context extends Record<string, unknown> = Record<string, unknown>,
> {
  private config: {
    id?: string;
    initial?: States;
    context?: Context;
    states: Record<string, { on?: Record<string, { target: string }> }>;
  } = {
    states: {},
  };

  /**
   * Sets the state machine ID
   */
  withId(id: string): this {
    this.config.id = id;
    return this;
  }

  /**
   * Sets the initial state
   */
  withInitialState<S extends string>(
    initialState: S
  ): StateMachineBuilder<States | S, Events, Context> {
    (this.config.initial as States | S) = initialState;
    return this as unknown as StateMachineBuilder<States | S, Events, Context>;
  }

  /**
   * Sets the initial context
   */
  withContext<C extends Record<string, unknown>>(
    context: C
  ): StateMachineBuilder<States, Events, C> {
    (this.config.context as C) = context;
    return this as unknown as StateMachineBuilder<States, Events, C>;
  }

  /**
   * Builds the final state machine configuration
   */
  build(): {
    id: string;
    initial: States;
    context: Context;
    states: Record<States, { on?: Record<string, { target: string }> }>;
  } {
    if (!this.config.id) {
      throw new Error('State machine ID is required');
    }

    if (!this.config.initial) {
      throw new Error('Initial state is required');
    }

    if (!this.config.context) {
      throw new Error('Initial context is required');
    }

    const validation = utils.validateConfig(
      this.config as {
        id: string;
        initial: States;
        context: Context;
        states: Record<States, { on?: Record<string, { target: string }> }>;
      }
    );

    if (!validation.isValid) {
      throw new Error(
        `Invalid state machine configuration: ${validation.errors.join(', ')}`
      );
    }

    return this.config as {
      id: string;
      initial: States;
      context: Context;
      states: Record<States, { on?: Record<string, { target: string }> }>;
    };
  }
}

/**
 * Creates a new state machine builder instance
 * @returns A new StateMachineBuilder instance
 */
export function createStateMachineBuilder(): StateMachineBuilder {
  return new StateMachineBuilder();
}
