export function linearRegression(points) {
  if (!points.length) {
    return { slope: 0, intercept: 0 };
  }

  if (points.length === 1) {
    return { slope: 0, intercept: points[0].y };
  }

  const totals = points.reduce(
    (accumulator, point) => {
      accumulator.sumX += point.x;
      accumulator.sumY += point.y;
      accumulator.sumXY += point.x * point.y;
      accumulator.sumXX += point.x * point.x;
      return accumulator;
    },
    { sumX: 0, sumY: 0, sumXY: 0, sumXX: 0 },
  );

  const count = points.length;
  const denominator = count * totals.sumXX - totals.sumX * totals.sumX;

  if (denominator === 0) {
    return { slope: 0, intercept: totals.sumY / count };
  }

  const slope =
    (count * totals.sumXY - totals.sumX * totals.sumY) / denominator;
  const intercept = (totals.sumY - slope * totals.sumX) / count;

  return { slope, intercept };
}

export function predict(regression, xValue) {
  return regression.slope * xValue + regression.intercept;
}
