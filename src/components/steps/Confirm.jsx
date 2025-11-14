import React from 'react';
import { Card, Tag } from 'antd-mobile';
import dayjs from 'dayjs';
import { calculateTotalScore } from '../../utils/calculator';

const Confirm = ({ data }) => {
  const educationLabels = {
    junior_college: '大学专科',
    bachelor: '大学本科',
    master: '硕士研究生',
    doctor: '博士研究生',
  };

  const currentYear = new Date().getFullYear();
  const currentScore = calculateTotalScore(data, currentYear);

  return (
    <div className="step-container">
      <h2 className="step-title">确认信息</h2>
      <p className="step-description">
        请确认以下信息无误后提交，我们将为您计算积分并生成报告。
      </p>

      <div className="form-section">
        <div className="form-section-title">基础信息</div>
        <div style={{ padding: '0 16px' }}>
          <div className="confirm-item">
            <span className="confirm-label">出生日期：</span>
            <span className="confirm-value">
              {data.birthDate ? dayjs(data.birthDate).format('YYYY-MM-DD') : '未填写'}
            </span>
          </div>
          <div className="confirm-item">
            <span className="confirm-label">社保开始时间：</span>
            <span className="confirm-value">
              {data.socialSecurityStartDate
                ? dayjs(data.socialSecurityStartDate).format('YYYY-MM')
                : '未填写'}
            </span>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">学历</div>
        <div style={{ padding: '0 16px' }}>
          <Tag color="primary" fill="outline">
            {educationLabels[data.education] || '未选择'}
          </Tag>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">居住情况</div>
        <div style={{ padding: '0 16px' }}>
          {data.housing.hasOwnHouse ? (
            <>
              <div className="confirm-item">
                <span className="confirm-label">自有住房：</span>
                <span className="confirm-value">是</span>
              </div>
              <div className="confirm-item">
                <span className="confirm-label">房本时间：</span>
                <span className="confirm-value">
                  {data.housing.ownHouseDate
                    ? dayjs(data.housing.ownHouseDate).format('YYYY-MM')
                    : '未填写'}
                </span>
              </div>
              <div className="confirm-item">
                <span className="confirm-label">所在区域：</span>
                <span className="confirm-value">
                  {data.housing.ownHouseDistrict === 'outside' ? '城六区外' : '城六区内'}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="confirm-item">
                <span className="confirm-label">自有住房：</span>
                <span className="confirm-value">否（租房）</span>
              </div>
              <div className="confirm-item">
                <span className="confirm-label">租住时间：</span>
                <span className="confirm-value">
                  {data.housing.rentDate
                    ? dayjs(data.housing.rentDate).format('YYYY-MM')
                    : '未填写'}
                </span>
              </div>
              <div className="confirm-item">
                <span className="confirm-label">所在区域：</span>
                <span className="confirm-value">
                  {data.housing.rentDistrict === 'outside' ? '城六区外' : '城六区内'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">职住匹配</div>
        <div style={{ padding: '0 16px' }}>
          <div className="confirm-item">
            <span className="confirm-label">符合条件：</span>
            <span className="confirm-value">
              {data.jobHousing.isOutsideSixDistricts ? (
                <Tag color="success">是</Tag>
              ) : (
                <Tag color="default">否</Tag>
              )}
            </span>
          </div>
          {data.jobHousing.isOutsideSixDistricts && (
            <div className="confirm-item">
              <span className="confirm-label">开始时间：</span>
              <span className="confirm-value">
                {data.jobHousing.startDate
                  ? dayjs(data.jobHousing.startDate).format('YYYY-MM')
                  : '未填写'}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">创新创业</div>
        <div style={{ padding: '0 16px' }}>
          <div className="confirm-item">
            <span className="confirm-label">发明专利：</span>
            <span className="confirm-value">{data.innovation.inventionPatents || 0}项</span>
          </div>
          <div className="confirm-item">
            <span className="confirm-label">实用新型专利：</span>
            <span className="confirm-value">{data.innovation.utilityPatents || 0}项</span>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">纳税情况</div>
        <div style={{ padding: '0 16px' }}>
          <div className="confirm-item">
            <span className="confirm-label">近3年个税10万+：</span>
            <span className="confirm-value">
              {data.tax.hasHighIncome ? (
                <Tag color="success">是</Tag>
              ) : (
                <Tag color="default">否</Tag>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">荣誉与守法</div>
        <div style={{ padding: '0 16px' }}>
          <div className="confirm-item">
            <span className="confirm-label">省部级荣誉：</span>
            <span className="confirm-value">
              {data.honor.hasProvincialHonor ? (
                <Tag color="success">有</Tag>
              ) : (
                <Tag color="default">无</Tag>
              )}
            </span>
          </div>
          <div className="confirm-item">
            <span className="confirm-label">见义勇为：</span>
            <span className="confirm-value">
              {data.honor.hasBraveAct ? (
                <Tag color="success">有</Tag>
              ) : (
                <Tag color="default">无</Tag>
              )}
            </span>
          </div>
          <div className="confirm-item">
            <span className="confirm-label">违法记录：</span>
            <span className="confirm-value">
              {data.law.hasViolation ? (
                <Tag color="danger">{data.law.violationCount || 1}次</Tag>
              ) : (
                <Tag color="success">无</Tag>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          color: '#ffffff',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '14px', marginBottom: 8, opacity: 0.9 }}>
            {currentYear}年预估总分
          </div>
          <div style={{ fontSize: '42px', fontWeight: 'bold' }}>
            {currentScore.toFixed(2)}分
          </div>
        </div>
      </div>

      <style>{`
        .confirm-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .confirm-item:last-child {
          border-bottom: none;
        }

        .confirm-label {
          font-size: 14px;
          color: #666666;
        }

        .confirm-value {
          font-size: 14px;
          color: #333333;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default Confirm;
