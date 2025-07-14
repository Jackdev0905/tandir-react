import React, { useEffect, useRef, useState } from "react";
// import './TeamCarousel.css';

type TeamMember = {
  name: string;
  role: string;
  imagepath?: string;
};

const teamMembers: TeamMember[] = [
  { name: "David Kim", role: "Chef Master", imagepath: "/img/chef.png" },
  { name: "Michael Steward", role: "Creative Director", imagepath: "/img/chef1.png" },
  { name: "Emma Rodriguez", role: "Lead Advisor", imagepath: "/img/chef2.png" },
  { name: "Justin Gimmel", role: "Dessert Specialist", imagepath: "/img/chef3.png" },
  { name: "James Wilson", role: "Main Assistant", imagepath: "/img/chef4.png" },
  { name: "Lisa Anderson", role: "Product Manager", imagepath: "/img/chef5.png" },
];

const OurFamily: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const nameRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const updateCarousel = (newIndex: number) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const index = (newIndex + teamMembers.length) % teamMembers.length;
    setCurrentIndex(index);

    if (nameRef.current && roleRef.current) {
      nameRef.current.style.opacity = "0";
      roleRef.current.style.opacity = "0";

      setTimeout(() => {
        if (nameRef.current && roleRef.current) {
          nameRef.current.textContent = teamMembers[index].name;
          roleRef.current.textContent = teamMembers[index].role;
          nameRef.current.style.opacity = "1";
          roleRef.current.style.opacity = "1";
        }
      }, 300);
    }

    setTimeout(() => setIsAnimating(false), 800);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") updateCarousel(currentIndex - 1);
    if (e.key === "ArrowRight") updateCarousel(currentIndex + 1);
  };

  const handleSwipe = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) updateCarousel(currentIndex + 1);
      else updateCarousel(currentIndex - 1);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("touchstart", (e) => {
      touchStartX.current = e.changedTouches[0].screenX;
    });
    document.addEventListener("touchend", (e) => {
      touchEndX.current = e.changedTouches[0].screenX;
      handleSwipe();
    });
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex]);

  const getCardClass = (i: number): string => {
    const offset = (i - currentIndex + teamMembers.length) % teamMembers.length;
    if (offset === 0) return "card-family center";
    if (offset === 1) return "card-family right-1";
    if (offset === 2) return "card-family right-2";
    if (offset === teamMembers.length - 1) return "card-family left-1";
    if (offset === teamMembers.length - 2) return "card-family left-2";
    return "card-family hidden";
  };

  return (
    <div className="our-family">
      <h1 className="about-title">OUR Family</h1>

      <div className="carousel-container">
        <div
          className="nav-arrow left"
          onClick={() => updateCarousel(currentIndex - 1)}
        >
          ‹
        </div>
        <div className="carousel-track">
          {teamMembers.map((member, i) => (
            <div
              key={i}
              className={`${getCardClass(i)} card-family`}
              onClick={() => updateCarousel(i)}
            >
              <img src={member?.imagepath ? member.imagepath : ""} alt="" />
            </div>
          ))}
        </div>

        <div
          className="nav-arrow right"
          onClick={() => updateCarousel(currentIndex + 1)}
        >
          ›
        </div>
      </div>

      <div className="member-info">
        <div className="member-name" ref={nameRef}>
          {teamMembers[0].name}
        </div>
        <div className="member-role" ref={roleRef}>
          {teamMembers[0].role}
        </div>
      </div>

      <div className="dots">
        {teamMembers.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === currentIndex ? "active" : ""}`}
            onClick={() => updateCarousel(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default OurFamily;
