import { h, Fragment } from "preact";
import { Line } from "../Line/Line";
import { Scatter } from "../Scatter/Scatter";

export const Paint = ({
  datasets,
  xMin,
  xMax,
  yMin,
  yMax,
  xScale,
  yScale,
}: {
  datasets: Yoga.Dataset[];
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  xScale: Function;
  yScale: Function;
}) => {
  console.debug("paint");
  return (
    <Fragment>
      {datasets.map(({ color, drawLine, drawScatter, coords }, i) => (
        <Fragment>
          {drawLine ? (
            <Line
              color={color}
              coords={coords}
              xMin={xMin}
              xMax={xMax}
              yMin={yMin}
              yMax={yMax}
              xScale={xScale}
              yScale={yScale}
              key={`line-${i}`}
            />
          ) : null}
          {drawScatter ? (
            <Scatter
              color={color}
              coords={coords}
              xMin={xMin}
              xMax={xMax}
              yMin={yMin}
              yMax={yMax}
              xScale={xScale}
              yScale={yScale}
              key={`scatter-${i}`}
            />
          ) : null}
        </Fragment>
      ))}
    </Fragment>
  );
};
