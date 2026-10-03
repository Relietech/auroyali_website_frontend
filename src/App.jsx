import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { SmoothScroll } from './components/common/SmoothScroll';

export function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <AppRoutes />
      </SmoothScroll>
    </BrowserRouter>
  );
}

export default App;
