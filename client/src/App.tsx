import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import AppointmentList from "./components/AppointmentList";
import BarberShopList from "./components/BarberShopList"; 
import BookingPage from "./components/BookingPage";
import Auth from "./components/Auth";
import { logout } from "./services/api";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));


  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', checkAuth); 
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const onLogout = () => {
    logout(); 
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="main-layout">
        {isAuthenticated && (
          <nav className="navbar">
            <div className="nav-brand">
              <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>BarberSaaS</span>
              </Link>
            </div>
            
            <div className="nav-links">
              <Link to="/shops" className="nav-item"> Dükkanlar</Link>
              <Link to="/my-appointments" className="nav-item">Randevularım</Link>
              <button onClick={onLogout} className="logout-btn">Çıkış Yap</button>
            </div>
          </nav>
        )}

        <main className="content">
          <Routes>

            <Route path="/login" element={
              !isAuthenticated ? <Auth onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" />
            } />

            <Route path="/" element={
              isAuthenticated ? <AppointmentList /> : <Navigate to="/login" />
            } />

            <Route path="/my-appointments" element={
              isAuthenticated ? <AppointmentList /> : <Navigate to="/login" />
            } />

            <Route path ="/shops" element={
              isAuthenticated ? <BarberShopList /> : <Navigate to="login"/>
            } />

            <Route path="/book/:shopId" element={
              isAuthenticated ? <BookingPage/> : <Navigate to="/login" /> 
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;