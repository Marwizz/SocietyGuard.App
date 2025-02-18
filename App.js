import React from 'react';
import { GuardProvider } from './src/GuardContext';
import MainNavigation from './src/navigation/MainNavigation';


export default function App() {
  return (
    <GuardProvider>
    <MainNavigation />
  </GuardProvider>
  );
}