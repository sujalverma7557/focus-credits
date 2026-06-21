import { useEffect, useState } from "react";
import { getRemainingSeconds } from "../shared/time";
import { useFocusStore } from "../store/focusStore";
import { useCreditsStore } from "../store/creditsStore";

export default function Popup() {
  const {
    session,
    startSession,
    endSession,
    loadSession,
  } = useFocusStore();

  const {
    availableMinutes,
    loadCredits,
  } = useCreditsStore();

  const [remaining, setRemaining] =
  useState(0);

  useEffect(() => {
    loadSession();
    loadCredits();
  }, []);

  useEffect(() => {
    setRemaining(
      getRemainingSeconds(session)
    );
  }, [session]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(
        getRemainingSeconds(session)
      );
    }, 1000);
  
    return () => clearInterval(interval);
  }, [session]);


  const minutes = Math.floor(
    remaining / 60
  );
  
  const seconds = remaining % 60;
  
  const formattedTime =
    `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;

  return (
    <div className="w-[360px] p-6 space-y-4">
      <h1 className="text-2xl font-bold">
        Focus Credits
      </h1>

      <p className="mt-2 text-gray-500">
        Earn your scroll.
      </p>

      <div className="rounded-lg border p-4">
        <p className="text-sm text-gray-500">
          Available Credits
        </p>

        <h2 className="text-3xl font-bold">
          {availableMinutes} min
        </h2>
      </div>

      <div className="mt-6 rounded-lg border p-4">
        <p className="text-sm text-gray-500">
          Session Status
        </p>

        <div>
          <h2 className="text-xl font-semibold">
            {session.isRunning
              ? "Running"
              : "Idle"}
          </h2>

          {session.isRunning && (
            <p className="mt-2 text-3xl font-bold">
              {formattedTime}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={() => startSession(60)}
        className="mt-4 w-full rounded-lg bg-black px-4 py-3 text-white"
      >
        Start 60 Min Session
      </button>

      <button
        onClick={endSession}
        className="mt-2 w-full rounded-lg border px-4 py-3"
      >
        End Session
      </button>

    </div>
  );
}