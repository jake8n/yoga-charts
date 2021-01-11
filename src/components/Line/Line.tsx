import { h } from "preact";
import { useMemo, useContext } from "preact/hooks";
import { ChartContext } from "../ChartContext.ts";
import { css } from "@emotion/css";

const styles = css`
  fill: none;
  stroke-width: 2;
`;

// TODO clip when using xMin and xMax
export function Line({
  color,
  xs,
  ys,
}: {
  color: string;
  xs: number[];
  ys: number[];
}) {
  const { xScale, yScale } = useContext(ChartContext);
  const line = useMemo(() => {
    return xs
      .map((x, i) =>
        i === 0
          ? `M${xScale(x)},${yScale(ys[i])}`
          : `L${xScale(x)},${yScale(ys[i])}`
      )
      .join(" ");
  }, [xs, ys, xScale, yScale]);
  return <path className={styles} stroke={color} d={line}></path>;
}
