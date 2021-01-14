import { h } from "preact";
import { useCallback } from "preact/hooks";
import { styles } from "./styles";

export const Bar = ({ dataset }: { dataset: Yoga.Categorical }) => {
  let yMin = Number.MAX_VALUE;
  let yMax = Number.MIN_VALUE;
  dataset.coords.forEach(([x, y]) => {
    if (y < yMin) yMin = y;
    if (y > yMax) yMax = y;
  });
  const yScale = useCallback(
    (y: number): number => (y - yMax) / (yMin - yMax),
    [yMin, yMax]
  );
  return (
    <div className={styles} style={{ "--count": dataset.coords.length }}>
      {dataset.coords.map(([x, y]) => (
        <div
          className="bar"
          style={{
            backgroundColor: dataset.color,
            height: `${100 - 100 * yScale(y)}%`,
          }}
        />
      ))}
    </div>
  );
};
