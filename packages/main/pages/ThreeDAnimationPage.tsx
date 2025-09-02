import React from 'react';

const ThreeDAnimationPage: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <iframe
          src="/3danimation/index.html"
          title="3D Animation"
          style={{ border: '0', width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};

export default ThreeDAnimationPage;
