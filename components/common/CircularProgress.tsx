export const CircularProgress = ({ progress }: { progress: number }) => {
  const strokeWidth = 2;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 -rotate-90">
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${2 * (radius + strokeWidth)} ${2 * (radius + strokeWidth)}`}
      >
        <circle
          className="text-muted-foreground"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
        />
        <circle
          className="text-chat_fusion"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
        />
      </svg>
    </div>
  );
};
