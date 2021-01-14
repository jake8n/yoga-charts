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
  datasets.forEach(({ coords }) => {
    coords.forEach(([x, y]) => {
      if (x < xMin) xMin = x;
      if (x > xMax) xMax = x;
      if (y < yMin) yMin = y;
      if (y > yMax) yMax = y;
    });
  });
  const forcedOptions: Yoga.Options = {
    xMin,
    xMax,
    yMin,
    yMax,
    ...options,
  };
  return forcedOptions;
};

export const getMouseCoord = (event: MouseEvent): Yoga.Coord => {
  const { clientX, clientY } = event;
  const {
    top,
    right,
    bottom,
    left,
  } = (event.target as HTMLElement).getBoundingClientRect();
  return [(clientX - left) / (right - left), (clientY - top) / (bottom - top)];
};
