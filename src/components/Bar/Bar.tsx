import { h } from "preact";
import { useCallback } from "preact/hooks";
import { css } from "@emotion/css";

export const Bar = ({ datasets }: { datasets: Yoga.Categorical[] }) => {
  const styles = css`
    height: 100%;
    position: relative;
    width: 100%;

    .bar-group {
      align-items: flex-end;
      display: grid;
      grid-gap: 4px;
      grid-template-columns: repeat(var(--count), 1fr);
      height: 100%;
      position: absolute;
      top: 0;
      width: 100%;

      .bar-wrapper {
        height: 100%;
        position: relative;
        width: 100%;

        .bar {
          position: absolute;
          width: 100%;
        }
      }

      &:last-child {
        .bar {
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
        }
      }
    }
  `;

  let yMin = 0;
  let yMax = Number.MIN_VALUE;
  datasets[0].coords.forEach((_, i) => {
    let y = 0;
    datasets.forEach(({ coords }) => {
      y += coords[i][1];
    });
    if (y > yMax) yMax = y;
  });
  const yScale = useCallback(
    (y: number): number => (y - yMax) / (yMin - yMax),
    [yMin, yMax]
  );
  const bottom = (datasetIndex: number, coordIndex: number): string => {
    if (datasetIndex === 0) return `0%`;
    let y = 0;
    for (let i = 0; i < datasetIndex; i++) {
      y += datasets[i].coords[coordIndex][1];
    }
    return `${100 - 100 * yScale(y)}%`;
  };
  return (
    <div className={styles} style={{ "--count": datasets[0].coords.length }}>
      {datasets.map(({ color, coords }, i) => (
        <div className="bar-group">
          {coords.map(([x, y], j) => (
            <div class="bar-wrapper">
              <div
                className="bar"
                style={{
                  backgroundColor: color,
                  height: `${100 - 100 * yScale(y)}%`,
                  bottom: bottom(i, j),
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
