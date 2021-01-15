import "preact/debug";
import { h, render } from "preact";
import { Chart } from "../src/components/Chart/Chart";
import { Bar } from "../src/components/Bar/Bar";
import { css } from "@emotion/css";

const randomColor = () =>
  `hsla(${Math.ceil(Math.random() * 360)}, 80%, 80%, 1)`;

const coords = (): Yoga.Coord[] => {
  const NUM_POINTS = 10;
  const _coords: Yoga.Coord[] = [[0, Math.random() * 100 * NUM_POINTS]];
  for (let i = 1; i < NUM_POINTS; i++) {
    _coords.push([i, Math.round(Math.random() * 100 + _coords[i - 1][1])]);
  }
  return _coords;
};

const datasets: Yoga.Dataset[] = ["Expected", "Actual", "Target"].map(
  (label) => ({
    label,
    color: randomColor(),
    drawLine: true,
    drawScatter: true,
    coords: coords(),
  })
);
const bars: Yoga.Categorical[] = new Array(5).fill(undefined).map((_, i) => ({
  label: `${i}`,
  color: randomColor(),
  coords: coords().map(([x, y]) => [`${x}`, y]),
}));
const options: Yoga.UserOptions = {};

const styles = css`
  height: 320px;
  max-width: 720px;
  padding: 2rem;

  > * + * {
    margin-top: 2rem;
  }
`;

const App = () => (
  <div className={styles}>
    <Bar datasets={bars} />
    <Chart datasets={datasets} options={options} />
  </div>
);

render(<App />, document.body);
