import { Input } from "@/components/ui/input"

type FormFieldProps = React.ComponentProps<"input"> & {
  label: string
}

export function FormField({ label, id, ...props }: FormFieldProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-")

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
      </label>
      <Input id={inputId} {...props} />
    </div>
  )
}
