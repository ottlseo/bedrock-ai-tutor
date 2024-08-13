// TabsBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const TabBar = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 3.5rem 1rem 3.5rem;
  padding: 4px;
  border-bottom: 3px solid rgba(238, 238, 238, 0.2);
`;

const TabButton = styled.button`
  background-color: transparent;
  font-size: 1.02rem;
  font-weight: ${props => props.isActive ? 900 : 600};
  color: ${props => props.isActive ? 'white' : 'gray'};
  border: none;
  outline: none;
  cursor: pointer;
  padding: .75rem 3rem;
  transition: background-color 0.3s ease;
  margin-right: 10px;

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    background-color: rgba(238, 238, 238, 0.3);
  }
`;

const TabNavigator = ({ activeTab, onTabChange }) => {
  const handleTabClick = (tabName) => {
    onTabChange(tabName);
  };

  return (
    <TabBar>
      <Link to="/">
        <TabButton
          isActive={activeTab === 'homeTab'}
          onClick={() => handleTabClick('homeTab')}
        >
          틀린 문법 교정
        </TabButton>
      </Link>
      <Link to="/business">
        <TabButton
          isActive={activeTab === 'roleTab'}
          onClick={() => handleTabClick('roleTab')}
        >
          비즈니스 영어 교정
        </TabButton>
      </Link>
      <Link to="/info">
        <TabButton
          isActive={activeTab === 'moreInfoTab'}
          onClick={() => handleTabClick('moreInfoTab')}
        >
          HOW TO BUILD
        </TabButton>
      </Link>
      <Link to="/test">
        <TabButton
          isActive={activeTab === ''}
          onClick={() => handleTabClick('')}
        >
          ADMIN
        </TabButton>
      </Link>
    </TabBar>
  );
};

export default TabNavigator;
