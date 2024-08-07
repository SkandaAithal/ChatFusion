import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Loader from "./loader";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors disabled:pointer-events-none disabled:opacity-50 outline-none dark:border-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        chatfusion:
          "bg-chat_fusion text-white py-2 px-4 rounded transition-colors duration-200 ease-in-out hover:bg-chat_fusion-hover disabled:bg-chat_fusion-disabled disabled:cursor-not-allowed",
        destructive:
          "bg-[#ED4245] text-destructive-foreground hover:bg-[#ED4245]/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        transparent: "bg-none w-fit",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
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
  loading?: boolean;
  disabled?: boolean;
  loaderTheme?: "light" | "dark";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled = false,
      loaderTheme = "light",
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), {
          "opacity-50 pointer-events-none": disabled || loading,
        })}
        ref={ref}
        {...props}
      >
        {loading ? (
          <div className="flex justify-center items-center gap-1">
            {props.children}
            <Loader theme={loaderTheme} />
          </div>
        ) : (
          props.children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
