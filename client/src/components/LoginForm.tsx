import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { ILoginCredentials } from "../types/auth";

// ─── Props ───────────────────────────────────────────────────────────
interface LoginFormProps {
  onSubmit: (data: ILoginCredentials) => void;
  onSwitchToRegister: () => void;
  isLoading?: boolean;
  error?: string | null;
}

// ─── Reusable input row ───────────────────────────────────────────────
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
      {/* Left icon */}
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

      {/* Right slot (password toggle etc.) */}
      {rightSlot && (
        <span className="absolute right-3 text-[#52525b]">{rightSlot}</span>
      )}
    </div>
  </div>
);

// ─── Component ───────────────────────────────────────────────────────
const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onSwitchToRegister,
  isLoading = false,
  error = null,
}) => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <div>
      {/* Heading */}
      <div className="mb-8">
        <p className="text-[#c5a880] text-xs tracking-[0.2em] uppercase font-medium mb-2">
          Hoş Geldiniz
        </p>
        <h2 className="font-serif text-[#f4f4f5] text-3xl font-semibold leading-tight">
          Giriş Yapın
        </h2>
        <p className="mt-2 text-[#52525b] text-sm">
          Hesabınız yok mu?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-[#c5a880] hover:text-[#d4a96a] transition-colors duration-200 font-medium underline underline-offset-2"
          >
            Ücretsiz kayıt ol
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

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <InputField
          id="login-email"
          label="E-posta"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          placeholder="ornek@email.com"
          icon={<Mail size={16} />}
        />

        <InputField
          id="login-password"
          label="Şifre"
          type={showPass ? "text" : "password"}
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          placeholder="••••••••"
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

        {/* Forgot password */}
        <div className="flex justify-end">
          <button
            type="button"
            className="text-xs text-[#52525b] hover:text-[#c5a880] transition-colors duration-200"
          >
            Şifreni mi unuttun?
          </button>
        </div>

        {/* CTA */}
        <button
          id="login-submit"
          type="submit"
          disabled={isLoading}
          className="
            relative w-full flex items-center justify-center gap-2
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
              Giriş Yap
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="mt-8 flex items-center gap-3">
        <div className="flex-1 h-px bg-[#2a2a2e]" />
        <span className="text-xs text-[#3f3f46]">VEYA</span>
        <div className="flex-1 h-px bg-[#2a2a2e]" />
      </div>

      <p className="mt-6 text-center text-xs text-[#3f3f46] leading-relaxed">
        Devam ederek{" "}
        <span className="text-[#52525b] hover:text-[#c5a880] cursor-pointer transition-colors">Kullanım Koşullarını</span>
        {" "}ve{" "}
        <span className="text-[#52525b] hover:text-[#c5a880] cursor-pointer transition-colors">Gizlilik Politikasını</span>
        {" "}kabul etmiş olursunuz.
      </p>
    </div>
  );
};

export default LoginForm;
