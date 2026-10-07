"use client";
import { useActionState } from "react";
import { login } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-medium">Password
        <input name="password" type="password" required autoComplete="current-password" autoFocus
          className="rounded-xl border border-line bg-cream/40 px-4 py-3 text-base font-normal outline-none focus:border-ink" />
      </label>
      {state?.error && <p role="alert" className="text-sm text-[#8A2E2E]">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn btn-ink disabled:opacity-60">{pending ? "Checking…" : "Sign in"}</button>
    </form>
  );
}
