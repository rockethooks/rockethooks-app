import type { Draft } from 'immer';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Base types for any state machine
export type StateNode<Context> = {
  on?: Record<string, Transition<Context>>;
  entry?: (context: Context | Draft<Context>) => void;
  exit?: (context: Context | Draft<Context>) => void;
};

export type Transition<Context> = {
  target: string;
  guard?: (context: Context) => boolean;
  action?: (context: Context | Draft<Context>) => void;
};

// State machine configuration
export type StateMachineConfig<States extends string, Context> = {
  id: string;
  initial: States;
  context: Context;
  states: Record<States, StateNode<Context>>;
};

// Resulting store interface
export type StateMachineStore<
  States extends string,
  Events extends string,
  Context,
> = {
  state: States;
  context: Context;
  send: (event: Events, payload?: unknown) => boolean;
  can: (event: Events) => boolean;
  matches: (state: States) => boolean;
  reset: () => void;
};

/**
 * Creates a type-safe state machine using Zustand with Immer and DevTools integration
 *
 * @param config State machine configuration with states, transitions, and context
 * @returns Zustand store with state machine functionality
 */
export function createStateMachine<
  States extends string,
  Events extends string,
  Context extends Record<string, unknown>,
>(config: StateMachineConfig<States, Context>) {
  return create<StateMachineStore<States, Events, Context>>()(
    devtools(
      immer((set, get) => ({
        state: config.initial,
        context: { ...config.context },

        send: (event, _payload) => {
          const { state, context } = get();
          const currentStateNode = config.states[state];
          const transition = currentStateNode.on
            ? currentStateNode.on[event]
            : undefined;

          if (!transition) return false;

          // Check guard condition
          if (transition.guard && !transition.guard(context)) {
            return false;
          }

          set((draft) => {
            // Execute exit action of current state
            if (currentStateNode.exit) {
              currentStateNode.exit(draft.context);
            }

            // Execute transition action
            if (transition.action) {
              transition.action(draft.context);
            }

            // Update state
            draft.state = transition.target as Draft<States>;

            // Execute entry action of new state
            const targetStateNode = config.states[transition.target as States];
            if (targetStateNode.entry) {
              targetStateNode.entry(draft.context);
            }
          });

          return true;
        },

        can: (event) => {
          const { state, context } = get();
          const currentStateNode = config.states[state];
          const transition = currentStateNode.on
            ? currentStateNode.on[event]
            : undefined;

          if (!transition) return false;
          return !transition.guard || transition.guard(context);
        },

        matches: (state) => get().state === state,

        reset: () => {
          set((draft) => {
            draft.state = config.initial as Draft<States>;
            draft.context = { ...config.context } as Draft<Context>;
          });
        },
      })),
      { name: config.id }
    )
  );
}
