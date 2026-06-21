import { create } from "zustand";
import { storage } from "../services/storage";

interface CreditsStore {
  availableMinutes: number;

  loadCredits: () => Promise<void>;

  addCredits: (
    minutes: number
  ) => Promise<void>;

  spendCredits: (
    minutes: number
  ) => Promise<void>;
}

export const useCreditsStore =
  create<CreditsStore>((set) => ({
    availableMinutes: 0,

    loadCredits: async () => {
      const credits =
        await storage.get<number>(
          "availableCredits"
        );

      set({
        availableMinutes:
          credits ?? 0,
      });
    },

    addCredits: async (
      minutes
    ) => {
      const current =
        (await storage.get<number>(
          "availableCredits"
        )) ?? 0;

      const updated =
        current + minutes;

      await storage.set(
        "availableCredits",
        updated
      );

      set({
        availableMinutes:
          updated,
      });
    },

    spendCredits: async (
      minutes
    ) => {
      const current =
        (await storage.get<number>(
          "availableCredits"
        )) ?? 0;

      const updated =
        Math.max(
          0,
          current - minutes
        );

      await storage.set(
        "availableCredits",
        updated
      );

      set({
        availableMinutes:
          updated,
      });
    },
  }));