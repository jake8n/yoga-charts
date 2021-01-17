import { h } from "preact";
import { useMemo } from "preact/hooks";
import { css } from "@emotion/css";

export function Scatter({
  color,
  coords,
  xMin,
  xMax,
  yMin,
  yMax,
  xScale,
  yScale,
}: {
  color: string;
  coords: Yoga.Coord[];
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  xScale: Function;
  yScale: Function;
}) {
  console.debug("scatter");
  const styles = css`
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 10;
  `;
  const scatter = useMemo(() => {
    return coords
      .map(([x, y], i) =>
        x >= xMin && x <= xMax && y >= yMin && y <= yMax
          ? `M${xScale(x)} ${yScale(y)} A0 0 0 0 1 ${xScale(x) + 0.0001} ${
              yScale(y) + 0.0001
            }`
          : ""
      )
      .join(" ");
  }, [coords, xMin, xMax, yMin, yMax, xScale, yScale]);
  return <path className={styles} stroke={color} d={scatter}></path>;
}
