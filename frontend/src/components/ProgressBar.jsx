import React from 'react';
import { Progress, Tooltip } from 'antd';

/**
 * A styled progress bar component with target indicator
 * 
 * @param {number} percent - Current percentage value (0-100)
 * @param {number} target - Optional target percentage (0-100)
 * @param {string} color - Primary color of the progress bar
 * @param {string} size - Size of the progress bar ('small', 'default', or 'large')
 * @param {boolean} showInfo - Whether to display the percentage text
 * @param {string} status - Status of the progress bar ('normal', 'exception', 'active', 'success')
 * @param {object} style - Additional inline styles
 * @returns {JSX.Element} Progress component
 */
const ProgressBar = ({
  percent,
  target,
  color = '#1890ff',
  size = 'default',
  showInfo = true,
  status = 'normal',
  style = {},
  ...props
}) => {

  // Determine height based on size
  const heightMap = {
    small: 6,
    default: 8,
    large: 12
  };

  const height = heightMap[size] || heightMap.default;
  
  // Custom wrapper style to position the target marker
  const wrapperStyle = {
    position: 'relative',
    ...style
  };

  // Calculate target marker position
  const targetPosition = {
    left: `${target}%`,
    top: '50%',
    transform: 'translateY(-50%)',
    position: 'absolute',
    width: '2px',
    height: height * 2,
    backgroundColor: '#f5222d',
    zIndex: 1
  };

  return (
    <div style={wrapperStyle}>
      {target > 0 && target <= 100 && (
        <Tooltip title={`Target: ${target}%`}>
          <div style={targetPosition} />
        </Tooltip>
      )}
      <Progress
        percent={percent}
        status={status}
        showInfo={showInfo}
        strokeColor={color}
        size={size === 'large' ? 'default' : size}
        strokeWidth={height}
        {...props}
      />
    </div>
  );
};

export default ProgressBar; 