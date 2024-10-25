import { useRef, useEffect } from "react";

export default function useHorizontalScroll() {
  const ref = useRef<HTMLDivElement | null>(null);
  const scrollSpeed = 2; // Increase this value to scroll faster

  useEffect(() => {
    const elem = ref.current;
    const onWheel = (ev: WheelEvent) => {
      if (!elem || ev.deltaY === 0) return;

      ev.preventDefault();

      elem.scrollTo({
        left: elem.scrollLeft + ev.deltaY * scrollSpeed,
        behavior: "smooth",
      });
    };

    elem && elem.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      elem && elem.removeEventListener("wheel", onWheel);
    };
  }, []);

  return ref;
}
