import { useEffect, useState } from "react";

const useCountUp = (target, ms = 1200, run = false) => {
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!run) return;
    const t0 = performance.now();

    const tick = (now) => {
      const p = Math.min((now - t0) / ms, 1);
      const e = 1 - Math.pow(1 - p, 3); // Ease-out cubic
      setV(Math.round(target * e));
      if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [target, ms, run]);

  return v;
};

export default useCountUp;
