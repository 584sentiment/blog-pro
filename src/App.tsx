import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Admin from './pages/Admin';
import Login from './pages/Login';
import ScrollToTop from './components/ScrollToTop';
import HashScrollHandler from './components/HashScrollHandler';
import { Toaster } from 'sonner';
import { api } from './services/api';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!api.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Layout>
      <Toaster position="top-center" richColors />
      <ScrollToTop />
      <HashScrollHandler />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
