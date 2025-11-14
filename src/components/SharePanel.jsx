import React, { useState } from 'react';
import { Button, Toast } from 'antd-mobile';
import { QRCodeSVG } from 'qrcode.react';
import './SharePanel.css';

const SharePanel = ({ score, qualifyYear }) => {
  const [showQR, setShowQR] = useState(false);

  // 这里使用占位URL，实际部署时替换
  const shareUrl = 'https://your-domain.com';

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        Toast.show({
          content: '链接已复制到剪贴板',
          icon: 'success',
        });
      }).catch(() => {
        Toast.show({
          content: '复制失败，请手动复制',
          icon: 'fail',
        });
      });
    } else {
      // 兼容处理
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        Toast.show({
          content: '链接已复制到剪贴板',
          icon: 'success',
        });
      } catch (err) {
        Toast.show({
          content: '复制失败，请手动复制',
          icon: 'fail',
        });
      }
      document.body.removeChild(textArea);
    }
  };

  const handleShowQR = () => {
    setShowQR(!showQR);
  };

  return (
    <div className="share-panel">
      <div className="share-title">分享工具</div>
      <div className="share-description">
        分享给朋友，帮助更多人了解北京积分落户政策
      </div>

      <div className="share-actions">
        <Button
          color="primary"
          fill="outline"
          size="middle"
          onClick={handleCopyLink}
          style={{ flex: 1 }}
        >
          🔗 复制链接
        </Button>
        <Button
          color="primary"
          fill="outline"
          size="middle"
          onClick={handleShowQR}
          style={{ flex: 1 }}
        >
          📲 {showQR ? '隐藏' : '显示'}二维码
        </Button>
      </div>

      {showQR && (
        <div className="qr-container">
          <div className="qr-wrapper">
            <QRCodeSVG
              value={shareUrl}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
          <div className="qr-hint">
            扫描二维码访问北京积分落户计算器
          </div>
        </div>
      )}
    </div>
  );
};

export default SharePanel;
