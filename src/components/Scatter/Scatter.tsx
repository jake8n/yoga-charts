import { h } from "preact";
import { useMemo, useContext } from "preact/hooks";
import { ChartContext } from "../ChartContext";
import { css } from "@emotion/css";

const styles = css`
  stroke-width: 10;
`;

export function Scatter({
  color,
  coords,
}: {
  color: string;
  coords: Yoga.Coord[];
}) {
  const { xMin, xMax, yMin, yMax, xScale, yScale } = useContext(ChartContext);
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
