import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Generate dummy text for testing
const generateDummyText = (frameName: string, count: number = 200) => {
  const lines = [];
  for (let i = 1; i <= count; i++) {
    lines.push(`${frameName} - Line ${i}`);
  }
  return lines.join('\n');
};

const SimpleTest: React.FC = () => {
  return (
    <div style={{
      height: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      margin: 0,
      padding: 0
    }}>
      {/* Actual Header Component */}
      <Header />

      {/* Middle Frame - Flexible height */}
      <div style={{
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: '20px',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}>
        <h2>MIDDLE FRAME - Flexible Height with Scroll</h2>
        <div style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          fontFamily: 'monospace',
          fontSize: '12px',
          lineHeight: '1.4'
        }}>
          {generateDummyText('Middle Frame')}
        </div>
      </div>

      {/* Actual Footer Component */}
      <Footer />
    </div>
  );
};

export default SimpleTest;