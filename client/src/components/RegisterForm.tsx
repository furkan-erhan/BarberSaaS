import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Loader2 } from "lucide-react";
import { IRegisterCredentials } from "../types/auth";

// ─── Props ────────────────────────────────────────────────────────────
interface RegisterFormProps {
  onSubmit: (data: IRegisterCredentials) => void;
  onSwitchToLogin: () => void;
  isLoading?: boolean;
  error?: string | null;
}

// ─── Reusable input field ─────────────────────────────────────────────
interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  rightSlot?: React.ReactNode;
  autoComplete?: string;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  id, label, type, value, onChange, icon, rightSlot, autoComplete, placeholder,
}) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-xs font-medium tracking-widest uppercase text-[#a1a1aa]">
      {label}
    </label>
    <div className="relative flex items-center">
      <span className="absolute left-3.5 text-[#52525b] pointer-events-none">{icon}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="
          w-full bg-[#111113] border border-[#2a2a2e] rounded-lg
          pl-10 pr-10 py-3 text-sm text-[#f4f4f5] placeholder:text-[#3f3f46]
          transition-all duration-200
          hover:border-[#3f3f46]
          focus:outline-none focus:border-[#c5a880] focus:bg-[#13120e]
          focus:shadow-[0_0_0_3px_rgba(197,168,128,0.08)]
        "
      />
      {rightSlot && (
        <span className="absolute right-3 text-[#52525b]">{rightSlot}</span>
      )}
    </div>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────
const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  onSwitchToLogin,
  isLoading = false,
  error = null,
}) => {
  const [firstName, setFirstName]             = useState("");
  const [lastName, setLastName]               = useState("");
  const [email, setEmail]                     = useState("");
  const [phoneNumber, setPhoneNumber]         = useState("");
  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass]               = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ firstName, lastName, email, phoneNumber, password, confirmPassword });
  };

  return (
    <div>
      {/* Heading */}
      <div className="mb-8">
        <p className="text-[#c5a880] text-xs tracking-[0.2em] uppercase font-medium mb-2">
          Aramıza Katıl
        </p>
        <h2 className="font-serif text-[#f4f4f5] text-3xl font-semibold leading-tight">
          Hesap Oluştur
        </h2>
        <p className="mt-2 text-[#52525b] text-sm">
          Zaten hesabınız var mı?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-[#c5a880] hover:text-[#d4a96a] transition-colors duration-200 font-medium underline underline-offset-2"
          >
            Giriş yapın
          </button>
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-[#ef4444]/30 bg-[#ef4444]/[0.06] px-4 py-3">
          <span className="mt-0.5 w-2 h-2 rounded-full bg-[#ef4444] shrink-0" />
          <p className="text-sm text-[#f4f4f5]">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <InputField
            id="reg-firstname"
            label="Ad"
            type="text"
            value={firstName}
            onChange={setFirstName}
            autoComplete="given-name"
            placeholder="Ahmet"
            icon={<User size={16} />}
          />
          <InputField
            id="reg-lastname"
            label="Soyad"
            type="text"
            value={lastName}
            onChange={setLastName}
            autoComplete="family-name"
            placeholder="Yılmaz"
            icon={<User size={16} />}
          />
        </div>

        <InputField
          id="reg-email"
          label="E-posta"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          placeholder="ornek@email.com"
          icon={<Mail size={16} />}
        />

        <InputField
          id="reg-phone"
          label="Telefon"
          type="tel"
          value={phoneNumber}
          onChange={setPhoneNumber}
          autoComplete="tel"
          placeholder="+90 555 000 00 00"
          icon={<Phone size={16} />}
        />

        <InputField
          id="reg-password"
          label="Şifre"
          type={showPass ? "text" : "password"}
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          placeholder="En az 8 karakter"
          icon={<Lock size={16} />}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPass((p) => !p)}
              className="hover:text-[#c5a880] transition-colors duration-150"
              aria-label={showPass ? "Şifreyi gizle" : "Şifreyi göster"}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        <InputField
          id="reg-confirm-password"
          label="Şifre Tekrar"
          type={showConfirm ? "text" : "password"}
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          placeholder="Şifreyi tekrar girin"
          icon={<Lock size={16} />}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              className="hover:text-[#c5a880] transition-colors duration-150"
              aria-label={showConfirm ? "Gizle" : "Göster"}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        {/* CTA */}
        <button
          id="register-submit"
          type="submit"
          disabled={isLoading}
          className="
            w-full flex items-center justify-center gap-2 mt-2
            rounded-lg py-3.5 px-6 text-sm font-semibold tracking-wide
            bg-[#c5a880] text-[#09090b]
            transition-all duration-200
            hover:bg-[#d4a96a] hover:scale-[1.015] hover:shadow-[0_8px_24px_rgba(197,168,128,0.25)]
            active:scale-[0.99]
            disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
          "
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              Hesap Oluştur
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-[#3f3f46] leading-relaxed">
        Kayıt olarak{" "}
        <span className="text-[#52525b] hover:text-[#c5a880] cursor-pointer transition-colors">Kullanım Koşullarını</span>
        {" "}kabul etmiş olursunuz.
      </p>
    </div>
  );
};

export default RegisterForm;
