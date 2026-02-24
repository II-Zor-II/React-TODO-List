import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/ui/cn";

/* --------------------------------------------------------------------------
   Variants
   -------------------------------------------------------------------------- */

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary-light text-primary",
        secondary: "bg-secondary-light text-secondary",
        outline: "border border-border text-text",
        success: "bg-success-light text-success",
        warning: "bg-warning-light text-warning",
        error: "bg-error-light text-error",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/* --------------------------------------------------------------------------
   Types
   -------------------------------------------------------------------------- */

interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

Badge.displayName = "Badge";

export { Badge, badgeVariants };
export type { BadgeProps };
