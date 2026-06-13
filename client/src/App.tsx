import { useState, useEffect } from "react";
import Lenis from "lenis";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Store,
  ShieldCheck,
  Scissors,
  Sparkles,
  MessageSquare,
  HeartPulse,
} from "lucide-react";

import LandingPage from "./components/LandingPage";
import MainLayout from "./components/MainLayout";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ShopDiscoveryPage from "./components/ShopDiscoveryPage";
import BookingFlowPage, { TimeSlot } from "./components/BookingFlowPage";
import CustomerDashboard from "./components/CustomerDashboard";
import AppointmentsPage from "./components/AppointmentsPage";
import BarberDashboard from "./components/BarberDashboard";
import AdminDashboard from "./components/AdminDashboard";
import AIStyleRecommendation from "./components/AIStyleRecommendation";
import AIHairClinic from "./components/AIHairClinic";
import CommunityForum from "./components/CommunityForum";
import CursorEffects from "./components/CursorEffects";

import { IBarberShop } from "./types/barberShop";
import { IEmployee } from "./types/employee";
import { IAppointment } from "./types/appointment";
import { ILoginCredentials, IRegisterCredentials } from "./types/auth";

// ── Mock Data ──────────────────────────────────────────────────────────
const MOCK_SHOPS: IBarberShop[] = [
  { id: "1", name: "Barber Kaya", slug: "barber-kaya", phoneNumber: "+90 555 111 2233", address: "Beşiktaş, İstanbul", price: 150, latitude: 41.0422, longitude: 29.0082, rating: 4.8, reviewCount: 312 },
  { id: "2", name: "Classic Cut Studio", slug: "classic-cut", phoneNumber: "+90 532 234 5678", address: "Kadıköy, İstanbul", price: 200, latitude: 40.9901, longitude: 29.0280, rating: 4.6, reviewCount: 187 },
  { id: "3", name: "The Razor's Edge", slug: "razors-edge", phoneNumber: "+90 546 345 6789", address: "Şişli, İstanbul", price: 120, latitude: 41.0602, longitude: 28.9877, rating: 4.9, reviewCount: 524 },
  { id: "4", name: "Gentleman's Blade", slug: "gentlemans-blade", phoneNumber: "+90 533 456 7890", address: "Üsküdar, İstanbul", price: 180, latitude: 41.0264, longitude: 29.0151, rating: 4.5, reviewCount: 98 },
  { id: "5", name: "Urban Barber Co.", slug: "urban-barber", phoneNumber: "+90 505 567 8901", address: "Bakırköy, İstanbul", price: 160, latitude: 40.9782, longitude: 28.7946, rating: 4.7, reviewCount: 256 },
  { id: "6", name: "Royal Cuts", slug: "royal-cuts", phoneNumber: "+90 551 678 9012", address: "Ataşehir, İstanbul", price: 250, latitude: 40.9847, longitude: 29.1064, rating: 5.0, reviewCount: 441 },
];


const MOCK_EMPLOYEES: IEmployee[] = [
  { id: "e1", firstName: "Mehmet", lastName: "Yılmaz", barberShopId: "1" },
  { id: "e2", firstName: "Ali", lastName: "Çelik", barberShopId: "1" },
  { id: "e3", firstName: "Burak", lastName: "Demir", barberShopId: "1" },
  { id: "e4", firstName: "Emre", lastName: "Kara", barberShopId: "1" },
];

const MOCK_SLOTS: TimeSlot[] = [
  { time: "09:00", isAvailable: true },
  { time: "09:40", isAvailable: false },
  { time: "10:20", isAvailable: true },
  { time: "11:00", isAvailable: true },
  { time: "11:40", isAvailable: false },
  { time: "12:20", isAvailable: true },
  { time: "13:00", isAvailable: false },
  { time: "13:40", isAvailable: true },
  { time: "14:20", isAvailable: true },
  { time: "15:00", isAvailable: true },
  { time: "15:40", isAvailable: false },
  { time: "16:20", isAvailable: true },
  { time: "17:00", isAvailable: true },
  { time: "17:40", isAvailable: false },
];

const today = new Date().toISOString().split("T")[0];

const MOCK_UPCOMING: IAppointment[] = [
  {
    id: "a1",
    barberShopId: "1",
    barberShopName: "Barber Kaya",
    customerId: "u1",
    employeeId: "e1",
    startTime: new Date(Date.now() + 86400000).toISOString(),
    endTime: new Date(Date.now() + 86400000 + 2400000).toISOString(),
    status: "Confirmed",
    price: 150,
  },
  {
    id: "a2",
    barberShopId: "2",
    barberShopName: "Classic Cut Studio",
    customerId: "u1",
    employeeId: "e2",
    startTime: new Date(Date.now() + 172800000).toISOString(),
    endTime: new Date(Date.now() + 172800000 + 2400000).toISOString(),
    status: "Pending",
    price: 200,
  },
];

const MOCK_PAST: IAppointment[] = [
  {
    id: "a3",
    barberShopId: "1",
    barberShopName: "Barber Kaya",
    customerId: "u1",
    employeeId: "e1",
    startTime: new Date(Date.now() - 172800000).toISOString(),
    endTime: new Date(Date.now() - 172800000 + 2400000).toISOString(),
    status: "Completed",
    price: 150,
  },
  {
    id: "a4",
    barberShopId: "3",
    barberShopName: "The Razor's Edge",
    customerId: "u1",
    employeeId: "e3",
    startTime: new Date(Date.now() - 604800000).toISOString(),
    endTime: new Date(Date.now() - 604800000 + 2400000).toISOString(),
    status: "Cancelled",
    price: 120,
  },
];

const MOCK_BARBER_APPTS: IAppointment[] = [
  {
    id: "b1",
    barberShopId: "1",
    barberShopName: "Barber Kaya",
    customerId: "cust-a1b2",
    employeeId: "e1",
    startTime: `${today}T09:00:00`,
    endTime: `${today}T09:40:00`,
    status: "Confirmed",
    price: 150,
  },
  {
    id: "b2",
    barberShopId: "1",
    barberShopName: "Barber Kaya",
    customerId: "cust-c3d4",
    employeeId: "e1",
    startTime: `${today}T10:20:00`,
    endTime: `${today}T11:00:00`,
    status: "Pending",
    price: 200,
  },
  {
    id: "b3",
    barberShopId: "1",
    barberShopName: "Barber Kaya",
    customerId: "cust-e5f6",
    employeeId: "e1",
    startTime: `${today}T14:20:00`,
    endTime: `${today}T15:00:00`,
    status: "Completed",
    price: 150,
  },
];

const MOCK_ADMIN_USERS = [
  { id: "u1", name: "Ahmet Kaya", email: "ahmet@email.com", role: "Customer", barberShopId: null },
  { id: "u2", name: "Mehmet Yılmaz", email: "mehmet@email.com", role: "Barber", barberShopId: "1" },
  { id: "u3", name: "Selin Demir", email: "selin@email.com", role: "Customer", barberShopId: null },
  { id: "u4", name: "Can Öztürk", email: "can@email.com", role: "Admin", barberShopId: null },
  { id: "u5", name: "Zeynep Arslan", email: "zeynep@email.com", role: "Customer", barberShopId: null },
];

const NAV_ITEMS_CUSTOMER = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Randevularım", path: "/appointments", icon: CalendarDays },
  { label: "Dükkanlar", path: "/shops", icon: Store },
  { label: "AI Stil", path: "/ai-recommendation", icon: Sparkles },
  { label: "AI Klinik", path: "/ai-clinic", icon: HeartPulse },
  { label: "Topluluk", path: "/forum", icon: MessageSquare },
];

const NAV_ITEMS_BARBER = [
  { label: "Günlük Program", path: "/barber", icon: Scissors },
];

const NAV_ITEMS_ADMIN = [
  { label: "Yönetim Paneli", path: "/admin", icon: ShieldCheck },
];

// ── Auth Shell ─────────────────────────────────────────────────────────
function AuthShell({
  onLoginSuccess,
}: {
  onLoginSuccess: () => void;
}) {
  const [view, setView] = useState<"login" | "register">("login");

  const handleLogin = (_creds: ILoginCredentials) => {
    localStorage.setItem("token", "mock-token");
    onLoginSuccess();
  };

  const handleRegister = (_creds: IRegisterCredentials) => {
    localStorage.setItem("token", "mock-token");
    onLoginSuccess();
  };

  if (view === "register") {
    return (
      <RegisterPage
        onSubmit={handleRegister}
        onSwitchToLogin={() => setView("login")}
      />
    );
  }
  return (
    <LoginPage
      onSubmit={handleLogin}
      onSwitchToRegister={() => setView("register")}
    />
  );
}

// ── Protected Layout ───────────────────────────────────────────────────
function AppShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <MainLayout
      activePath={location.pathname}
      onNavigate={navigate}
      onLogout={handleLogout}
      user={{ name: "Ahmet Kaya", email: "ahmet@email.com", role: "Müşteri" }}
      navItems={NAV_ITEMS_CUSTOMER}
    >
      {children}
    </MainLayout>
  );
}

// ── Page: Shops ─────────────────────────────────────────────────────
function ShopsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  return (
    <ShopDiscoveryPage
      shops={MOCK_SHOPS}
      onBookShop={(id) => navigate(`/book/${id}`)}
      searchQuery={query}
      onSearchChange={setQuery}
    />
  );
}

// ── Page: Booking ────────────────────────────────────────────────────
function BookingPage() {
  const navigate = useNavigate();
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  return (
    <BookingFlowPage
      shop={MOCK_SHOPS[0]}
      employees={MOCK_EMPLOYEES}
      slots={MOCK_SLOTS}
      selectedEmployeeId={selectedEmployee}
      selectedDate={selectedDate}
      selectedTime={selectedTime}
      onSelectEmployee={setSelectedEmployee}
      onSelectDate={setSelectedDate}
      onSelectTime={setSelectedTime}
      onSubmitBooking={() => navigate("/")}
      onBackToShops={() => navigate("/shops")}
    />
  );
}

// ── App Root ──────────────────────────────────────────────────────────
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [upcoming, setUpcoming] = useState<IAppointment[]>(MOCK_UPCOMING);
  const [past, setPast] = useState<IAppointment[]>(MOCK_PAST);

  const handleCancelAppointment = (id: string) => {
    const appt = upcoming.find((a) => a.id === id);
    if (appt) {
      setUpcoming((prev) => prev.filter((a) => a.id !== id));
      setPast((prev) => [{ ...appt, status: "Cancelled" }, ...prev]);
    }
  };

  const handleLoginSuccess = () => setIsAuthenticated(true);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.05,
      wheelMultiplier: 1.15,
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });
    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      (window as any).lenis = undefined;
    };
  }, []);

  return (
    <Router>
      <CursorEffects />
      <Routes>
        {/* Auth */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <AuthShell onLoginSuccess={handleLoginSuccess} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Landing Page */}
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <LandingPage />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* Customer Dashboard */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <AppShell>
                <CustomerDashboard
                  upcomingAppointments={upcoming}
                  pastAppointments={past}
                  onCancelAppointment={handleCancelAppointment}
                  onBookNewShop={() => window.location.href = "/shops"}
                />
              </AppShell>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Appointments */}
        <Route
          path="/appointments"
          element={
            isAuthenticated ? (
              <AppShell>
                <AppointmentsPage
                  upcomingAppointments={upcoming}
                  pastAppointments={past}
                  onCancelAppointment={handleCancelAppointment}
                />
              </AppShell>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Shops Discovery */}
        <Route
          path="/shops"
          element={
            isAuthenticated ? (
              <AppShell>
                <ShopsPage />
              </AppShell>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Booking Flow */}
        <Route
          path="/book/:shopId"
          element={
            isAuthenticated ? (
              <AppShell>
                <BookingPage />
              </AppShell>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Barber Dashboard */}
        <Route
          path="/barber"
          element={
            isAuthenticated ? (
              <AppShell>
                <BarberDashboard
                  appointments={MOCK_BARBER_APPTS}
                  currentDate={today}
                  onCompleteAppointment={() => { }}
                  onCancelAppointment={() => { }}
                />
              </AppShell>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            isAuthenticated ? (
              <AppShell>
                <AdminDashboard
                  shops={MOCK_SHOPS}
                  users={MOCK_ADMIN_USERS}
                  onAddShop={() => { }}
                  onDeleteShop={() => { }}
                  onAssignRole={() => { }}
                />
              </AppShell>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* AI Style Recommendation */}
        <Route
          path="/ai-recommendation"
          element={
            isAuthenticated ? (
              <AppShell>
                <AIStyleRecommendation />
              </AppShell>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* AI Hair Clinic */}
        <Route
          path="/ai-clinic"
          element={
            isAuthenticated ? (
              <AppShell>
                <AIHairClinic />
              </AppShell>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Community Forum */}
        <Route
          path="/forum"
          element={
            isAuthenticated ? (
              <AppShell>
                <CommunityForum />
              </AppShell>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;