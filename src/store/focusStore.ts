import { create } from "zustand";
import { storage } from "../services/storage";
import type { FocusSession } from "../types/focus";
import { useCreditsStore } from "./creditsStore";

interface FocusStore {
  session: FocusSession;

  startSession: (
    durationMinutes: number
  ) => Promise<void>;

  endSession: () => Promise<void>;

  completeSession: () => Promise<void>;

  loadSession: () => Promise<void>;
}

const defaultSession: FocusSession = {
  isRunning: false,
  startTime: null,
  durationMinutes: null,
  creditsAwarded: false,
};

export const useFocusStore =
  create<FocusStore>((set, get) => ({
    session: defaultSession,

    startSession: async (
      durationMinutes
    ) => {
      const session: FocusSession = {
        isRunning: true,
        startTime: Date.now(),
        durationMinutes,
        creditsAwarded: false,
      };

      await storage.set(
        "focusSession",
        session
      );

      set({ session });
    },

    endSession: async () => {
      await storage.remove(
        "focusSession"
      );

      set({
        session: defaultSession,
      });
    },

    completeSession: async () => {
        const { session } = get();
      
        if (
          !session.isRunning ||
          session.creditsAwarded
        ) {
          return;
        }
      
        const rewardMinutes = Math.floor(
          session.durationMinutes! / 4
        );
      
        useCreditsStore
          .getState()
          .addCredits(rewardMinutes);
      
        await storage.remove(
          "focusSession"
        );
      
        set({
          session: defaultSession,
        });
    },

    loadSession: async () => {
      const session =
        await storage.get<FocusSession>(
          "focusSession"
        );

      if (session) {
        set({ session });
      }
    },
  }));