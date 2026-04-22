type AlertBannerProps = {
  variant: "error" | "success" | "info"
  children: React.ReactNode
}

const styles = {
  error: "bg-destructive/10 border border-destructive/20 text-destructive",
  success: "bg-green-50 border border-green-200 text-green-700",
  info: "bg-primary/10 border border-primary/20 text-primary",
}

export function AlertBanner({ variant, children }: AlertBannerProps) {
  return (
    <p className={`rounded-lg px-3 py-2 text-sm text-center ${styles[variant]}`}>
      {children}
    </p>
  )
}
