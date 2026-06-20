export const Spinner = ({ className = "h-8 w-8" }) => (
  <div className={`animate-spin rounded-full border-2 border-ink/15 border-t-coral ${className}`} />
);

export const PageSpinner = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <Spinner />
  </div>
);

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15 bg-white/50 px-6 py-16 text-center">
    {Icon && <Icon className="mb-4 h-10 w-10 text-ink/30" />}
    <h3 className="font-display text-lg font-medium text-ink">{title}</h3>
    {description && <p className="mt-1 max-w-sm text-sm text-ink/50">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);
