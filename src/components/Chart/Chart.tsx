import { h, Fragment } from "preact";
import { useMemo, useState, useCallback } from "preact/hooks";
import { quadtree } from "d3-quadtree";
import { userOptionsToOptions } from "./helpers.ts";
import { styles } from "./styles.ts";
import { ChartContext } from "../ChartContext.ts";
import { Line } from "../Line/Line.tsx";
import { Scatter } from "../Scatter/Scatter.tsx";

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
  const coordinates: [number, number][] = useMemo(
    () => datasets.map(({ xs, ys }) => xs.map((x, i) => [x, ys[i]])).flat(1),
    [datasets]
  );
  const tree = useMemo(() => quadtree().addAll(coordinates), [coordinates]);

  const [isPointerVisible, setIsPointerVisible] = useState(false);
  const handleMouseEnter = () => setIsPointerVisible(true);
  const handleMouseLeave = () => setIsPointerVisible(false);

  const [pointer, setPointer] = useState({ x: "0%", y: "0%" });
  const [near, setNear] = useState({ x: -1, y: -1 });
  let lastUpdateCall = -1;
  const handleMouseMove = (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    if (lastUpdateCall > -1) cancelAnimationFrame(lastUpdateCall);
    lastUpdateCall = requestAnimationFrame(() => {
      // TODO layerX and layerY are not standard
      // @ts-ignore
      const { layerX, layerY } = event;
      const { clientHeight, clientWidth } = event.target as HTMLElement;
      const x = xInverseScale(layerX / clientWidth);
      const y = yInverseScale(layerY / clientHeight);
      const [nearX, nearY] = tree.find(x, y);
      setNear({
        x: nearX,
        y: nearY,
      });
      setPointer({
        x: `${(100 * (nearX - xMin)) / (xMax - xMin)}%`,
        y: `${(100 * (nearY - yMin)) / (yMax - yMin)}%`,
      });
    });
    lastUpdateCall = -1;
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
            <span>{Math.floor(near.y)}</span>
          </div>
        ) : null}
        <svg
          viewBox="0 0 1 1"
          preserveAspectRatio="none"
          onMouseEnter={() => handleMouseEnter()}
          onMouseLeave={() => handleMouseLeave()}
          onMouseMove={(event) => handleMouseMove(event)}
        >
          <clipPath id="clip">
            <rect x="0" y="0" width="1" height="1" />
          </clipPath>
          {datasets.map(({ color, drawLine, drawScatter, xs, ys }) => (
            <Fragment>
              {drawLine ? <Line color={color} xs={xs} ys={ys} /> : null}
              {drawScatter ? <Scatter color={color} xs={xs} ys={ys} /> : null}
            </Fragment>
          ))}
        </svg>
      </div>
    </ChartContext.Provider>
  );
}
