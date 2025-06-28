export default function LongButton({ text, onClick }) {
  return (
    <button className="long-button" onClick={onClick}>
      {text}
    </button>
  );
}
