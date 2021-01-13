import { h, Fragment } from "preact";
import { useMemo, useState, useCallback } from "preact/hooks";
import { quadtree } from "d3-quadtree";
import { getMouseCoord, userOptionsToOptions } from "./helpers";
import { styles } from "./styles";
import { ChartContext } from "../ChartContext";
import { Line } from "../Line/Line";
import { Scatter } from "../Scatter/Scatter";

export function Chart({
  datasets,
  options,
}: {
  datasets: Yoga.Dataset[];
  options: Yoga.UserOptions;
}) {
  const { xMin, xMax, yMin, yMax } = useMemo(
    () => userOptionsToOptions(datasets, options),
    [datasets, options]
  );
  const xScale = useCallback(
    (x: number): number => (x - xMin) / (xMax - xMin),
    [xMin, xMax]
  );
  const yScale = useCallback(
    (y: number): number => (y - yMax) / (yMin - yMax),
    [yMin, yMax]
  );
  const xInverseScale = useCallback(
    (x: number): number => xMin + (xMax - xMin) * x,
    [xMin, xMax]
  );
  const yInverseScale = useCallback(
    (y: number): number => yMax + (yMin - yMax) * y,
    [yMin, yMax]
  );
  const coords: Yoga.Coord[] = useMemo(
    () => datasets.map(({ coords }) => coords).flat(),
    [datasets]
  );
  const tree = useMemo(() => quadtree(coords), [coords]);

  const [isPointerVisible, setIsPointerVisible] = useState(false);
  const handleMouseEnter = () => setIsPointerVisible(true);
  const handleMouseLeave = () => setIsPointerVisible(false);

  const [pointer, setPointer] = useState({ x: "0%", y: "0%" });
  const [near, setNear] = useState({ x: -1, y: -1 });
  let lastUpdateCall = -1;
  const handleMouseMove = (event: MouseEvent) => {
    if (lastUpdateCall > -1) cancelAnimationFrame(lastUpdateCall);
    lastUpdateCall = requestAnimationFrame(() => {
      const [mouseX, mouseY] = getMouseCoord(event);
      const x = xInverseScale(mouseX);
      const y = yInverseScale(mouseY);
      const [nearX, nearY] = tree.find(x, y);
      setNear({
        x: nearX,
        y: nearY,
      });
      setPointer({
        x: `${100 * xScale(nearX)}%`,
        y: `${100 - 100 * yScale(nearY)}%`,
      });
      lastUpdateCall = -1;
    });
  };

  return (
    <ChartContext.Provider value={{ xMin, xMax, yMin, yMax, xScale, yScale }}>
      <div className={styles}>
        {isPointerVisible ? (
          <div
            className="pointer"
            style={{
              left: pointer.x,
              bottom: pointer.y,
            }}
          >
            <span>
              {Math.floor(near.x)}, {Math.floor(near.y)}
            </span>
          </div>
        ) : null}
        <svg
          viewBox="0 0 1 1"
          preserveAspectRatio="none"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          <clipPath id="clip">
            <rect x="0" y="0" width="1" height="1" />
          </clipPath>
          {datasets.map(({ color, drawLine, drawScatter, coords }) => (
            <Fragment>
              {drawLine ? <Line color={color} coords={coords} /> : null}
              {drawScatter ? <Scatter color={color} coords={coords} /> : null}
            </Fragment>
          ))}
        </svg>
      </div>
    </ChartContext.Provider>
  );
}
