import dayjs from 'dayjs';

// 积分计算规则
const SCORE_RULES = {
  // 学历积分
  education: {
    junior_college: 10.5,  // 大专
    bachelor: 15,          // 本科
    master: 26,            // 硕士
    doctor: 37,            // 博士
  },
  // 社保积分：每年3分
  socialSecurity: 3,
  // 年龄：45岁以下加20分，超过每年少加4分
  age: {
    threshold: 45,
    baseScore: 20,
    penalty: 4,
  },
  // 自有住房：每年1分
  ownHouse: 1,
  // 租房：每年0.5分
  rent: 0.5,
  // 职住：自2018年1月1日起
  // 城六区外自有住所居住：每年+2分
  // 同时在城六区外工作：每年再+1分（总共+3分/年）
  // 最高12分
  jobHousing: {
    housingScore: 2,    // 城六区外居住
    workScore: 1,       // 城六区外工作（额外加分）
    max: 12,
  },
  // 纳税：近3年连续10万+
  tax: {
    threshold: 100000,
    score: 6,
  },
  // 创新创业
  innovation: {
    inventionPatent: 9,      // 发明专利
    utilityPatent: 3,        // 实用新型专利
  },
  // 荣誉表彰
  honor: {
    provincial: 20,          // 省部级以上
    brave: 20,               // 见义勇为
  },
  // 守法记录
  lawBreaking: -30,          // 违法记录每次-30分
};

// 计算年限（从开始日期到指定年份）
const calculateYears = (startDate, targetYear) => {
  if (!startDate) return 0;
  const start = dayjs(startDate);
  const target = dayjs(`${targetYear}-01-01`);
  const years = target.diff(start, 'year', true);
  return Math.max(0, years);
};

// 计算学历积分
export const calculateEducationScore = (education) => {
  return SCORE_RULES.education[education] || 0;
};

// 计算社保积分（指定年份）- 按月计算
export const calculateSocialSecurityScore = (startDate, targetYear) => {
  if (!startDate) return 0;
  const start = dayjs(startDate);
  const target = dayjs(`${targetYear}-01-01`);
  const months = target.diff(start, 'month');
  const years = months / 12;
  return Math.max(0, years * SCORE_RULES.socialSecurity);
};

// 计算年龄积分（指定年份）
// 45岁以下：+20分
// 超过45岁：20 - (年龄-45)*4 分
export const calculateAgeScore = (birthDate, targetYear) => {
  if (!birthDate) return 0;
  const birth = dayjs(birthDate);
  const target = dayjs(`${targetYear}-01-01`);
  const age = target.diff(birth, 'year');

  if (age <= SCORE_RULES.age.threshold) {
    return SCORE_RULES.age.baseScore;
  }
  // 超过45岁，每增加1岁少加4分
  return SCORE_RULES.age.baseScore - (age - SCORE_RULES.age.threshold) * SCORE_RULES.age.penalty;
};

// 计算居住积分（指定年份）- 按月分段累加
// 规则：
// 1. 2020年8月之前：默认算租房（0.5分/年）
// 2. 2020年8月到买房时间：实际租房（0.5分/年）
// 3. 买房之后：自有住房（1分/年）
// 注意：当连续居住年限多于缴纳社会保险年限，以社保年限为准
export const calculateHousingScore = (housingInfo, targetYear, socialSecurityStartDate) => {
  if (!housingInfo) return 0;

  const target = dayjs(`${targetYear}-01-01`);
  const socialStart = socialSecurityStartDate ? dayjs(socialSecurityStartDate) : null;
  const cutoffDate = dayjs('2020-08-01'); // 2020年8月1日分界线

  let totalScore = 0;

  // 1. 计算2020年8月之前的默认租房积分
  if (socialStart && socialStart.isBefore(cutoffDate)) {
    const defaultRentEnd = target.isBefore(cutoffDate) ? target : cutoffDate;
    const months = defaultRentEnd.diff(socialStart, 'month');
    if (months > 0) {
      totalScore += (months / 12) * SCORE_RULES.rent;
    }
  }

  // 2. 计算2020年8月之后的租房积分（如果有）
  if (housingInfo.rentDate) {
    const rentStart = dayjs(housingInfo.rentDate);
    // 租房起始时间必须在2020年8月之后
    if (rentStart.isAfter(cutoffDate) || rentStart.isSame(cutoffDate)) {
      const rentEnd = housingInfo.hasOwnHouse && housingInfo.ownHouseDate
        ? dayjs(housingInfo.ownHouseDate)
        : target;
      const months = rentEnd.diff(rentStart, 'month');
      if (months > 0) {
        totalScore += (months / 12) * SCORE_RULES.rent;
      }
    }
  }

  // 3. 计算自有住房积分（如果有）
  if (housingInfo.hasOwnHouse && housingInfo.ownHouseDate) {
    const ownHouseStart = dayjs(housingInfo.ownHouseDate);
    const months = target.diff(ownHouseStart, 'month');
    if (months > 0) {
      totalScore += (months / 12) * SCORE_RULES.ownHouse;
    }
  }

  // 居住总年限不能超过社保年限
  if (socialSecurityStartDate) {
    const socialSecurityMonths = target.diff(dayjs(socialSecurityStartDate), 'month');
    const socialSecurityScore = (socialSecurityMonths / 12) * SCORE_RULES.ownHouse; // 用自有住房的最大值作为上限
    totalScore = Math.min(totalScore, socialSecurityScore);
  }

  return totalScore;
};

// 计算职住积分（指定年份，有上限）- 按整年计算
// 自2018年1月1日起：
// - 城六区外自有住所居住：每年+2分
// - 同时在城六区外工作：每年再+1分（总共+3分/年）
// - 最高12分
// - 按整年计算，不满1年不计分
export const calculateJobHousingScore = (jobHousingInfo, housingInfo, targetYear) => {
  if (!jobHousingInfo || !housingInfo) {
    return 0;
  }

  // 必须是自有住所且在城六区外
  const hasOutsideHousing = housingInfo.hasOwnHouse && housingInfo.ownHouseDistrict === 'outside';
  if (!hasOutsideHousing || !housingInfo.ownHouseDate) {
    return 0;
  }

  // 从2018年1月1日开始计算
  const start2018 = dayjs('2018-01-01');
  const startDate = dayjs(housingInfo.ownHouseDate);
  const actualStartDate = startDate.isAfter(start2018) ? startDate : start2018;
  const target = dayjs(`${targetYear}-01-01`);

  // 按整年计算
  const years = Math.max(0, Math.floor(target.diff(actualStartDate, 'year', true)));

  let scorePerYear = SCORE_RULES.jobHousing.housingScore; // 城六区外居住：2分/年

  // 如果工作也在城六区外，再加1分/年
  if (jobHousingInfo.jobDistrict === 'outside') {
    scorePerYear += SCORE_RULES.jobHousing.workScore;
  }

  const rawScore = years * scorePerYear;
  return Math.min(rawScore, SCORE_RULES.jobHousing.max);
};

// 计算纳税积分
export const calculateTaxScore = (taxInfo) => {
  if (!taxInfo || !taxInfo.hasHighIncome) {
    return 0;
  }
  return SCORE_RULES.tax.score;
};

// 计算创新创业积分
export const calculateInnovationScore = (innovationInfo) => {
  if (!innovationInfo) return 0;

  let score = 0;
  if (innovationInfo.inventionPatents) {
    score += innovationInfo.inventionPatents * SCORE_RULES.innovation.inventionPatent;
  }
  if (innovationInfo.utilityPatents) {
    score += innovationInfo.utilityPatents * SCORE_RULES.innovation.utilityPatent;
  }
  return score;
};

// 计算荣誉表彰积分
// 各项荣誉不累计，只要有任意一项就加20分
export const calculateHonorScore = (honorInfo) => {
  if (!honorInfo) return 0;

  if (honorInfo.hasProvincialHonor || honorInfo.hasBraveAct) {
    return 20;
  }
  return 0;
};

// 计算守法记录积分
export const calculateLawScore = (lawInfo) => {
  if (!lawInfo || !lawInfo.hasViolation) {
    return 0;
  }
  return SCORE_RULES.lawBreaking * (lawInfo.violationCount || 1);
};

// 计算总分（指定年份）
export const calculateTotalScore = (userData, targetYear = new Date().getFullYear()) => {
  let total = 0;

  // 学历
  total += calculateEducationScore(userData.education);

  // 社保
  const socialSecurityScore = calculateSocialSecurityScore(userData.socialSecurityStartDate, targetYear);
  total += socialSecurityScore;

  // 年龄
  total += calculateAgeScore(userData.birthDate, targetYear);

  // 居住（受社保年限限制，按月分段累加）
  total += calculateHousingScore(userData.housing, targetYear, userData.socialSecurityStartDate);

  // 职住（需要传入housing信息）
  total += calculateJobHousingScore(userData.jobHousing, userData.housing, targetYear);

  // 纳税
  total += calculateTaxScore(userData.tax);

  // 创新创业
  total += calculateInnovationScore(userData.innovation);

  // 荣誉表彰
  total += calculateHonorScore(userData.honor);

  // 守法记录
  total += calculateLawScore(userData.law);

  return Math.round(total * 100) / 100; // 保留2位小数
};

// 预测未来每年的积分（考虑上限）
export const predictFutureScores = (userData, startYear, endYear) => {
  const scores = [];

  for (let year = startYear; year <= endYear; year++) {
    const score = calculateTotalScore(userData, year);
    scores.push({ year, score });
  }

  return scores;
};

// 计算某一项积分的年度增长（是否已达上限）
export const getAnnualGrowth = (userData, targetYear) => {
  const growth = {
    socialSecurity: SCORE_RULES.socialSecurity, // 社保每年固定增长
    housing: 0,
    jobHousing: 0,
    age: 0,
  };

  // 居住积分增长
  if (userData.housing?.hasOwnHouse) {
    growth.housing = SCORE_RULES.ownHouse;
  } else if (userData.housing?.rentDate) {
    growth.housing = SCORE_RULES.rent;
  }

  // 职住积分增长（检查是否达到上限）
  if (userData.jobHousing?.isOutsideSixDistricts) {
    const currentScore = calculateJobHousingScore(userData.jobHousing, targetYear);
    if (currentScore < SCORE_RULES.jobHousing.max) {
      growth.jobHousing = Math.min(
        SCORE_RULES.jobHousing.perYear,
        SCORE_RULES.jobHousing.max - currentScore
      );
    }
  }

  // 年龄减分（如果超过45岁）
  const age = dayjs(`${targetYear}-01-01`).diff(dayjs(userData.birthDate), 'year');
  if (age > SCORE_RULES.age.threshold) {
    growth.age = SCORE_RULES.age.penalty;
  }

  return growth;
};

export { SCORE_RULES };

export default {
  calculateTotalScore,
  predictFutureScores,
  getAnnualGrowth,
  SCORE_RULES,
};
