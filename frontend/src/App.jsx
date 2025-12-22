import React from 'react';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Templates from './pages/Templates';
import SellersUpload from './pages/SellersUpload';
import Mappings from './pages/Mappings';
import TemplateDetails from './pages/TemplateDetails';

import { StatsProvider } from "./context/StatsContext";

const App = () => {
  return (
    <Theme appearance="inherit" radius="large" scaling="100%">
      <StatsProvider>
      <Router>
        <main className="min-h-screen font-inter">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/template/:id" element={<TemplateDetails />} />
            <Route path="/upload" element={<SellersUpload />} />
            <Route path="/mappings" element={<Mappings />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            newestOnTop
            closeOnClick
            pauseOnHover
          />
        </main>
      </Router>
      </StatsProvider>
    </Theme>
  );
}

export default App;