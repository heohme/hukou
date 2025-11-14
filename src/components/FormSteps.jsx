import React, { useState } from 'react';
import { Steps, Button, ProgressBar } from 'antd-mobile';
import BasicInfo from './steps/BasicInfo';
import Education from './steps/Education';
import Housing from './steps/Housing';
import JobHousing from './steps/JobHousing';
import Innovation from './steps/Innovation';
import Tax from './steps/Tax';
import Honor from './steps/Honor';
import Confirm from './steps/Confirm';
import './FormSteps.css';

const { Step } = Steps;

const FormSteps = ({ onComplete }) => {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({
    // 基础信息
    birthDate: null,
    socialSecurityStartDate: null,
    // 学历
    education: 'bachelor',
    // 居住
    housing: {
      hasOwnHouse: false,
      ownHouseDate: null,
      ownHouseDistrict: 'outside', // outside | inside
      rentDate: null,
      rentDistrict: 'outside',
    },
    // 职住
    jobHousing: {
      isOutsideSixDistricts: false,
      jobDistrict: 'inside',
      housingDistrict: 'inside',
      startDate: null,
    },
    // 创新创业
    innovation: {
      inventionPatents: 0,
      utilityPatents: 0,
    },
    // 纳税
    tax: {
      hasHighIncome: false,
    },
    // 荣誉与守法
    honor: {
      hasProvincialHonor: false,
      hasBraveAct: false,
    },
    law: {
      hasViolation: false,
      violationCount: 0,
    },
  });

  const steps = [
    { title: '基础信息', component: BasicInfo },
    { title: '学历', component: Education },
    { title: '居住情况', component: Housing },
    { title: '职住匹配', component: JobHousing },
    { title: '创新创业', component: Innovation },
    { title: '纳税情况', component: Tax },
    { title: '荣誉守法', component: Honor },
    { title: '确认提交', component: Confirm },
  ];

  const updateFormData = (data) => {
    setFormData({ ...formData, ...data });
  };

  const next = () => {
    if (current < steps.length - 1) {
      setCurrent(current + 1);
    } else {
      // 完成表单，提交数据
      onComplete(formData);
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const CurrentStepComponent = steps[current].component;
  const progress = ((current + 1) / steps.length) * 100;

  return (
    <div className="form-steps-container">
      <div className="steps-header">
        <div className="steps-progress">
          <ProgressBar percent={progress} style={{ '--fill-color': '#667eea' }} />
        </div>
        <div className="steps-indicator">
          <span className="step-current">{current + 1}</span>
          <span className="step-divider">/</span>
          <span className="step-total">{steps.length}</span>
          <span className="step-title">{steps[current].title}</span>
        </div>
      </div>

      <div className="steps-content">
        <CurrentStepComponent
          data={formData}
          updateData={updateFormData}
        />
      </div>

      <div className="steps-actions">
        {current > 0 && (
          <Button
            onClick={prev}
            className="btn-prev"
            fill="outline"
            color="primary"
          >
            上一步
          </Button>
        )}
        <Button
          onClick={next}
          className="btn-next"
          color="primary"
          style={{ flex: current > 0 ? 1 : 'auto' }}
        >
          {current === steps.length - 1 ? '完成计算' : '下一步'}
        </Button>
      </div>
    </div>
  );
};

export default FormSteps;
