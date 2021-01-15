# 🧘‍♀️ Yoga Charts

## React

```tsx
import { Chart } from "yoga-charts";

export const MyChart = () => <Chart datasets={datasets} options={options} />;
```

## Custom element

```html
<body>
  <yoga-chart></yoga-chart>
  <yoga-bar></yoga-bar>
</body>
```

```js
import "yoga-charts/register";

const yogaChart = document.querySelector("yoga-chart");
yogaChart.setAttribute("datasets", JSON.stringify(datasets));
yogaChart.setAttribute("options", JSON.stringify(options));

const yogaBar = document.querySelector("yoga-bar");
yogaBar.setAttribute("datasets", JSON.stringify(bars));
```
