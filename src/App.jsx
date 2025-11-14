import React, { useState, useEffect } from 'react';
import Welcome from './components/Welcome';
import FormSteps from './components/FormSteps';
import Result from './components/Result';
import './App.css';

const APP_STAGES = {
  WELCOME: 'welcome',
  FORM: 'form',
  RESULT: 'result',
};

function App() {
  const [stage, setStage] = useState(APP_STAGES.WELCOME);
  const [userData, setUserData] = useState(null);

  // 从localStorage加载数据
  useEffect(() => {
    const savedData = localStorage.getItem('beijing_jifen_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setUserData(parsed);
      } catch (e) {
        console.error('Failed to parse saved data', e);
      }
    }
  }, []);

  // 保存数据到localStorage
  const saveData = (data) => {
    setUserData(data);
    localStorage.setItem('beijing_jifen_data', JSON.stringify(data));
  };

  const handleStart = () => {
    setStage(APP_STAGES.FORM);
  };

  const handleFormComplete = (data) => {
    saveData(data);
    setStage(APP_STAGES.RESULT);
  };

  const handleReset = () => {
    // 可以选择是否清除localStorage
    // localStorage.removeItem('beijing_jifen_data');
    setStage(APP_STAGES.WELCOME);
  };

  return (
    <div className="app">
      {stage === APP_STAGES.WELCOME && (
        <Welcome onStart={handleStart} />
      )}
      {stage === APP_STAGES.FORM && (
        <FormSteps onComplete={handleFormComplete} />
      )}
      {stage === APP_STAGES.RESULT && userData && (
        <Result userData={userData} onReset={handleReset} />
      )}
    </div>
  );
}

export default App;
