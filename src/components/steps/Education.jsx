import React from 'react';
import { Radio, Space, List } from 'antd-mobile';

const Education = ({ data, updateData }) => {
  const educationOptions = [
    { label: '大学专科', value: 'junior_college', score: 10.5, description: '大专学历' },
    { label: '大学本科', value: 'bachelor', score: 15, description: '本科学历' },
    { label: '硕士研究生', value: 'master', score: 26, description: '硕士学位' },
    { label: '博士研究生', value: 'doctor', score: 37, description: '博士学位' },
  ];

  const handleChange = (value) => {
    updateData({ education: value });
  };

  return (
    <div className="step-container">
      <h2 className="step-title">学历积分</h2>
      <p className="step-description">
        请选择您的最高学历，学历积分为一次性加分项。
      </p>

      <div className="form-section">
        <Radio.Group
          value={data.education}
          onChange={handleChange}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {educationOptions.map(option => (
              <div
                key={option.value}
                style={{
                  background: data.education === option.value ? '#f0f5ff' : '#fafafa',
                  border: data.education === option.value ? '2px solid #667eea' : '1px solid #e8e8e8',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                onClick={() => handleChange(option.value)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Radio value={option.value} />
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>
                          {option.label}
                        </div>
                        <div style={{ fontSize: '13px', color: '#999' }}>
                          {option.description}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#667eea',
                  }}>
                    +{option.score}分
                  </div>
                </div>
              </div>
            ))}
          </Space>
        </Radio.Group>

        <div className="form-hint" style={{ marginTop: 16 }}>
          提示：学历积分为一次性加分，选择您的最高学历即可
        </div>
      </div>
    </div>
  );
};

export default Education;
