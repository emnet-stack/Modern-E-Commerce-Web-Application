"use client";

import { ErrorState } from "@/components/shared/states";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <ErrorState
      title="We couldn't load this page"
      message="There was a problem reaching the store data. Check your connection and try again."
      onRetry={reset}
    />
  );
}