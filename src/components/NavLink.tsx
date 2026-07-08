import {
  NavLink as RouterNavLink,
  type NavLinkProps as RouterNavLinkProps,
} from "react-router-dom";
import { forwardRef } from "react";
import type { ClassValue } from "clsx";
import { cn } from "@/lib/utils";

type NavLinkProps = Omit<RouterNavLinkProps, "className"> & {
  /**
   * Supports both:
   * className="text-gray-500"
   * className={({ isActive }) => "..."}
   */
  className?: RouterNavLinkProps["className"];

  /**
   * Extra classes applied when the link is active.
   */
  activeClassName?: ClassValue;

  /**
   * Extra classes applied while navigation is pending.
   */
  pendingClassName?: ClassValue;
};

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  (
    {
      className,
      activeClassName,
      pendingClassName,
      ...props
    },
    ref,
  ) => {
    return (
      <RouterNavLink
        ref={ref}
        {...props}
        className={(state) =>
          cn(
            typeof className === "function"
              ? className(state)
              : className,
            state.isActive && activeClassName,
            state.isPending && pendingClassName,
          )
        }
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
