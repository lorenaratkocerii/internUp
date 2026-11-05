export function StatusMessage({ className = '', children }) {
  return (
    <p role="status" className={`text-base ${className}`}>
      {children}
    </p>
  );
}
