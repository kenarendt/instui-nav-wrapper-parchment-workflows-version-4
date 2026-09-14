import "./Button.css";

/**
 * Button — mirrors InstUI Button v2 API (subset).
 * variant: "primary" | "secondary"
 */
export default function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  icon: Icon,
  disabled = false,
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon size={18} strokeWidth={2} aria-hidden="true" />}
      {children}
    </button>
  );
}
