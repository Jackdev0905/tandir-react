import { Box, Container, Stack } from "@mui/material";
import Divider from "../../components/divider";

import React, { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  target: number;
  duration?: number; // in milliseconds
  isPlus?: boolean;
}

function AnimatedCounter({
  target,
  duration = 1500,
  isPlus = false,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = performance.now();

    function update(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(target * progress);
      setCount(value);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }, [isVisible, target, duration]);

  return (
    <h2 ref={ref} style={{ fontSize: "2rem", fontWeight: "bold" }}>
      {count.toLocaleString()}
      {isPlus ? " +" : ""}
    </h2>
  );
}

export default function Statistics() {
  return (
    <div className="statistics">
      <Container>
        <Stack className="info">
          <Box className="box">
            {AnimatedCounter({ target: 12 })}
            <p>Restaurants</p>
          </Box>
          <Divider height="64" width="2" bg="#e3c08d" />
          <Box className="box">
            {AnimatedCounter({ target: 8 })}
            <p>Experience</p>
          </Box>
          <Divider height="64" width="2" bg="#e3c08d" />

          <Box className="box">
            {AnimatedCounter({ target: 50, isPlus:true })}
            <p>Menu</p>
          </Box>
          <Divider height="64" width="2" bg="#e3c08d" />

          <Box className="box">
            {AnimatedCounter({ target: 200, isPlus:true })}
            <p>Clients</p>
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
