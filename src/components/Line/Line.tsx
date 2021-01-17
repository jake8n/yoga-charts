import { h } from "preact";
import { useMemo } from "preact/hooks";
import { css } from "@emotion/css";

// TODO clip when using xMin and xMax
export function Line({
  color,
  coords,
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
  console.debug("line");
  const styles = css`
    fill: none;
    stroke-width: 2;
    stroke-linejoin: miter;
    stroke-linecap: butt;
  `;
  const line = useMemo(() => {
    return coords
      .map(([x, y], i) =>
        i === 0 ? `M${xScale(x)},${yScale(y)}` : `L${xScale(x)},${yScale(y)}`
      )
      .join(" ");
  }, [coords, xScale, yScale]);
  return <path className={styles} stroke={color} d={line}></path>;
}
