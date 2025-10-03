import { useEffect } from "react";

type CountDownProps = {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  seconds: number;
  setSeconds: React.Dispatch<React.SetStateAction<number>>;
};

const CountDown: React.FC<CountDownProps> = ({
  isActive,
  setIsActive,
  seconds,
  setSeconds,
}) => {
  // Start the countdown when `isActive` is true
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>; // <- correct type

    if (isActive && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }

    return () => clearInterval(timer);
  }, [isActive, seconds]);

  // Convert seconds into MM:SS
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;

  return (
    <span className="countdown inline-block align-middle">
      <p className="text-[13px] text-[#565656] font-bold inline">
        Resend in <span className="gradient-text">{formattedTime}</span>
      </p>
    </span>
  );
};

export default CountDown;
