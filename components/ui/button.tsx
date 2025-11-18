export default function Button({
  children,
  variant = "primary",
  size = "md",
  onClick
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}) {
  const baseStyles = "rounded-lg font-medium transition-all duration-200 cursor-pointer";

  const variants = {
    primary: "blue-gradient text-white hover:opacity-90",
    secondary: "bg-gray-700 text-white hover:bg-gray-600",
    ghost: "bg-transparent text-gray-300 hover:bg-gray-800",
    outline: "border border-gray-600 text-gray-300 hover:bg-gray-800",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
