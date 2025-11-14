import React, { useState } from 'react';
import { DatePicker, List } from 'antd-mobile';
import dayjs from 'dayjs';

const BasicInfo = ({ data, updateData }) => {
  const [birthDateVisible, setBirthDateVisible] = useState(false);
  const [socialSecurityVisible, setSocialSecurityVisible] = useState(false);

  const handleBirthDateChange = (value) => {
    updateData({ birthDate: value });
  };

  const handleSocialSecurityChange = (value) => {
    updateData({ socialSecurityStartDate: value });
  };

  const now = new Date();
  const minBirthDate = new Date(1950, 0, 1); // 1950年1月1日
  const minSocialSecurityDate = new Date(2000, 0, 1); // 2000年1月
  const defaultBirthDate = new Date(1990, 0, 1); // 默认1990年
  const defaultSocialSecurityDate = new Date(2015, 0, 1); // 默认2015年

  return (
    <div className="step-container">
      <h2 className="step-title">基础信息</h2>
      <p className="step-description">
        请填写您的出生日期和社保开始缴纳时间，我们将基于此计算您的年龄和社保年限积分。
      </p>

      <div className="form-section">
        <List>
          <List.Item
            onClick={() => setBirthDateVisible(true)}
            extra={data.birthDate ? dayjs(data.birthDate).format('YYYY-MM-DD') : '请选择'}
            arrow
          >
            <span className="form-label-required">出生日期</span>
          </List.Item>

          <List.Item
            onClick={() => setSocialSecurityVisible(true)}
            extra={data.socialSecurityStartDate ? dayjs(data.socialSecurityStartDate).format('YYYY-MM') : '请选择'}
            arrow
          >
            <span className="form-label-required">社保开始缴纳时间</span>
          </List.Item>
        </List>

        <div className="form-hint" style={{ padding: '0 16px', marginTop: 12 }}>
          提示：社保每缴纳满1年可获得3分
        </div>
      </div>

      <DatePicker
        visible={birthDateVisible}
        onClose={() => setBirthDateVisible(false)}
        title="选择出生日期"
        precision="day"
        min={minBirthDate}
        max={now}
        value={data.birthDate ? new Date(data.birthDate) : defaultBirthDate}
        onConfirm={(value) => {
          handleBirthDateChange(value);
          setBirthDateVisible(false);
        }}
      />

      <DatePicker
        visible={socialSecurityVisible}
        onClose={() => setSocialSecurityVisible(false)}
        title="选择社保开始缴纳时间"
        precision="month"
        min={minSocialSecurityDate}
        max={now}
        value={data.socialSecurityStartDate ? new Date(data.socialSecurityStartDate) : defaultSocialSecurityDate}
        onConfirm={(value) => {
          handleSocialSecurityChange(value);
          setSocialSecurityVisible(false);
        }}
      />
    </div>
  );
};

export default BasicInfo;
