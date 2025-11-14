import React from 'react';
import { Switch, Stepper, List } from 'antd-mobile';

const Honor = ({ data, updateData }) => {
  const handleProvincialHonorChange = (checked) => {
    updateData({
      honor: {
        ...data.honor,
        hasProvincialHonor: checked,
      },
    });
  };

  const handleBraveActChange = (checked) => {
    updateData({
      honor: {
        ...data.honor,
        hasBraveAct: checked,
      },
    });
  };

  const handleViolationChange = (checked) => {
    updateData({
      law: {
        ...data.law,
        hasViolation: checked,
        violationCount: checked ? (data.law.violationCount || 1) : 0,
      },
    });
  };

  const handleViolationCountChange = (value) => {
    updateData({
      law: {
        ...data.law,
        violationCount: value,
      },
    });
  };

  const totalHonorScore =
    (data.honor.hasProvincialHonor ? 20 : 0) +
    (data.honor.hasBraveAct ? 20 : 0);

  const totalLawPenalty = data.law.hasViolation
    ? -30 * (data.law.violationCount || 1)
    : 0;

  return (
    <div className="step-container">
      <h2 className="step-title">荣誉表彰与守法记录</h2>
      <p className="step-description">
        荣誉表彰可以获得加分，违法记录会被扣分。
      </p>

      <div className="form-section">
        <div className="form-section-title">🏆 荣誉表彰</div>
        <List>
          <List.Item
            description={
              <span>
                省部级以上荣誉，+20分
                <span style={{
                  marginLeft: '8px',
                  fontSize: '11px',
                  color: '#ff4d4f',
                  background: '#fff1f0',
                  padding: '1px 6px',
                  borderRadius: '4px',
                }}>
                  ⭐⭐⭐ 很难
                </span>
              </span>
            }
            extra={
              <Switch
                checked={data.honor.hasProvincialHonor}
                onChange={handleProvincialHonorChange}
              />
            }
          >
            省部级以上荣誉
          </List.Item>

          <List.Item
            description={
              <span>
                见义勇为等荣誉，+20分
                <span style={{
                  marginLeft: '8px',
                  fontSize: '11px',
                  color: '#faad14',
                  background: '#fffbe6',
                  padding: '1px 6px',
                  borderRadius: '4px',
                }}>
                  ⭐⭐ 较难
                </span>
              </span>
            }
            extra={
              <Switch
                checked={data.honor.hasBraveAct}
                onChange={handleBraveActChange}
              />
            }
          >
            见义勇为记录
          </List.Item>
        </List>

        {totalHonorScore > 0 && (
          <div style={{
            margin: '16px',
            padding: '16px',
            background: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)',
            borderRadius: '12px',
            color: '#ffffff',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '14px', marginBottom: 8, opacity: 0.9 }}>
              荣誉表彰总分
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
              +{totalHonorScore}分
            </div>
          </div>
        )}

        <div className="form-hint" style={{ padding: '0 16px', marginTop: 12 }}>
          💬 "见义勇为、无偿献血...总有一款适合你！"
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">⚖️ 守法记录</div>
        <List>
          <List.Item
            description="每次违法记录 -30分"
            extra={
              <Switch
                checked={data.law.hasViolation}
                onChange={handleViolationChange}
              />
            }
          >
            是否有违法记录
          </List.Item>
        </List>

        {data.law.hasViolation && (
          <div style={{ padding: '16px' }}>
            <div className="form-label">违法记录次数</div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 12,
            }}>
              <Stepper
                value={data.law.violationCount}
                onChange={handleViolationCountChange}
                min={1}
                max={10}
                style={{ flex: 1 }}
              />
              <div style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#ff4d4f',
                marginLeft: 20,
              }}>
                {totalLawPenalty}分
              </div>
            </div>
          </div>
        )}

        {totalLawPenalty < 0 && (
          <div style={{
            margin: '16px',
            padding: '16px',
            background: '#fff2f0',
            border: '1px solid #ffccc7',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#ff4d4f',
            textAlign: 'center',
          }}>
            ⚠️ 违法记录将扣除 {Math.abs(totalLawPenalty)} 分
          </div>
        )}
      </div>
    </div>
  );
};

export default Honor;
