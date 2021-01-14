import { createContext } from "preact";

export const ChartContext = createContext<{
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  xScale: Function;
  yScale: Function;
}>({
  xMin: -1,
  xMax: 1,
  yMin: -1,
  yMax: 1,
  xScale: () => 0,
  yScale: () => 0,
});
