import { useEffect, useState } from "react";
import AppointmentList from "./components/AppointmentList";
import Auth from "./components/Auth";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect (() => {
    const token = localStorage.getItem('token');

    if(token){
      setIsAuthenticated(true);
    }else {
    setIsAuthenticated(false);
    }
  },[]);

  const handleLogout = () =>{
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <div className="container">
      <h1>BarberSaaS Yönetim Paneli</h1>
      <hr/>
      
      {isAuthenticated ? (
        <>
        <button onClick={handleLogout} style={{float:'right',}}>Cikis Yap</button>
        <AppointmentList/>
        </>
      ) : (
        <Auth onLoginSuccess = {() => setIsAuthenticated(true)}/>
      )}

    </div>
  );
}

export default App;
