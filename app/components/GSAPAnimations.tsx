"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Interactive Heart Component with GSAP
export const InteractiveHeart = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!containerRef.current || !heartRef.current) return;

    const container = containerRef.current;
    const heart = heartRef.current;

    // Heartbeat animation
    const heartbeat = gsap.timeline({ repeat: -1 });
    heartbeat
      .to(heart, {
        scale: 1.08,
        duration: 0.15,
        ease: "power2.out",
      })
      .to(heart, {
        scale: 1,
        duration: 0.15,
        ease: "power2.in",
      })
      .to(heart, {
        scale: 1.05,
        duration: 0.1,
        ease: "power2.out",
      })
      .to(heart, {
        scale: 1,
        duration: 0.4,
        ease: "power2.in",
      })
      .to({}, { duration: 0.5 }); // Pause

    // Ring pulse animations
    ringsRef.current.forEach((ring, index) => {
      gsap.to(ring, {
        scale: 2.5,
        opacity: 0,
        duration: 2,
        repeat: -1,
        delay: index * 0.5,
        ease: "power1.out",
      });
    });

    // Mouse follow effect
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const moveX = (e.clientX - centerX) / 20;
      const moveY = (e.clientY - centerY) / 20;

      gsap.to(heart, {
        x: moveX,
        y: moveY,
        rotateX: -moveY / 2,
        rotateY: moveX / 2,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(heart, {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      heartbeat.kill();
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-64 h-64 md:w-80 md:h-80 cursor-pointer"
      style={{ perspective: "1000px" }}
    >
      {/* Pulse rings */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) ringsRef.current[i] = el;
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            className="w-40 h-40 md:w-48 md:h-48 rounded-full border-2"
            style={{ borderColor: "rgba(220, 38, 38, 0.3)" }}
          />
        </div>
      ))}

      {/* Main heart */}
      <div
        ref={heartRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="relative">
          {/* Glow effect */}
          <div
            className="absolute inset-0 blur-2xl opacity-50"
            style={{
              background: "radial-gradient(circle, rgba(220,38,38,0.4) 0%, transparent 70%)",
              transform: "scale(1.5)",
            }}
          />
          {/* Heart SVG */}
          <svg
            className="w-32 h-32 md:w-40 md:h-40 text-red-500 relative z-10 drop-shadow-2xl"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      </div>

      {/* Floating particles */}
      <FloatingParticles />
    </div>
  );
};

// Floating particles around heart
const FloatingParticles = () => {
  const particlesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    particlesRef.current.forEach((particle, index) => {
      if (!particle) return;

      const angle = (index / 8) * Math.PI * 2;
      const radius = 100 + Math.random() * 30;

      gsap.set(particle, {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      });

      gsap.to(particle, {
        x: `+=${Math.random() * 20 - 10}`,
        y: `+=${Math.random() * 20 - 10}`,
        opacity: Math.random() * 0.5 + 0.3,
        duration: 2 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
  }, []);

  return (
    <>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) particlesRef.current[i] = el;
          }}
          className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
          style={{
            backgroundColor: i % 2 === 0 ? "#dc2626" : "#3b82f6",
            opacity: 0.5,
          }}
        />
      ))}
    </>
  );
};

// Scroll-triggered stat counter
export const AnimatedCounter = ({
  end,
  suffix = "",
  prefix = "",
  duration = 2,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) => {
  const counterRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!counterRef.current) return;

    ScrollTrigger.create({
      trigger: counterRef.current,
      start: "top 80%",
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        const obj = { value: 0 };
        gsap.to(obj, {
          value: end,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = `${prefix}${Math.round(obj.value)}${suffix}`;
            }
          },
        });
      },
    });
  }, [end, suffix, prefix, duration]);

  return (
    <span ref={counterRef} className="tabular-nums">
      {prefix}0{suffix}
    </span>
  );
};

// Magnetic button effect
export const MagneticButton = ({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(button, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <button ref={buttonRef} className={className} onClick={onClick}>
      {children}
    </button>
  );
};

// Text reveal animation on scroll
export const TextReveal = ({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const words = textRef.current.querySelectorAll(".word");

    gsap.set(words, { opacity: 0, y: 20 });

    ScrollTrigger.create({
      trigger: textRef.current,
      start: "top 85%",
      onEnter: () => {
        gsap.to(words, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: "power2.out",
        });
      },
    });
  }, []);

  return (
    <div ref={textRef} className={className}>
      {children.split(" ").map((word, i) => (
        <span key={i} className="word inline-block mr-[0.25em]">
          {word}
        </span>
      ))}
    </div>
  );
};

// Parallax section wrapper
export const ParallaxSection = ({
  children,
  speed = 0.5,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.to(sectionRef.current, {
      y: () => -100 * speed,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, [speed]);

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  );
};

// Stagger cards animation
export const useStaggerAnimation = (containerRef: React.RefObject<HTMLElement | null>) => {
  useEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll(".stagger-card");

    gsap.set(cards, { opacity: 0, y: 50 });

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 80%",
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        });
      },
    });
  }, [containerRef]);
};
