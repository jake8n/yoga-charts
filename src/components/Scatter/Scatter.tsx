import { h } from "preact";
import { useMemo, useContext } from "preact/hooks";
import { ChartContext } from "../ChartContext.ts";
import { css } from "@emotion/css";

const styles = css`
  stroke-width: 10;
`;

export function Scatter({
  color,
  xs,
  ys,
}: {
  color: string;
  xs: number[];
  ys: number[];
}) {
  const { xMin, xMax, yMin, yMax, xScale, yScale } = useContext(ChartContext);
  const scatter = useMemo(() => {
    return xs
      .map((x, i) =>
        x >= xMin && x <= xMax && ys[i] >= yMin && ys[i] <= yMax
          ? `M${xScale(x)} ${yScale(ys[i])} A0 0 0 0 1 ${xScale(x) + 0.0001} ${
              yScale(ys[i]) + 0.0001
            }`
          : ""
      )
      .join(" ");
  }, [xs, ys, xMin, xMax, yMin, yMax, xScale, yScale]);
  return <path className={styles} stroke={color} d={scatter}></path>;
}
