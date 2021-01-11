export const userOptionsToOptions = (
  datasets: Yoga.Dataset[],
  options: Yoga.UserOptions
): Yoga.Options => {
  if (
    ["xMin", "xMax", "yMin", "yMax"]
      .map((value) => !Object.keys(options).includes(value))
      .filter(Boolean).length === 0
  ) {
    return options as Yoga.Options;
  }
  let xMin = Number.MAX_VALUE,
    yMin = Number.MAX_VALUE;
  let xMax = Number.MIN_VALUE,
    yMax = Number.MIN_VALUE;
  datasets.forEach(({ xs, ys }) => {
    xs.forEach((x, i) => {
      if (x < xMin) xMin = x;
      if (x > xMax) xMax = x;
      if (ys[i] < yMin) yMin = ys[i];
      if (ys[i] > yMax) yMax = ys[i];
    });
  });
  const forcedOptions = {
    xMin,
    xMax,
    yMin,
    yMax,
    ...options,
  };
  return forcedOptions;
};
