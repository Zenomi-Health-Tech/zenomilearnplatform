import { Suspense } from "react";
import UnlockForm from "./UnlockForm";

/**
 * useSearchParams suspends, so the form sits behind a boundary. Without it the
 * build cannot prerender this page at all.
 */
export default function Unlock() {
  return (
    <Suspense fallback={<main className="min-h-screen zl-brandband" />}>
      <UnlockForm />
    </Suspense>
  );
}
