import { calculateTotalScore, SCORE_RULES } from './calculator';
import { getScoreLine } from './scoreLines';
import dayjs from 'dayjs';

// 生成加分建议
export const generateSuggestions = (userData, currentYear, targetScore) => {
  const suggestions = [];
  const currentScore = calculateTotalScore(userData, currentYear);

  // 1. 学历提升建议
  const educationSuggestion = getEducationSuggestion(userData, currentScore, targetScore);
  if (educationSuggestion) {
    suggestions.push(educationSuggestion);
  }

  // 2. 购买自有住房建议
  const housingSuggestion = getHousingSuggestion(userData, currentScore, targetScore);
  if (housingSuggestion) {
    suggestions.push(housingSuggestion);
  }

  // 3. 迁至城六区外建议
  const jobHousingSuggestion = getJobHousingSuggestion(userData, currentScore, targetScore);
  if (jobHousingSuggestion) {
    suggestions.push(jobHousingSuggestion);
  }

  // 4. 申请专利建议
  const patentSuggestion = getPatentSuggestion(userData, currentScore, targetScore);
  if (patentSuggestion) {
    suggestions.push(patentSuggestion);
  }

  // 5. 纳税加分建议
  const taxSuggestion = getTaxSuggestion(userData, currentScore, targetScore);
  if (taxSuggestion) {
    suggestions.push(taxSuggestion);
  }

  // 6. 荣誉表彰建议
  const honorSuggestion = getHonorSuggestion(userData, currentScore, targetScore);
  if (honorSuggestion) {
    suggestions.push(honorSuggestion);
  }

  return suggestions;
};

// 学历提升建议
const getEducationSuggestion = (userData, currentScore, targetScore) => {
  const currentEdu = userData.education;
  const educationLevels = [
    { key: 'junior_college', label: '大专', score: SCORE_RULES.education.junior_college },
    { key: 'bachelor', label: '本科', score: SCORE_RULES.education.bachelor },
    { key: 'master', label: '硕士', score: SCORE_RULES.education.master },
    { key: 'doctor', label: '博士', score: SCORE_RULES.education.doctor },
  ];

  const currentIndex = educationLevels.findIndex(e => e.key === currentEdu);
  if (currentIndex === -1 || currentIndex === educationLevels.length - 1) {
    return null; // 已经是最高学历
  }

  const upgrades = [];
  for (let i = currentIndex + 1; i < educationLevels.length; i++) {
    const nextLevel = educationLevels[i];
    const scoreIncrease = nextLevel.score - educationLevels[currentIndex].score;
    const newScore = currentScore + scoreIncrease;
    const yearsAdvanced = calculateYearsAdvanced(userData, currentScore, newScore, targetScore);

    upgrades.push({
      label: `${educationLevels[currentIndex].label}升${nextLevel.label}`,
      scoreIncrease,
      yearsAdvanced,
    });
  }

  return {
    type: 'education',
    title: '📚 学历提升',
    icon: '📚',
    options: upgrades,
  };
};

// 购买自有住房建议
const getHousingSuggestion = (userData, currentScore, targetScore) => {
  if (userData.housing?.hasOwnHouse) {
    return null; // 已有自有住房
  }

  // 假设从今年开始购房，每年+1分
  const annualIncrease = SCORE_RULES.ownHouse;
  const currentIncrease = userData.housing?.rentDate ? SCORE_RULES.rent : 0;
  const netIncrease = annualIncrease - currentIncrease;

  const scoreIncrease = netIncrease; // 第一年增加的分数
  const newScore = currentScore + scoreIncrease;
  const yearsAdvanced = calculateYearsAdvanced(userData, currentScore, newScore, targetScore, netIncrease);

  return {
    type: 'housing',
    title: '🏠 购买自有住房',
    icon: '🏠',
    options: [{
      label: '购买自有住房（每年+1分）',
      scoreIncrease: `+${netIncrease}分/年`,
      yearsAdvanced,
      description: '从租房改为自有住房，居住积分增长更快',
    }],
  };
};

// 迁至城六区外建议
const getJobHousingSuggestion = (userData, currentScore, targetScore) => {
  // 检查是否已经符合条件
  const hasOutsideHousing = userData.housing?.hasOwnHouse && userData.housing?.ownHouseDistrict === 'outside';
  const hasOutsideWork = userData.jobHousing?.jobDistrict === 'outside';

  if (hasOutsideHousing && hasOutsideWork) {
    // 已经都在城六区外，检查是否达到上限12分
    const start2018 = dayjs('2018-01-01');
    const startDate = userData.housing?.ownHouseDate ? dayjs(userData.housing.ownHouseDate) : dayjs();
    const actualStartDate = startDate.isAfter(start2018) ? startDate : start2018;
    const currentYears = dayjs().diff(actualStartDate, 'year', true);
    const scorePerYear = SCORE_RULES.jobHousing.housingScore + SCORE_RULES.jobHousing.workScore; // 2 + 3 = 5
    const currentJobHousingScore = Math.min(currentYears * scorePerYear, SCORE_RULES.jobHousing.max);

    if (currentJobHousingScore >= SCORE_RULES.jobHousing.max) {
      return null; // 已达上限
    }
  }

  // 居住在城六区外 + 工作在城六区外，每年最多5分
  const annualIncrease = SCORE_RULES.jobHousing.housingScore + SCORE_RULES.jobHousing.workScore;
  const maxScore = SCORE_RULES.jobHousing.max;

  const scoreIncrease = annualIncrease;
  const newScore = currentScore + scoreIncrease;
  const yearsAdvanced = calculateYearsAdvanced(userData, currentScore, newScore, targetScore, annualIncrease);

  return {
    type: 'jobHousing',
    title: '📍 迁至城六区外',
    icon: '📍',
    options: [{
      label: '工作和居住都在城六区外',
      scoreIncrease: `+${annualIncrease}分/年（最高${maxScore}分）`,
      yearsAdvanced,
      description: '职住匹配加分，需自有住房和就业地都在城六区外（自2018年起计算）',
    }],
  };
};

// 申请专利建议
const getPatentSuggestion = (userData, currentScore, targetScore) => {
  const options = [];

  // 发明专利
  const inventionScore = SCORE_RULES.innovation.inventionPatent;
  const inventionNewScore = currentScore + inventionScore;
  const inventionYears = calculateYearsAdvanced(userData, currentScore, inventionNewScore, targetScore);

  options.push({
    label: '申请发明专利',
    scoreIncrease: `+${inventionScore}分`,
    yearsAdvanced: inventionYears,
    description: '💬 "或者试试当朝阳群众？抓个小偷也能加分哦😏"',
  });

  // 实用新型专利
  const utilityScore = SCORE_RULES.innovation.utilityPatent;
  const utilityNewScore = currentScore + utilityScore;
  const utilityYears = calculateYearsAdvanced(userData, currentScore, utilityNewScore, targetScore);

  options.push({
    label: '申请实用新型专利',
    scoreIncrease: `+${utilityScore}分`,
    yearsAdvanced: utilityYears,
  });

  return {
    type: 'patent',
    title: '💡 申请专利',
    icon: '💡',
    options,
  };
};

// 纳税加分建议
const getTaxSuggestion = (userData, currentScore, targetScore) => {
  if (userData.tax?.hasHighIncome) {
    return null; // 已经有纳税加分
  }

  const scoreIncrease = SCORE_RULES.tax.score;
  const newScore = currentScore + scoreIncrease;
  const yearsAdvanced = calculateYearsAdvanced(userData, currentScore, newScore, targetScore);

  return {
    type: 'tax',
    title: '💰 纳税加分',
    icon: '💰',
    options: [{
      label: '近3年连续个税10万+',
      scoreIncrease: `+${scoreIncrease}分`,
      yearsAdvanced,
      description: '提高年收入至50万+，满足纳税要求',
    }],
  };
};

// 荣誉表彰建议
const getHonorSuggestion = (userData, currentScore, targetScore) => {
  if (userData.honor?.hasProvincialHonor) {
    return null; // 已有省部级荣誉
  }

  const scoreIncrease = SCORE_RULES.honor.provincial;
  const newScore = currentScore + scoreIncrease;
  const yearsAdvanced = calculateYearsAdvanced(userData, currentScore, newScore, targetScore);

  return {
    type: 'honor',
    title: '🏆 荣誉表彰',
    icon: '🏆',
    options: [{
      label: '获得省部级以上荣誉',
      scoreIncrease: `+${scoreIncrease}分`,
      yearsAdvanced,
      description: '💬 "见义勇为、无偿献血...总有一款适合你！"',
    }],
  };
};

// 计算能提前多少年落户
const calculateYearsAdvanced = (userData, currentScore, newScore, targetScore, annualGrowth = 0) => {
  // 计算当前情况下每年的自然增长
  const currentAnnualGrowth = calculateNaturalAnnualGrowth(userData);

  // 如果有额外的年度增长（如购房、职住），加上去
  const totalAnnualGrowth = currentAnnualGrowth + annualGrowth;

  if (totalAnnualGrowth <= 0) {
    return 0; // 没有增长或负增长，无法计算
  }

  // 当前情况下达标需要的年数
  const yearsNeeded = Math.ceil((targetScore - currentScore) / currentAnnualGrowth);

  // 加分后达标需要的年数
  const yearsNeededAfter = Math.ceil((targetScore - newScore) / totalAnnualGrowth);

  const advanced = Math.max(0, yearsNeeded - yearsNeededAfter);
  return advanced;
};

// 计算自然年度增长（社保+居住+职住-年龄）
const calculateNaturalAnnualGrowth = (userData) => {
  let growth = SCORE_RULES.socialSecurity; // 社保固定每年+3

  // 居住
  if (userData.housing?.hasOwnHouse) {
    growth += SCORE_RULES.ownHouse;
  } else if (userData.housing?.rentDate) {
    growth += SCORE_RULES.rent;
  }

  // 职住（检查是否已达上限）
  const hasOutsideHousing = userData.housing?.hasOwnHouse && userData.housing?.ownHouseDistrict === 'outside';
  const hasOutsideWork = userData.jobHousing?.jobDistrict === 'outside';

  if (hasOutsideHousing && hasOutsideWork) {
    // 计算当前职住积分是否已达上限
    const start2018 = dayjs('2018-01-01');
    const startDate = userData.housing?.ownHouseDate ? dayjs(userData.housing.ownHouseDate) : dayjs();
    const actualStartDate = startDate.isAfter(start2018) ? startDate : start2018;
    const years = dayjs().diff(actualStartDate, 'year', true);
    const scorePerYear = SCORE_RULES.jobHousing.housingScore + SCORE_RULES.jobHousing.workScore; // 5分/年
    const currentJobHousingScore = Math.min(years * scorePerYear, SCORE_RULES.jobHousing.max);

    if (currentJobHousingScore < SCORE_RULES.jobHousing.max) {
      growth += scorePerYear;
    }
  }

  // 年龄（如果超过45岁，每年-4分）
  const age = dayjs().diff(dayjs(userData.birthDate), 'year');
  if (age > SCORE_RULES.age.threshold) {
    growth -= SCORE_RULES.age.penalty; // 减去4分
  }

  return growth;
};

// 找到达标年份
export const findQualifyingYear = (userData, startYear = new Date().getFullYear()) => {
  for (let year = startYear; year <= 2050; year++) {
    const score = calculateTotalScore(userData, year);
    const scoreLine = getScoreLine(year);

    if (score >= scoreLine) {
      return {
        year,
        score,
        scoreLine,
        yearsFromNow: year - startYear,
      };
    }
  }

  return null; // 无法达标
};

export default {
  generateSuggestions,
  findQualifyingYear,
};
