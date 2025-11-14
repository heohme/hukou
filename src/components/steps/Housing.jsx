import React, { useState } from 'react';
import { Switch, DatePicker, Radio, Space, List } from 'antd-mobile';
import dayjs from 'dayjs';

const Housing = ({ data, updateData }) => {
  const [ownHouseDateVisible, setOwnHouseDateVisible] = useState(false);
  const [rentDateVisible, setRentDateVisible] = useState(false);
  const handleHasOwnHouseChange = (checked) => {
    updateData({
      housing: {
        ...data.housing,
        hasOwnHouse: checked,
      },
    });
  };

  const handleOwnHouseDateChange = (value) => {
    updateData({
      housing: {
        ...data.housing,
        ownHouseDate: value,
      },
    });
  };

  const handleOwnHouseDistrictChange = (value) => {
    updateData({
      housing: {
        ...data.housing,
        ownHouseDistrict: value,
      },
    });
  };

  const handleRentDateChange = (value) => {
    updateData({
      housing: {
        ...data.housing,
        rentDate: value,
      },
    });
  };

  const handleRentDistrictChange = (value) => {
    updateData({
      housing: {
        ...data.housing,
        rentDistrict: value,
      },
    });
  };

  const now = new Date();
  const minDate = new Date(2000, 0, 1); // 最早2000年1月
  const defaultDate = new Date(2015, 0, 1); // 默认2015年
  const rentMinDate = new Date(2020, 7, 1); // 租房最早2020年8月
  const rentDefaultDate = new Date(2020, 7, 1); // 租房默认2020年8月

  return (
    <div className="step-container">
      <h2 className="step-title">居住情况</h2>
      <p className="step-description">
        自有住房每年可获得1分，租房每年可获得0.5分。2020年8月之前默认算租房，2020年8月之后如有租房需填写时间。
      </p>

      <div className="form-section">
        <List>
          <List.Item
            extra={
              <Switch
                checked={data.housing.hasOwnHouse}
                onChange={handleHasOwnHouseChange}
              />
            }
          >
            是否有自有住房
          </List.Item>
        </List>
      </div>

      {data.housing.hasOwnHouse && (
        <div className="form-section">
          <div className="form-section-title">自有住房信息</div>
          <List>
            <List.Item
              onClick={() => setOwnHouseDateVisible(true)}
              extra={data.housing.ownHouseDate ? dayjs(data.housing.ownHouseDate).format('YYYY-MM') : '请选择'}
              arrow
            >
              房本下来时间
            </List.Item>
          </List>

          <div style={{ padding: '16px' }}>
            <div className="form-label">房产所在区域</div>
            <Radio.Group
              value={data.housing.ownHouseDistrict}
              onChange={handleOwnHouseDistrictChange}
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

          <div className="form-hint" style={{ padding: '0 16px' }}>
            提示：自有住房每满1年积1分，城六区外可能获得额外职住加分
          </div>
        </div>
      )}

      <div className="form-section">
        <div className="form-section-title">
          {data.housing.hasOwnHouse ? '买房前租房信息（可选）' : '租房信息'}
        </div>
        <List>
          <List.Item
            onClick={() => setRentDateVisible(true)}
            extra={data.housing.rentDate ? dayjs(data.housing.rentDate).format('YYYY-MM') : '无/未填写'}
            arrow
          >
            2020年8月后租房开始时间
          </List.Item>
        </List>

        <div className="form-hint" style={{ padding: '0 16px', marginTop: 12 }}>
          {data.housing.hasOwnHouse
            ? '提示：如果买房前（2020年8月后）有租房经历，请填写租房开始时间。2020年8月之前默认按租房计算。'
            : '提示：2020年8月之前默认按租房计算。如果2020年8月后开始租房，请填写实际租房开始时间。租房每满1年积0.5分。'
          }
        </div>
      </div>

      <DatePicker
        visible={ownHouseDateVisible}
        onClose={() => setOwnHouseDateVisible(false)}
        title="选择房本下来时间"
        precision="month"
        min={minDate}
        max={now}
        value={data.housing.ownHouseDate ? new Date(data.housing.ownHouseDate) : defaultDate}
        onConfirm={(value) => {
          handleOwnHouseDateChange(value);
          setOwnHouseDateVisible(false);
        }}
      />

      <DatePicker
        visible={rentDateVisible}
        onClose={() => setRentDateVisible(false)}
        title="选择2020年8月后租房开始时间"
        precision="month"
        min={rentMinDate}
        max={now}
        value={data.housing.rentDate ? new Date(data.housing.rentDate) : rentDefaultDate}
        onConfirm={(value) => {
          handleRentDateChange(value);
          setRentDateVisible(false);
        }}
      />
    </div>
  );
};

export default Housing;
