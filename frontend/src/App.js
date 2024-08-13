import React, { useState } from 'react';
import './App.css';
import styled from 'styled-components';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeTabPage from './pages/HomeTabPage';
import MoreInfoPage from './pages/MoreInfoPage';
import TestPage from './pages/TestPage';
import BusinessTabPage from './pages/BusinessTabPage';
// import HomeTab from './components/pages/HomeTab';
// import HowToBuildTab from './components/pages/HowToBuildTab';
// import BusinessGuideTab from './components/pages/BusinessGuideTab';
// import TabNavigator from './components/TabNavigator';
// import bedrockLogo from './assets/bedrock-logo.jpeg';

const AppContainer = styled.div`
  position: relative;
`;

const PoweredByContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
`;

const PoweredByText = styled.span`
color: rgba(238, 238, 238, .6);
font-size: 14.5px;
font-weight: 700;
margin-right: .8rem;
`;

const App = () => {

  const [activeTab, setActiveTab] = useState('homeTab');
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeTabPage />} />
        <Route path="/business" element={<BusinessTabPage />} />
        <Route path="/info" element={<MoreInfoPage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
    // <AppContainer>
    //   <PoweredByContainer>
    //     <PoweredByText>Powered by Amazon Bedrock</PoweredByText>
    //     <img src={bedrockLogo} alt="Bedrock Logo" width="40" height="40" />
    //   </PoweredByContainer>
    //   <div className="site-title" onClick={() => handleTabChange('homeTab')}>
    //     Bedrock AI Tutor
    //   </div>
    //   <TabNavigator activeTab={activeTab} onTabChange={handleTabChange} />
    //   <div>
    //     {activeTab === 'homeTab' && <HomeTab />}
    //     {activeTab === 'roleTab' && <BusinessGuideTab />}
    //     {activeTab === 'moreInfoTab' && <HowToBuildTab />}
    //   </div>
    // </AppContainer>
  );
}

export default App;   
