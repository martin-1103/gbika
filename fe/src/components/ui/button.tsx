import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105 active:scale-95 border-0",
        gradient:
          "text-white shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105 active:scale-95 border-0 bg-gradient-to-br from-primary to-primary/60",
        secondary:
          "text-white shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105 active:scale-95 border-0 bg-gradient-to-br from-secondary to-secondary/60",
        accent:
          "text-white shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105 active:scale-95 border-0 bg-gradient-to-br from-accent to-accent/60",
        destructive:
          "bg-destructive text-destructive-foreground shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105 active:scale-95 border-0",
        outline:
          "border-2 border-primary bg-transparent text-primary shadow-md hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:-translate-y-0.5",
        ghost:
          "hover:bg-muted hover:text-foreground backdrop-blur-sm",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
      },
      size: {
        default: "h-11 px-6 py-3 text-base rounded-lg has-[>svg]:px-4",
        sm: "h-9 px-4 py-2 text-sm rounded-md gap-1.5 has-[>svg]:px-3",
        lg: "h-12 px-8 py-3 text-lg rounded-lg has-[>svg]:px-6",
        senior: "h-12 px-8 py-3 text-lg rounded-lg has-[>svg]:px-6",
        icon: "size-11 rounded-lg",
        "icon-sm": "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
