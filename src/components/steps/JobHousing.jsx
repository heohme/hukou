import React, { useState, useMemo } from 'react';
import { Radio, Space, DatePicker, List } from 'antd-mobile';
import dayjs from 'dayjs';

const JobHousing = ({ data, updateData }) => {
  const [startDateVisible, setStartDateVisible] = useState(false);
  const handleJobDistrictChange = (value) => {
    const isOutside =
      value === 'outside' && data.jobHousing.housingDistrict === 'outside';
    updateData({
      jobHousing: {
        ...data.jobHousing,
        jobDistrict: value,
        isOutsideSixDistricts: isOutside,
      },
    });
  };

  const handleHousingDistrictChange = (value) => {
    const isOutside =
      data.jobHousing.jobDistrict === 'outside' && value === 'outside';
    updateData({
      jobHousing: {
        ...data.jobHousing,
        housingDistrict: value,
        isOutsideSixDistricts: isOutside,
      },
    });
  };

  const handleStartDateChange = (value) => {
    updateData({
      jobHousing: {
        ...data.jobHousing,
        startDate: value,
      },
    });
  };

  const now = new Date();
  const minDate = new Date(2000, 0, 1); // 最早2000年1月
  const defaultDate = new Date(2015, 0, 1); // 默认2015年
  const isQualified = data.jobHousing.isOutsideSixDistricts;

  // 计算当前职住积分
  const currentJobHousingScore = useMemo(() => {
    if (!isQualified || !data.jobHousing.startDate) return 0;
    const years = dayjs().diff(dayjs(data.jobHousing.startDate), 'year', true);
    const score = Math.min(years * 2, 12);
    return Math.floor(score * 10) / 10; // 保留1位小数
  }, [isQualified, data.jobHousing.startDate]);

  return (
    <div className="step-container">
      <h2 className="step-title">职住匹配</h2>
      <p className="step-description">
        <strong>规则说明：</strong>申请人居住地由城六区转移到本市其他行政区域，且就业地和居住地均在本市城六区外，每满1年加2分，最高加12分。
      </p>

      <div style={{
        background: '#e6f7ff',
        border: '1px solid #91d5ff',
        borderRadius: '8px',
        padding: '12px 16px',
        marginBottom: '16px',
        fontSize: '13px',
        lineHeight: '1.6',
        color: '#0050b3',
      }}>
        <div style={{ marginBottom: '4px' }}>💡 <strong>重要提示：</strong></div>
        <div>• 自有住房所在区域：在居住情况中填写</div>
        <div>• 工作地所在区域：在下方选择</div>
        <div>• 需要<strong>两者都在城六区外</strong>才能获得职住加分</div>
      </div>

      <div className="form-section">
        <div className="form-section-title">就业地</div>
        <div style={{ padding: '0 16px' }}>
          <Radio.Group
            value={data.jobHousing.jobDistrict}
            onChange={handleJobDistrictChange}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Radio value="outside" style={{ marginBottom: 8 }}>
                城六区外（昌平、大兴、顺义等）
              </Radio>
              <Radio value="inside">
                城六区内（东城、西城、朝阳、海淀、丰台、石景山）
              </Radio>
            </Space>
          </Radio.Group>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">居住地</div>
        <div style={{ padding: '0 16px' }}>
          <Radio.Group
            value={data.jobHousing.housingDistrict}
            onChange={handleHousingDistrictChange}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Radio value="outside" style={{ marginBottom: 8 }}>
                城六区外（昌平、大兴、顺义等）
              </Radio>
              <Radio value="inside">
                城六区内（东城、西城、朝阳、海淀、丰台、石景山）
              </Radio>
            </Space>
          </Radio.Group>
        </div>
      </div>

      {isQualified && (
        <div className="form-section">
          <div className="form-section-title">
            ✅ 符合职住加分条件
          </div>
          <List>
            <List.Item
              onClick={() => setStartDateVisible(true)}
              extra={data.jobHousing.startDate ? dayjs(data.jobHousing.startDate).format('YYYY-MM') : '请选择'}
              arrow
            >
              开始满足条件的时间
            </List.Item>
          </List>

          {data.jobHousing.startDate && currentJobHousingScore > 0 && (
            <div style={{
              margin: '16px',
              padding: '16px',
              background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
              borderRadius: '12px',
              color: '#ffffff',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '14px', marginBottom: 8, opacity: 0.9 }}>
                当前职住积分
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                {currentJobHousingScore.toFixed(1)}分
              </div>
              <div style={{ fontSize: '12px', marginTop: 8, opacity: 0.9 }}>
                {currentJobHousingScore >= 12 ? '已达上限' : `距离上限还差 ${(12 - currentJobHousingScore).toFixed(1)} 分`}
              </div>
            </div>
          )}

          <div className="form-hint" style={{ padding: '0 16px', marginTop: 12 }}>
            提示：职住每满1年积2分，最高可获得12分
          </div>
        </div>
      )}

      {!isQualified && (
        <div className="form-section">
          <div style={{
            padding: '16px',
            background: '#fff7e6',
            border: '1px solid #ffd591',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#d46b08',
          }}>
            提示：需要就业地和居住地都在城六区外，才能获得职住加分
          </div>
        </div>
      )}

      <DatePicker
        visible={startDateVisible}
        onClose={() => setStartDateVisible(false)}
        title="选择开始满足职住条件的时间"
        precision="month"
        min={minDate}
        max={now}
        value={data.jobHousing.startDate ? new Date(data.jobHousing.startDate) : defaultDate}
        onConfirm={(value) => {
          handleStartDateChange(value);
          setStartDateVisible(false);
        }}
      />
    </div>
  );
};

export default JobHousing;
