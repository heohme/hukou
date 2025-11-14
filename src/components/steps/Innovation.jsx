import React from 'react';
import { Stepper } from 'antd-mobile';

const Innovation = ({ data, updateData }) => {
  const handleInventionChange = (value) => {
    updateData({
      innovation: {
        ...data.innovation,
        inventionPatents: value,
      },
    });
  };

  const handleUtilityChange = (value) => {
    updateData({
      innovation: {
        ...data.innovation,
        utilityPatents: value,
      },
    });
  };

  const totalScore =
    (data.innovation.inventionPatents || 0) * 9 +
    (data.innovation.utilityPatents || 0) * 3;

  return (
    <div className="step-container">
      <h2 className="step-title">创新创业</h2>
      <p className="step-description">
        拥有专利可以获得加分。包括科技、文化领域国家级奖项，以及国家级高新技术企业等。
      </p>

      <div className="form-section">
        <div style={{ padding: '16px' }}>
          <div className="form-label">
            发明专利数量
            <span style={{
              marginLeft: '8px',
              fontSize: '12px',
              color: '#ff4d4f',
              background: '#fff1f0',
              padding: '2px 8px',
              borderRadius: '4px',
              fontWeight: 'normal'
            }}>
              ⭐⭐⭐ 很难
            </span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 12,
          }}>
            <Stepper
              value={data.innovation.inventionPatents}
              onChange={handleInventionChange}
              min={0}
              max={20}
              style={{ flex: 1 }}
            />
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#667eea',
              marginLeft: 20,
            }}>
              +{(data.innovation.inventionPatents || 0) * 9}分
            </div>
          </div>
          <div className="form-hint" style={{ marginTop: 8 }}>
            每项发明专利可获得9分（需符合相关条件）
          </div>
        </div>
      </div>

      <div className="form-section">
        <div style={{ padding: '16px' }}>
          <div className="form-label">
            实用新型专利数量
            <span style={{
              marginLeft: '8px',
              fontSize: '12px',
              color: '#faad14',
              background: '#fffbe6',
              padding: '2px 8px',
              borderRadius: '4px',
              fontWeight: 'normal'
            }}>
              ⭐⭐ 较难
            </span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 12,
          }}>
            <Stepper
              value={data.innovation.utilityPatents}
              onChange={handleUtilityChange}
              min={0}
              max={20}
              style={{ flex: 1 }}
            />
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#667eea',
              marginLeft: 20,
            }}>
              +{(data.innovation.utilityPatents || 0) * 3}分
            </div>
          </div>
          <div className="form-hint" style={{ marginTop: 8 }}>
            每项实用新型专利可获得3分（需符合相关条件）
          </div>
        </div>
      </div>

      {totalScore > 0 && (
        <div className="form-section">
          <div style={{
            padding: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            color: '#ffffff',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '14px', marginBottom: 8, opacity: 0.9 }}>
              创新创业总分
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
              {totalScore}分
            </div>
          </div>
        </div>
      )}

      <div className="form-section">
        <div style={{
          padding: '16px',
          background: '#f0f5ff',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#1677ff',
          lineHeight: 1.6,
        }}>
          💬 "没有专利也不用担心！试试当朝阳群众？抓个小偷也能加分哦😏"
        </div>
      </div>
    </div>
  );
};

export default Innovation;
