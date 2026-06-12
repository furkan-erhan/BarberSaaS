import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { ILoginCredentials, IRegisterCredentials } from "../types/auth";

// ─── Props ────────────────────────────────────────────────────────────
interface AuthProps {
  onLoginSuccess: () => void;
}

// ─── Component ────────────────────────────────────────────────────────
const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  // UI-only state: which form to show
  const [mode, setMode] = useState<"login" | "register">("login");

  // ── Callback stubs — business logic lives in the parent/service layer ──
  const handleLogin = (_data: ILoginCredentials) => {
    // Parent or a custom hook will call the API and invoke onLoginSuccess
    onLoginSuccess();
  };

  const handleRegister = (_data: IRegisterCredentials) => {
    // Parent or a custom hook will call the API
    setMode("login");
  };

  return (
    <AuthLayout
      panelTitle={
        mode === "login"
          ? "Zamanın En İyi\nBerberine Kavuş."
          : "Premium Berber\nDeneyimini Keşfet."
      }
      panelSubtitle={
        mode === "login"
          ? "Hesabınıza giriş yapın ve en yakın berber dükkanına anında randevu alın."
          : "Ücretsiz hesap oluşturun, öne çıkan berberleri keşfedin."
      }
    >
      {mode === "login" ? (
        <LoginForm
          onSubmit={handleLogin}
          onSwitchToRegister={() => setMode("register")}
        />
      ) : (
        <RegisterForm
          onSubmit={handleRegister}
          onSwitchToLogin={() => setMode("login")}
        />
      )}
    </AuthLayout>
  );
};

export default Auth;
