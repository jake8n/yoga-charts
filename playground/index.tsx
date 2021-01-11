import { h, render } from "preact";
import { Chart } from "../src/components/Chart/Chart.tsx";
import { css } from "@emotion/css";

const NUM_POINTS = 50;
const xs = new Array(NUM_POINTS).fill(undefined).map((_, i) => i);
function ys() {
  const arr = [Math.random() * 100];
  for (let i = 1; i < NUM_POINTS; i++) {
    arr.push(Math.round((Math.random() - 0.5) * 10 + arr[i - 1]));
  }
  return arr;
}

const datasets: Yoga.Dataset[] = [
  {
    label: "Expected",
    color: "HotPink",
    drawLine: true,
    drawScatter: true,
    xs,
    ys: ys(),
  },
  {
    label: "Actual",
    color: "MediumBlue",
    drawLine: true,
    drawScatter: true,
    xs,
    ys: ys(),
  },
];
const options: Yoga.UserOptions = {};

const styles = css`
  height: 320px;
  /* max-width: 720px; */
  padding: 1rem;
`;

const App = () => (
  <div className={styles}>
    <Chart datasets={datasets} options={options} />
  </div>
);

render(<App />, document.body);
