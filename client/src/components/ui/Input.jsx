import { forwardRef } from "react";

const Input = forwardRef(
  ({ label, error, icon: Icon, className = "", containerClassName = "", ...props }, ref) => {
    return (
      <div className={containerClassName}>
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-ink/80">{label}</label>
        )}
        <div className="relative">
          {Icon && (
            <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          )}
          <input
            ref={ref}
            className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink ${
              Icon ? "pl-10" : ""
            } ${error ? "border-coral" : "border-ink/15"} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-coral">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
