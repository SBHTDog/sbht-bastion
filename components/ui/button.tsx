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
  const baseStyles = "rounded-lg font-medium transition-all duration-200 cursor-pointer shadow-sm";

  const variants = {
    primary: "blue-gradient text-white hover:opacity-90 hover:shadow-md",
    secondary: "bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
    outline: "border-2 border-blue-400 text-blue-600 bg-white hover:bg-blue-50",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-8 py-4 text-lg"
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
