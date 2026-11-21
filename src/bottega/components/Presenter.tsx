export default function Presenter({ onClose }: { onClose: () => void }) {
  return <div className="fixed bottom-16 right-4 rounded-2xl bg-paper p-4 shadow-xl"><button onClick={onClose}>Close</button></div>;
}
