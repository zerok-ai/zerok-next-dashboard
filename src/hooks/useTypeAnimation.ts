import { useEffect, useState } from "react";

export const useTypeAnimation = (text: string, speed: number) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  useEffect(() => {
    if (currentIndex < text.length) {
      setIsTyping(true);
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, speed);

      return () => {
        clearTimeout(timeout);
      };
    } else {
      setIsTyping(false);
    }
  }, [currentIndex, speed, text]);
  return { currentText, isTyping, setCurrentText, setIsTyping };
};
