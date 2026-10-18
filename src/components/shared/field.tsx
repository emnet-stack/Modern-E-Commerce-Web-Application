import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BaseProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
}

function describedBy(id: string, error?: string, hint?: string) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

function Messages({ id, error, hint }: Pick<BaseProps, "id" | "error" | "hint">) {
  return (
    <>
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </>
  );
}

export function Field({
  id,
  label,
  error,
  hint,
  ...props
}: BaseProps & ComponentProps<"input">) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, error, hint)}
        {...props}
      />
      <Messages id={id} error={error} hint={hint} />
    </div>
  );
}

export function TextareaField({
  id,
  label,
  error,
  hint,
  ...props
}: BaseProps & ComponentProps<"textarea">) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, error, hint)}
        {...props}
      />
      <Messages id={id} error={error} hint={hint} />
    </div>
  );
}