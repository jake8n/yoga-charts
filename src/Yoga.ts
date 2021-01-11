const X_MIN = "xMin";
const X_MAX = "xMax";
const Y_MIN = "yMin";
const Y_MAX = "yMax";

declare namespace Yoga {
  export interface Dataset {
    label: string;
    color: string;
    drawLine?: boolean;
    drawScatter?: boolean;
    xs: number[];
    ys: number[];
  }

  export interface Options {
    [X_MIN]: number;
    [X_MAX]: number;
    [Y_MIN]: number;
    [Y_MAX]: number;
  }

  export interface UserOptions {
    [X_MIN]?: number;
    [X_MAX]?: number;
    [Y_MIN]?: number;
    [Y_MAX]?: number;
  }
}
