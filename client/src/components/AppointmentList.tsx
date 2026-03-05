import { useEffect, useState } from "react";
import api from "../services/api";
import { IAppointment } from "../types/appointment";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api
      .get<IAppointment[]>("Appointments")
      .then((response) => {
        setAppointments(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Appointmentlari cekerken hata oldu : ", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Randevu Listesi</h2>
      <table
        border={1}
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#0f638a" }}>
            <th>Zaman</th>
            <th>Berber Dukkani</th>
            <th>Fiyat</th>
            <th>Durum</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((app) => (
            <tr key={app.id}>
              <td>{new Date(app.startTime).toLocaleDateString("tr-TR")}</td>
              <td>
                <strong>{app.barberShopName}</strong>
              </td>
              <td>{app.price}</td>
              <td>{app.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentList;
