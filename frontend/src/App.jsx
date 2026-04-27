import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import MapPage from './pages/MapPage';
import CrimeList from './pages/CrimeList';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-background">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const Layout = ({ children }) => {
  const { user } = useAuth();
  return (
    <div className="flex min-h-screen bg-background">
      {user && <Sidebar />}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Layout><Dashboard /></Layout>
            </PrivateRoute>
          } />
          <Route path="/analytics" element={
            <PrivateRoute>
              <Layout><Analytics /></Layout>
            </PrivateRoute>
          } />
          <Route path="/map" element={
            <PrivateRoute>
              <Layout><MapPage /></Layout>
            </PrivateRoute>
          } />
          <Route path="/crimes" element={
            <PrivateRoute>
              <Layout><CrimeList /></Layout>
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
