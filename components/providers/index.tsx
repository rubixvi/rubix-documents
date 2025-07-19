import { ViewTransitions } from "@/lib/transition"
import { ThemeProvider } from "@/components/providers/theme"

export const Providers: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ViewTransitions>{children}</ViewTransitions>
    </ThemeProvider>
  )
}
