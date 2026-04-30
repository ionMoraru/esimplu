"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { AlertBanner } from "@/components/shared/forms/alert-banner"
import { FormField } from "@/components/shared/forms/form-field"
import { resetPassword, type ResetState } from "./actions"

export function ResetForm({ token }: { token: string }) {
  const action = resetPassword.bind(null, token)
  const [state, dispatch, pending] = useActionState<ResetState, FormData>(
    action,
    null
  )

  return (
    <form action={dispatch} className="flex flex-col gap-3">
      <FormField
        id="password"
        label="Parolă nouă"
        name="password"
        type="password"
        placeholder="Minim 8 caractere"
        required
        minLength={8}
        autoComplete="new-password"
      />
      <FormField
        id="confirm"
        label="Confirmă parola"
        name="confirm"
        type="password"
        placeholder="••••••••"
        required
        autoComplete="new-password"
      />

      {state?.error && (
        <AlertBanner variant="error">{state.error}</AlertBanner>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full h-11 mt-1"
        disabled={pending}
      >
        {pending ? "Se salvează..." : "Salvează parola nouă"}
      </Button>
    </form>
  )
}
