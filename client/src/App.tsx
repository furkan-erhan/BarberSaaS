import { useEffect } from "react";
import api from "./services/api"; // Bizim yazdığımız santral

function App() {
  useEffect(() => {
    // Başına slash koymadık, böylece http://localhost:5199/api/Appointments oldu ✅
    api
      .get("Appointments") // Başında '/' yok! Böylece baseURL ile birleşir. ✅
      .then((response) => {
        console.log("Aga veriler sonunda geldi! ✅", response.data);
      })
      .catch((error) => {
        console.error("Aga yine bir sorun var: ", error);
      });
  }, []);

  return (
    <div>
      <h1>BarberSaaS Test Sayfası</h1>
      <p>Konsolu (F12) kontrol et kanka!</p>
    </div>
  );
}

export default App;
