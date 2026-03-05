"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        gold: "bg-gold text-background font-bold hover:bg-gold-light active:bg-gold-dark",
        outline:
          "border border-foreground/20 text-foreground hover:border-gold hover:text-gold",
        ghost: "text-foreground/70 hover:text-foreground",
      },
      size: {
        default: "h-12 px-8 text-sm tracking-wider uppercase",
        lg: "h-14 px-10 text-base tracking-wider uppercase",
        sm: "h-10 px-6 text-xs tracking-wider uppercase",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "gold",
      size: "default",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
