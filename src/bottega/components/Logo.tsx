export function Awning({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="Logo">
      <rect x="8" y="20" width="32" height="24" rx="3" fill="#FFFDF8" stroke="#1B2A4A" strokeWidth="2.5" />
      <path d="M4 8h40l-4 14H8z" fill="#C2452D" />
      <path d="M14 8l-2 14M24 8v14M34 8l2 14" stroke="#fff" strokeWidth="3" opacity=".6" />
      <path d="M8 22q4 5 8 0t8 0 8 0 8 0" fill="#C2452D" />
      <rect x="20" y="30" width="8" height="14" fill="#1B2A4A" />
    </svg>
  );
}
