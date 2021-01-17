import { h } from "preact";
import { useState, useCallback } from "preact/hooks";
import { getMouseCoord, inverseScaleInRange } from "./helpers";
import throttle from "lodash.throttle";
import { Quadtree } from "d3-quadtree";
import { css } from "@emotion/css";

const styles = css`
  height: 100%;
  position: absolute;
  width: 100%;

  .pointer {
    background-color: White;
    border-radius: 50%;
    height: 4px; // TODO is linked with scatter width
    width: 4px;
    pointer-events: none;
    position: absolute;
    transform: translateX(-2px) translateY(2px);

    > span {
      background-color: Black;
      border-radius: 4px;
      color: white;
      font-family: monospace;
      line-height: 1;
      opacity: 0.8;
      padding: 4px 12px;
      position: absolute;
      transform: translateX(calc(-50% + 2px)) translateY(-1.6rem);
      white-space: nowrap;
    }
  }
`;

export const Pointer = ({
  tree,
  xMin,
  xMax,
  yMin,
  yMax,
  xScale,
  yScale,
  width,
  height,
}: {
  tree: Quadtree<Yoga.Coord>;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  xScale: Function;
  yScale: Function;
  width: number;
  height: number;
}) => {
  console.log("pointer");
  const [isPointerVisible, setIsPointerVisible] = useState(false);
  const [pointer, setPointer] = useState({ x: "0%", y: "0%" });
  const [near, setNear] = useState({ x: -1, y: -1 });
  const handleMouseMove = useCallback(
    throttle((event: MouseEvent) => {
      if (handleMouseMove) handleMouseMove.cancel;
      const [mouseX, mouseY] = getMouseCoord(event);
      // console.time("find");
      const near = tree.find(mouseX, mouseY);
      // console.timeEnd("find");
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
    }, 50),
    [tree, xScale, yScale]
  );

  return (
    <div
      onMouseEnter={() => setIsPointerVisible(true)}
      onMouseLeave={() => setIsPointerVisible(false)}
      onMouseMove={handleMouseMove}
      className={styles}
    >
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
    </div>
  );
};
