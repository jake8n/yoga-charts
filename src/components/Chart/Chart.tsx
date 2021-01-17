import { h } from "preact";
import {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "preact/hooks";
import { quadtree } from "d3-quadtree";
import { scaleInRange, userOptionsToOptions } from "./helpers";
import { Pointer } from "./Pointer";
import { Paint } from "./Paint";
import { css } from "@emotion/css";

export const styles = css`
  height: 100%;
  position: relative;
  width: 100%;

  svg {
    display: block;
    height: 100%;
    overflow: visible;
    width: 100%;

    > * {
      vector-effect: non-scaling-stroke;
    }
  }

  path {
    opacity: 0.7;
  }
`;

export function Chart({
  datasets,
  options,
}: {
  datasets: Yoga.Dataset[];
  options: Yoga.UserOptions;
}) {
  console.debug("chart");
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
  const [resizeObserver] = useState(
    // @ts-ignore ResizeObserver not defined
    new ResizeObserver(() => {
      const { clientWidth, clientHeight } = ref.current;
      if (width !== clientWidth) setWidth(clientWidth);
      if (height !== clientHeight) setHeight(clientHeight);
    })
  );
  useEffect(() => {
    resizeObserver.observe(ref.current);
    return () => resizeObserver.unobserve(ref.current);
  }, [ref]);
  // use coordinate space of painted chart in order to calculate pointer proximity in px
  // otherwise distance is skewed to axis with largest range
  // hard to explain :( see weird tooltip behaviour on previous commits
  const coords: Yoga.Coord[] = useMemo(() => {
    console.time("coords");
    const _coords = datasets
      .map(({ coords }) =>
        coords.map(
          ([x, y]) =>
            [
              scaleInRange(x, [xMin, xMax], [0, width]),
              scaleInRange(y, [yMin, yMax], [height, 0]),
            ] as Yoga.Coord
        )
      )
      .flat();
    console.timeEnd("coords");
    return _coords;
  }, [datasets, width, height]);
  const tree = useMemo(() => {
    console.time("quadtree");
    const _tree = quadtree(coords);
    console.timeEnd("quadtree");
    return _tree;
  }, [coords]);

  return (
    <div className={styles}>
      <Pointer
        tree={tree}
        xMin={xMin}
        xMax={xMax}
        yMin={yMin}
        yMax={yMax}
        xScale={xScale}
        yScale={yScale}
        width={width}
        height={height}
      />
      <svg ref={ref} viewBox="0 0 1 1" preserveAspectRatio="none">
        <clipPath id="clip">
          <rect x="0" y="0" width="1" height="1" />
        </clipPath>
        <Paint
          datasets={datasets}
          xMin={xMin}
          xMax={xMax}
          yMin={yMin}
          yMax={yMax}
          xScale={xScale}
          yScale={yScale}
        />
      </svg>
    </div>
  );
}
