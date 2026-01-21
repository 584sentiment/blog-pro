import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Admin from './pages/Admin';
import PostDetail from './pages/PostDetail';
import ScrollToTop from './components/ScrollToTop';
import HashScrollHandler from './components/HashScrollHandler';

const App: React.FC = () => {
  return (
    <Layout>
      <ScrollToTop />
      <HashScrollHandler />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/post/:id" element={<PostDetail />} />
      </Routes>
    </Layout>
  );
};

export default App;
