import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const ScoreChart = ({ userScores, scoreLines }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // 初始化echarts实例
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const years = userScores.map(item => item.year);
    const userScoreData = userScores.map(item => item.score.toFixed(2));
    const scoreLineData = scoreLines.map(item => item.score);

    const option = {
      grid: {
        left: '10%',
        right: '10%',
        top: '15%',
        bottom: '15%',
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e8e8e8',
        borderWidth: 1,
        textStyle: {
          color: '#333',
        },
        formatter: (params) => {
          const year = params[0].axisValue;
          let result = `<div style="font-weight: bold; margin-bottom: 8px;">${year}年</div>`;
          params.forEach(param => {
            result += `<div style="margin: 4px 0;">
              <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${param.color};margin-right:8px;"></span>
              ${param.seriesName}: <strong>${param.value}</strong>分
            </div>`;
          });
          return result;
        },
      },
      legend: {
        data: ['您的分数', '分数线'],
        top: '5%',
        textStyle: {
          fontSize: 13,
        },
      },
      xAxis: {
        type: 'category',
        data: years,
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#e8e8e8',
          },
        },
        axisLabel: {
          color: '#666',
          fontSize: 12,
        },
      },
      yAxis: {
        type: 'value',
        name: '积分',
        nameTextStyle: {
          color: '#666',
          fontSize: 12,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#666',
          fontSize: 12,
        },
        splitLine: {
          lineStyle: {
            color: '#f0f0f0',
            type: 'dashed',
          },
        },
      },
      series: [
        {
          name: '您的分数',
          type: 'line',
          data: userScoreData,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            color: '#667eea',
            width: 3,
          },
          itemStyle: {
            color: '#667eea',
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(102, 126, 234, 0.3)' },
                { offset: 1, color: 'rgba(102, 126, 234, 0.05)' },
              ],
            },
          },
        },
        {
          name: '分数线',
          type: 'line',
          data: scoreLineData,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            color: '#ff6b6b',
            width: 3,
            type: 'dashed',
          },
          itemStyle: {
            color: '#ff6b6b',
          },
        },
      ],
    };

    chartInstance.current.setOption(option);

    // 响应式处理
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [userScores, scoreLines]);

  return (
    <div
      ref={chartRef}
      style={{
        width: '100%',
        height: '300px',
      }}
    />
  );
};

export default ScoreChart;
