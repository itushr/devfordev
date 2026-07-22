import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input">;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "w-full outline-none",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };