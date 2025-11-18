export default function Badge({
  children,
  variant = "default"
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "error" | "warning";
}) {
  const variants = {
    default: "bg-gray-700 text-gray-300",
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
    warning: "bg-yellow-600 text-white"
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}
