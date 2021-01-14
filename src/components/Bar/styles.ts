import { css } from "@emotion/css";

export const styles = css`
  align-items: flex-end;
  display: grid;
  grid-gap: 4px;
  grid-template-columns: repeat(var(--count), 1fr);
  height: 100%;
  width: 100%;

  .bar {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
`;
