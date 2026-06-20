const VARIANTS = {
  primary: "bg-ink text-paper hover:bg-coral disabled:bg-ink/30",
  coral: "bg-coral text-white hover:bg-coral-dark disabled:bg-coral/40",
  outline: "border border-ink/20 text-ink hover:border-ink disabled:opacity-40",
  ghost: "text-ink hover:bg-ink/5 disabled:opacity-40",
  danger: "bg-white text-coral border border-coral/30 hover:bg-coral/5 disabled:opacity-40",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  disabled = false,
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
      )}
      {children}
    </button>
  );
};

export default Button;
