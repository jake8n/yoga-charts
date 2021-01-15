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
  const { clientWidth, clientHeight } = event.target as HTMLElement;
  return [
    (clientWidth * (clientX - left)) / (right - left),
    (clientHeight * (clientY - top)) / (bottom - top),
  ];
};

export const scaleInRange = (
  a: number,
  domain: [number, number],
  range: [number, number]
): number => {
  const n = (a - domain[0]) / (domain[1] - domain[0]);
  return range[0] + (range[1] - range[0]) * n;
};

export const inverseScaleInRange = (
  a: number,
  domain: [number, number],
  range: [number, number]
): number => {
  const n = (a - range[0]) / (range[1] - range[0]);
  return domain[0] + (domain[1] - domain[0]) * n;
};
