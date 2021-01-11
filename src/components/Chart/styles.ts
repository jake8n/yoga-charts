import { css } from "@emotion/css";

export const styles = css`
  height: 100%;
  position: relative;
  width: 100%;

  svg {
    display: block;
    height: 100%;
    overflow: visible;
    width: 100%;

    > * {
      vector-effect: non-scaling-stroke;
    }
  }

  .pointer {
    background-color: White;
    border-radius: 50%;
    height: 4px; // TODO is linked with scatter width
    width: 4px;
    pointer-events: none;
    position: absolute;
    transform: translateX(-2px) translateY(2px);

    > span {
      background-color: Black;
      border-radius: 4px;
      color: white;
      font-family: monospace;
      line-height: 1;
      opacity: 0.8;
      padding: 4px 12px;
      position: absolute;
      transform: translateX(calc(-50% + 2px)) translateY(-1.6rem);
    }
  }

  path {
    opacity: 0.8;
    pointer-events: none;
    stroke-linejoin: round;
    stroke-linecap: round;
  }
`;
