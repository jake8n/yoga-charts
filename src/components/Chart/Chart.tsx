import { h, Fragment } from "preact";
import {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "preact/hooks";
import { quadtree } from "d3-quadtree";
import {
  getMouseCoord,
  inverseScaleInRange,
  scaleInRange,
  userOptionsToOptions,
} from "./helpers";
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
  const ref = useRef<SVGSVGElement>();
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
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    setWidth(ref.current.clientWidth);
    setHeight(ref.current.clientHeight);
  }, [ref]);
  // use coordinate space of painted chart in order to calculate pointer proximity in px
  // otherwise distance is skewed to axis with largest range
  // hard to explain :( see weird tooltip behaviour on previous commits
  // TODO recalculate on resize
  const coords: Yoga.Coord[] = useMemo(
    () =>
      datasets
        .map(({ coords }) =>
          coords.map(
            ([x, y]) =>
              [
                scaleInRange(x, [xMin, xMax], [0, width]),
                scaleInRange(y, [yMin, yMax], [height, 0]),
              ] as Yoga.Coord
          )
        )
        .flat(),
    [datasets, width, height]
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
      const near = tree.find(mouseX, mouseY);
      if (near) {
        const [nearX, nearY] = near;
        const x = inverseScaleInRange(nearX, [xMin, xMax], [0, width]);
        const y = inverseScaleInRange(nearY, [yMin, yMax], [height, 0]);
        setNear({
          x: x,
          y: y,
        });
        setPointer({
          x: `${100 * xScale(x)}%`,
          y: `${100 - 100 * yScale(y)}%`,
        });
      }
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
          ref={ref}
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
