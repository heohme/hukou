import React, { useMemo } from 'react';
import { Button, Collapse, Card } from 'antd-mobile';
import dayjs from 'dayjs';
import ScoreChart from './ScoreChart';
import SharePanel from './SharePanel';
import {
  calculateTotalScore,
  predictFutureScores,
  calculateEducationScore,
  calculateSocialSecurityScore,
  calculateAgeScore,
  calculateHousingScore,
  calculateJobHousingScore,
  calculateTaxScore,
  calculateInnovationScore,
  calculateHonorScore,
  calculateLawScore
} from '../utils/calculator';
import { getScoreLinesInRange, getScoreLine } from '../utils/scoreLines';
import { findQualifyingYear, generateSuggestions } from '../utils/suggestions';
import './Result.css';

// 计算分数明细
const calculateScoreDetails = (userData, year) => {
  const details = [];

  // 学历
  const educationScore = calculateEducationScore(userData.education);
  if (educationScore > 0) {
    const labels = {
      junior_college: '大学专科',
      bachelor: '大学本科',
      master: '硕士研究生',
      doctor: '博士研究生',
    };
    details.push({
      icon: '🎓',
      label: `学历（${labels[userData.education]}）`,
      score: educationScore,
    });
  }

  // 社保
  const socialSecurityScore = calculateSocialSecurityScore(userData.socialSecurityStartDate, year);
  if (socialSecurityScore > 0) {
    details.push({
      icon: '💼',
      label: '社保年限',
      score: socialSecurityScore,
    });
  }

  // 年龄
  const ageScore = calculateAgeScore(userData.birthDate, year);
  if (ageScore !== 0) {
    details.push({
      icon: '👤',
      label: '年龄',
      score: ageScore,
    });
  }

  // 居住
  const housingScore = calculateHousingScore(userData.housing, year, userData.socialSecurityStartDate);
  if (housingScore > 0) {
    details.push({
      icon: '🏠',
      label: userData.housing.hasOwnHouse ? '自有住房' : '合法租赁住所',
      score: housingScore,
    });
  }

  // 职住
  const jobHousingScore = calculateJobHousingScore(userData.jobHousing, userData.housing, year);
  if (jobHousingScore > 0) {
    details.push({
      icon: '🏢',
      label: '职住匹配',
      score: jobHousingScore,
    });
  }

  // 纳税
  const taxScore = calculateTaxScore(userData.tax);
  if (taxScore > 0) {
    details.push({
      icon: '💰',
      label: '纳税',
      score: taxScore,
    });
  }

  // 创新创业
  const innovationScore = calculateInnovationScore(userData.innovation);
  if (innovationScore > 0) {
    details.push({
      icon: '💡',
      label: '创新创业',
      score: innovationScore,
    });
  }

  // 荣誉表彰
  const honorScore = calculateHonorScore(userData.honor);
  if (honorScore > 0) {
    details.push({
      icon: '🏆',
      label: '荣誉表彰',
      score: honorScore,
    });
  }

  // 守法记录
  const lawScore = calculateLawScore(userData.law);
  if (lawScore !== 0) {
    details.push({
      icon: '⚖️',
      label: '守法记录',
      score: lawScore,
    });
  }

  return details;
};

const Result = ({ userData, onReset }) => {
  const currentYear = new Date().getFullYear();
  const currentScore = calculateTotalScore(userData, currentYear);

  // 查找达标年份
  const qualifyInfo = useMemo(() => {
    return findQualifyingYear(userData, currentYear);
  }, [userData, currentYear]);

  // 预测未来分数，根据是否能达标动态调整时间范围
  const userScores = useMemo(() => {
    let endYear;
    if (qualifyInfo) {
      // 能达标：结束年份 = 达标年份 + 2
      endYear = qualifyInfo.year + 2;
    } else {
      // 不能达标：显示未来10年
      endYear = currentYear + 10;
    }
    return predictFutureScores(userData, currentYear, endYear);
  }, [userData, currentYear, qualifyInfo]);

  // 获取分数线数据，范围与userScores保持一致
  const scoreLines = useMemo(() => {
    let endYear;
    if (qualifyInfo) {
      endYear = qualifyInfo.year + 2;
    } else {
      endYear = currentYear + 10;
    }
    return getScoreLinesInRange(currentYear, endYear);
  }, [currentYear, qualifyInfo]);

  // 生成加分建议
  const suggestions = useMemo(() => {
    if (!qualifyInfo) return [];
    return generateSuggestions(userData, currentYear, qualifyInfo.scoreLine);
  }, [userData, currentYear, qualifyInfo]);

  const hasHope = qualifyInfo !== null;

  return (
    <div className="result-container">
      <div className="result-header">
        <div className="header-content">
          <h1 className="result-title">计算结果</h1>
          <Button
            size="small"
            fill="none"
            onClick={onReset}
            style={{ color: '#ffffff' }}
          >
            重新计算
          </Button>
        </div>
      </div>

      <div className="result-content">
        {/* 1. 当前总分 */}
        <div className="score-card">
          <div className="score-card-label">当前总分（{currentYear}年）</div>
          <div className="score-card-value">{currentScore.toFixed(2)}分</div>
          <div className="score-card-hint">
            当年分数线：{getScoreLine(currentYear)}分
          </div>
          <a
            href="#score-details"
            className="score-card-link"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('score-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            查看明细 →
          </a>
        </div>

        {/* 2. 结果预估 */}
        {!hasHope ? (
          <div className="no-hope-section">
            <div className="no-hope-icon">😔</div>
            <div className="no-hope-title">暂时无法达标</div>
            <div className="no-hope-description">
              根据预测，即使自然增长到2035年，您的分数可能仍难以达到落户分数线（约132分）。
            </div>
            <div className="no-hope-hint">
              💡 建议：
              <ul>
                <li>考虑其他城市的落户政策</li>
                <li>积极争取学历提升、专利、荣誉等高分加分项</li>
                <li>保持良好的社保缴纳记录</li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            {/* 达标信息 */}
            <div className="qualify-section">
              <div className="qualify-icon">🎉</div>
              <div className="qualify-title">预计落户时间</div>
              <div className="qualify-year">{qualifyInfo.year}年</div>
              <div className="qualify-description">
                还需 <strong>{qualifyInfo.yearsFromNow}</strong> 年
                （届时您的分数：{qualifyInfo.score.toFixed(2)}分，分数线：{qualifyInfo.scoreLine}分）
              </div>
            </div>
          </>
        )}

        {/* 3. 分数趋势预测 */}
        <div className="chart-section">
          <div className="section-title">📈 分数趋势预测</div>
          <div className="chart-wrapper">
            <ScoreChart userScores={userScores} scoreLines={scoreLines} />
          </div>
        </div>

        {/* 4. 加分明细和组成 */}
        <div className="score-detail-section" id="score-details">
          <div className="section-title">📋 加分明细</div>
          <div className="score-items">
            {calculateScoreDetails(userData, currentYear).map((item, index) => (
              <div key={index} className="score-item">
                <div className="score-item-label">
                  <span className="score-item-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <div className="score-item-value" style={{ color: item.score >= 0 ? '#52c41a' : '#ff4d4f' }}>
                  {item.score >= 0 ? '+' : ''}{item.score.toFixed(1)}分
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 加分建议 */}
        {hasHope && (
          <>
            <div className="suggestions-section">
              <div className="section-title">💡 加分建议</div>
              <div className="suggestions-hint">
                以下操作可以帮助您提前达到落户分数线
              </div>

              <Collapse accordion>
                {suggestions.map((suggestion, index) => (
                  <Collapse.Panel
                    key={index}
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px' }}>{suggestion.icon}</span>
                        <span style={{ fontWeight: 600 }}>{suggestion.title}</span>
                      </div>
                    }
                  >
                    <div className="suggestion-content">
                      {suggestion.options.map((option, idx) => (
                        <div key={idx} className="suggestion-item">
                          <div className="suggestion-item-header">
                            <span className="suggestion-label">{option.label}</span>
                            <span className="suggestion-score">
                              {typeof option.scoreIncrease === 'string'
                                ? option.scoreIncrease
                                : `+${option.scoreIncrease}分`}
                            </span>
                          </div>
                          {option.yearsAdvanced > 0 && (
                            <div className="suggestion-benefit">
                              ⏰ 可提前 <strong>{option.yearsAdvanced}</strong> 年落户
                            </div>
                          )}
                          {option.description && (
                            <div className="suggestion-description">
                              {option.description}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </Collapse.Panel>
                ))}
              </Collapse>
            </div>
          </>
        )}

        {/* 分享面板 */}
        <SharePanel score={currentScore} qualifyYear={qualifyInfo?.year} />

        {/* 免责声明 */}
        <div className="disclaimer">
          <div className="disclaimer-title">⚠️ 免责声明</div>
          <div className="disclaimer-content">
            本工具仅供参考，计算结果基于现行政策和历史数据预测。实际落户分数线会受政策调整、申请人数等多种因素影响。
            请以北京市人力资源和社会保障局官方发布的信息为准。
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
