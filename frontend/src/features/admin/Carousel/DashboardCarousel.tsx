import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/* =========================
   CAROUSEL DATA
========================= */
interface CarouselPage {
  id: string;
  title: string;
  image: string;
}

const pages: CarouselPage[] = [
  {
    id: "community",
    title: "Community",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "clubs",
    title: "Clubs",
    image:
      "https://images.unsplash.com/photo-1523580494112-071dcb849be5?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "events",
    title: "Events",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "crucial",
    title: "Crucial",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
  },
];

interface DashboardCarouselProps {
  onFocusChange?: (focused: boolean) => void;
}

const DashboardCarousel: React.FC<DashboardCarouselProps> = ({
  onFocusChange,
}) => {
  const navigate = useNavigate();

  const [active, setActive] = useState<string>(pages[0].id);

  const autoRotateTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const userInteracting = useRef<boolean>(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* =========================
     AUTO ROTATE
  ========================= */
  useEffect(() => {
    autoRotateTimer.current = setInterval(() => {
      if (userInteracting.current) return;

      setActive((prev) => {
        const index = pages.findIndex((p) => p.id === prev);
        return pages[(index + 1) % pages.length].id;
      });
    }, 4500);

    return () => {
      if (autoRotateTimer.current) {
        clearInterval(autoRotateTimer.current);
      }
    };
  }, []);

  /* =========================
     PAUSE ON SCROLL
  ========================= */
  useEffect(() => {
    const handleScroll = () => {
      userInteracting.current = true;

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        userInteracting.current = false;
      }, 600);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  /* =========================
     BACKGROUND SYNC
  ========================= */
  useEffect(() => {
    onFocusChange?.(true);
    return () => onFocusChange?.(false);
  }, [active, onFocusChange]);

  /* =========================
     INTERACTION
  ========================= */
  const pause = () => {
    userInteracting.current = true;
  };

  const resume = () => {
    userInteracting.current = false;
  };

  const handleClick = (id: string) => {
    pause();
    navigate(`/metadata/${id}`);
  };

  return (
    <div className="w-full mt-8 overflow-x-auto">
      <div className="flex gap-6 px-6 snap-x snap-mandatory">
        {pages.map((page) => {
          const isActive = active === page.id;

          return (
            <motion.div
              key={page.id}
              layout
              initial={false}
              onHoverStart={pause}
              onHoverEnd={resume}
              onMouseEnter={() => setActive(page.id)}
              onClick={() => handleClick(page.id)}
              transition={{
                type: "spring",
                stiffness: 160,
                damping: 22,
              }}
              className={`
                relative snap-center shrink-0 cursor-pointer
                rounded-2xl overflow-hidden
                h-80
                transition-all duration-500
                ${
                  isActive
                    ? "w-[80vw] md:w-96 flex-[2]"
                    : "w-[40vw] md:w-48 flex-1"
                }
                max-w-[400px]
              `}
              style={{
                backgroundImage: `url(${page.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Overlay */}
              <div
                className={`absolute inset-0 transition-all duration-500 ${
                  isActive ? "bg-black/50" : "bg-black/30"
                }`}
              />

              {/* Title */}
              <motion.div
                layout
                className="absolute bottom-6 left-6 right-6 text-white"
                animate={{
                  opacity: isActive ? 1 : 0.6,
                  y: isActive ? 0 : 10,
                }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold tracking-wide">
                  {page.title}
                </h3>

                {isActive && (
                  <p className="text-sm text-white/70 mt-1">
                    View detailed analytics
                  </p>
                )}
              </motion.div>

              {/* Focus Ring */}
              {isActive && (
                <div className="absolute inset-0 ring-2 ring-cyan-400/40 rounded-2xl pointer-events-none" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardCarousel;