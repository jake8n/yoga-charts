import { createContext } from "preact";

export const ChartContext = createContext<{
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  xScale: Function;
  yScale: Function;
}>(null);
