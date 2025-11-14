// 历年分数线数据
export const scoreLines = {
  2018: 90.75,
  2019: 93.58,
  2020: 97.13,
  2021: 100.88,
  2022: 105.42,
  2023: 109.92,
  2024: 114.46,
  2025: 117.26,
  2026: 119.9,
  2027: 122.4,
  2028: 124.7,
  2029: 126.7,
  2030: 128.4,
  2031: 129.6,
  2032: 130.6,
  2033: 131.1,
  2034: 130.6,
  // 2035年及之后基本稳定在132分左右
};

// 获取指定年份的分数线
export const getScoreLine = (year) => {
  if (year < 2018) return null;

  // 如果年份在已知范围内，直接返回
  if (scoreLines[year]) {
    return scoreLines[year];
  }

  // 如果年份超过已知范围，返回最后一个已知分数
  if (year > 2034) {
    return scoreLines[2034]; // 维持2034年的分数不变
  }

  return null;
};

// 获取年份范围内的分数线数据（用于图表）
export const getScoreLinesInRange = (startYear, endYear) => {
  const result = [];
  for (let year = startYear; year <= endYear; year++) {
    const score = getScoreLine(year);
    if (score !== null) {
      result.push({ year, score });
    }
  }
  return result;
};
