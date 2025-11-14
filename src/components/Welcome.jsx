import React from 'react';
import { Button } from 'antd-mobile';
import './Welcome.css';

const Welcome = ({ onStart }) => {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="welcome-header">
          <div className="welcome-icon">🏛️</div>
          <h1 className="welcome-title">北京积分落户计算器</h1>
          <p className="welcome-subtitle">精准预测您的落户时间</p>
        </div>

        <div className="welcome-features">
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <span className="feature-text">智能计算积分</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📈</span>
            <span className="feature-text">趋势预测分析</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">💡</span>
            <span className="feature-text">个性化建议</span>
          </div>
        </div>

        <div className="welcome-description">
          <p>基于北京市积分落户政策，综合评估您的积分情况</p>
          <p>帮助您了解落户时间，规划加分路径</p>
        </div>

        <div className="welcome-action">
          <Button
            color="primary"
            size="large"
            block
            onClick={onStart}
            className="start-button"
          >
            开始计算
          </Button>
        </div>

        <div className="welcome-footer">
          <p className="footer-text">数据仅供参考，最终以官方政策为准</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
