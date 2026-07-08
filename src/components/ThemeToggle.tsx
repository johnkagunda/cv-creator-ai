import { forwardRef, memo, useCallback } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useThemeMode } from "@/hooks/useThemeMode";

import type { ComponentPropsWithoutRef } from "react";

type ThemeToggleProps = ComponentPropsWithoutRef<typeof Button>;

const ThemeToggle = memo(
  forwardRef<HTMLButtonElement, ThemeToggleProps>(
    ({ className, onClick, ...props }, ref) => {
      const { mode, toggle } = useThemeMode();

      const isDark = mode === "dark";

      const handleClick = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
          toggle();
          onClick?.(event);
        },
        [toggle, onClick],
      );

      return (
        <Button
          ref={ref}
          type="button"
          variant="outline"
          size="icon"
          aria-label={
            isDark
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          className={cn("rounded-md", className)}
          onClick={handleClick}
          {...props}
        >
          {isDark ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      );
    },
  ),
);

ThemeToggle.displayName = "ThemeToggle";

export { ThemeToggle };
