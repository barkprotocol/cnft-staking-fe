import React, { useEffect, useState, useCallback, useMemo } from "react";

interface CountdownProps {
  date: number; // Unix timestamp representing the end date/time
  onCountdownEnd?: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ date, onCountdownEnd }) => {
  // Function to calculate the time left
  const calculateTimeLeft = useCallback((): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } => {
    const now = new Date().getTime();
    const difference = date - now;

    if (difference <= 0) {
      if (onCountdownEnd) onCountdownEnd();
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  }, [date, onCountdownEnd]);

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [calculateTimeLeft]);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  return (
    <div>
      {formatTime(timeLeft.days)}d {formatTime(timeLeft.hours)}h {formatTime(timeLeft.minutes)}m {formatTime(timeLeft.seconds)}s
    </div>
  );
};

export default Countdown;
