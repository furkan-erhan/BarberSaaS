import AppointmentList from "./components/AppointmentList";

function App() {
  return (
    <div className="App">
      <header style={{ textAlign: "center", margin: "20px" }}>
        <h1>BarberSaaS Yönetim Paneli</h1>
      </header>
      <main>
        <AppointmentList />
      </main>
    </div>
  );
}

export default App;
