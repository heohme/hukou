import React from 'react';
import { Switch, List } from 'antd-mobile';

const Tax = ({ data, updateData }) => {
  const handleHighIncomeChange = (checked) => {
    updateData({
      tax: {
        ...data.tax,
        hasHighIncome: checked,
      },
    });
  };

  return (
    <div className="step-container">
      <h2 className="step-title">纳税情况</h2>
      <p className="step-description">
        近3年连续缴纳个人所得税累计10万元以上，可获得6分加分。
      </p>

      <div className="form-section">
        <List>
          <List.Item
            description="近3年连续缴纳个税累计10万+"
            extra={
              <Switch
                checked={data.tax.hasHighIncome}
                onChange={handleHighIncomeChange}
              />
            }
          >
            是否符合纳税加分条件
          </List.Item>
        </List>

        <div className="form-hint" style={{ padding: '0 16px', marginTop: 12 }}>
          提示：符合条件可一次性获得6分加分
        </div>
      </div>

      {data.tax.hasHighIncome && (
        <div className="form-section">
          <div style={{
            padding: '16px',
            background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
            borderRadius: '12px',
            color: '#ffffff',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '14px', marginBottom: 8, opacity: 0.9 }}>
              纳税加分
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
              +6分
            </div>
          </div>
        </div>
      )}

      <div className="form-section">
        <div className="form-section-title">💡 如何达到纳税要求？</div>
        <div style={{ padding: '0 16px', fontSize: '14px', lineHeight: 1.8, color: '#666' }}>
          <p style={{ margin: '8px 0' }}>
            • 年收入达到约50万元以上
          </p>
          <p style={{ margin: '8px 0' }}>
            • 近3年连续缴纳，不能中断
          </p>
          <p style={{ margin: '8px 0' }}>
            • 包括工资薪金、劳务报酬等各项收入
          </p>
        </div>
      </div>
    </div>
  );
};

export default Tax;
