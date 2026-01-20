import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Admin from './pages/Admin';
import PostDetail from './pages/PostDetail';
import ScrollToTop from './components/ScrollToTop';

const App: React.FC = () => {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/post/:id" element={<PostDetail />} />
      </Routes>
    </Layout>
  );
};

export default App;
