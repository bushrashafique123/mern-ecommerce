export function ToastAction({ altText, children, onClick }) {
  return (
    <button
      className="text-blue-500 underline"
      aria-label={altText}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
