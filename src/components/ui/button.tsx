"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { useLoadingStore } from "@/store/loadingStore";

const buttonVariants = cva(
  "inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "font-bold uppercase text-[21px] md:text-[19px] hover:text-custom-black-hover leading-[1em] disabled:text-custom-black-disabled",
        secondary: "underline-offset-2 underline text-[18px] md:text-[15px]",
        link: "text-primary underline-offset-4 hover:underline",
        huge: "font-[800] tracking-tight uppercase text-[26px] md:text-[29px] hover:text-custom-black-hover leading-[1em] disabled:text-custom-black-disabled",
        shadcn: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "",
        shadcn: "h-10 px-4 py-2",
        sm: "text-xs",
        lg: "text-2xl",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  activateIsRouting?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, activateIsRouting = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const { setIsRouting } = useLoadingStore();

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...(activateIsRouting && { onClick: () => setIsRouting(true) })}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
