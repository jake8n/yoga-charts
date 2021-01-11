# 🧘‍♀️ Yoga Charts

## React

```tsx
import { Chart } from "yoga-charts";

export const MyChart = () => <Chart datasets={datasets} options={options} />;
```

## Custom element

```html
<yoga-chart></yoga-chart>
```

```js
import "yoga-charts/register";

const element = document.querySelector("yoga-chart");
element.setAttribute("datasets", JSON.stringify(datasets));
element.setAttribute("options", JSON.stringify(options));
```
