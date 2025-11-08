export default function LoadingSpinner() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="72"
      height="16"
      viewBox="0 0 72 16"
      role="img"
      aria-label="Loading"
    >
      <style>
        {`
          .dot { fill: #000; animation: pulse 1s infinite ease-in-out; }
          .d1 { animation-delay: 0s; }
          .d2 { animation-delay: 0.15s; }
          .d3 { animation-delay: 0.3s; }
          @keyframes pulse {
            0%, 80%, 100% { transform: scale(0.6); opacity: 0.6; }
            40% { transform: scale(1.0); opacity: 1; }
          }
        `}
      </style>

      <g transform="translate(8,8)">
        <circle className="dot d1" cx="0" cy="0" r="6"></circle>
        <circle className="dot d2" cx="28" cy="0" r="6"></circle>
        <circle className="dot d3" cx="56" cy="0" r="6"></circle>
      </g>
    </svg>
  );
}