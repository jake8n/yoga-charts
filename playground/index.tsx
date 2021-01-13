import "preact/debug";
import { h, render } from "preact";
import { Chart } from "../src/components/Chart/Chart";
import { css } from "@emotion/css";

const coords = (): Yoga.Coord[] => {
  const NUM_POINTS = 10;
  const _coords: Yoga.Coord[] = [[0, Math.random() * NUM_POINTS]];
  for (let i = 1; i < NUM_POINTS; i++) {
    _coords.push([
      i,
      Math.round((Math.random() - 0.5) * 10 + _coords[i - 1][1]),
    ]);
  }
  return _coords;
};

const datasets: Yoga.Dataset[] = [
  {
    label: "Expected",
    color: "HotPink",
    drawLine: true,
    drawScatter: true,
    coords: coords(),
  },
  {
    label: "Actual",
    color: "MediumBlue",
    drawLine: true,
    drawScatter: true,
    coords: coords(),
  },
  {
    label: "Target",
    color: "Cyan",
    drawLine: true,
    drawScatter: true,
    coords: coords(),
  },
];
const options: Yoga.UserOptions = {};

const styles = css`
  height: 320px;
  /* max-width: 320px; */
  padding: 1rem;
`;

const App = () => (
  <div className={styles}>
    <Chart datasets={datasets} options={options} />
  </div>
);

render(<App />, document.body);
