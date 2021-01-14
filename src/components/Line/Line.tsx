import { h } from "preact";
import { useMemo, useContext } from "preact/hooks";
import { ChartContext } from "../ChartContext";
import { css } from "@emotion/css";

// TODO clip when using xMin and xMax
export function Line({
  color,
  coords,
}: {
  color: string;
  coords: Yoga.Coord[];
}) {
  const styles = css`
    fill: none;
    stroke-width: 2;
    stroke-linejoin: miter;
    stroke-linecap: butt;
  `;
  const { xScale, yScale } = useContext(ChartContext);
  const line = useMemo(() => {
    console.debug("line");
    return coords
      .map(([x, y], i) =>
        i === 0 ? `M${xScale(x)},${yScale(y)}` : `L${xScale(x)},${yScale(y)}`
      )
      .join(" ");
  }, [coords, xScale, yScale]);
  return <path className={styles} stroke={color} d={line}></path>;
}
