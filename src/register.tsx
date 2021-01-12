import { h } from "preact";
import { Chart } from "./components/Chart/Chart";
import register from "preact-custom-element";

// convert string attributes to objects
const YogaChart = ({
  datasets,
  options,
}: {
  datasets?: string;
  options?: string;
}) => {
  const _datasets: Yoga.Dataset[] =
    datasets === undefined ? [] : JSON.parse(datasets);
  const _options: Yoga.UserOptions =
    options === undefined ? {} : JSON.parse(options);
  return <Chart datasets={_datasets} options={_options} />;
};
register(YogaChart, "yoga-chart", ["datasets", "options"]);
