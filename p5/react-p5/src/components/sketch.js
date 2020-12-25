import React, { useEffect, useRef } from "react";
import p5 from "p5";

export function Sketch({ className, setup, draw }) {
  /** Refs */
  /** @type {React.MutableRefObject<HTMLDivElement>} */
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const p5Instance = new p5((sketch) => {
      sketch.setup = () => {
        setup(sketch, container);
      };
      sketch.draw = () => {
        draw(sketch);
      };
    }, container);

    return () => p5Instance.remove();
  }, [setup, draw]);

  return <div ref={containerRef} className={className} />;
}
