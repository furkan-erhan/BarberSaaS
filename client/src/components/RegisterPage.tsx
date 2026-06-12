import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from "lucide-react";
import { IRegisterCredentials } from "../types/auth";
import AuthLayout from "./AuthLayout";

interface RegisterPageProps {
  onSubmit: (credentials: IRegisterCredentials) => void;
  onSwitchToLogin: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function RegisterPage({
  onSubmit,
  onSwitchToLogin,
  isLoading = false,
  error = null,
}: RegisterPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<IRegisterCredentials>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <AuthLayout
      panelTitle={"Aramıza Katıl.\nTarzını Yansıt."}
      panelSubtitle="Hemen ücretsiz kayıt ol, en iyi salonları ve güncel fiyatları keşfet, rezervasyon köprüsü üzerinden kolayca yerini ayırt."
    >
      <div className="bg-[#111113]/80 backdrop-blur-md border border-[#2a2a2e]/50 p-8 sm:p-10 rounded-3xl shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Kayıt Ol
          </h2>
          <p className="text-[#a1a1aa] mt-2 text-base font-medium">
            Yeni bir hesap oluşturun
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#a1a1aa]">Ad</label>
              <div className="flex items-center gap-2.5 group">
                <div className="w-11 h-11 rounded-xl bg-[#0a0a0b] border border-[#2a2a2e] flex items-center justify-center shrink-0 group-focus-within:border-[#c5a880] transition-colors">
                  <User className="w-4 h-4 text-[#52525b] group-focus-within:text-[#c5a880] transition-colors" />
                </div>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Ahmet"
                  required
                  className="flex-1 min-w-0 bg-[#0a0a0b] border border-[#2a2a2e] rounded-2xl py-3.5 px-3 text-white placeholder-[#52525b] text-sm focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880] transition-all duration-300"
                />
              </div>
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#a1a1aa]">Soyad</label>
              <div className="flex items-center gap-2.5 group">
                <div className="w-11 h-11 rounded-xl bg-[#0a0a0b] border border-[#2a2a2e] flex items-center justify-center shrink-0 group-focus-within:border-[#c5a880] transition-colors">
                  <User className="w-4 h-4 text-[#52525b] group-focus-within:text-[#c5a880] transition-colors" />
                </div>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Yılmaz"
                  required
                  className="flex-1 min-w-0 bg-[#0a0a0b] border border-[#2a2a2e] rounded-2xl py-3.5 px-3 text-white placeholder-[#52525b] text-sm focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880] transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#a1a1aa]">E-posta Adresi</label>
            <div className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-[#0a0a0b] border border-[#2a2a2e] flex items-center justify-center shrink-0 group-focus-within:border-[#c5a880] transition-colors">
                <Mail className="w-5 h-5 text-[#52525b] group-focus-within:text-[#c5a880] transition-colors" />
              </div>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="ornek@email.com"
                required
                className="flex-1 bg-[#0a0a0b] border border-[#2a2a2e] rounded-2xl py-4 px-4 text-white placeholder-[#52525b] text-base focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880] transition-all duration-300"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#a1a1aa]">Telefon (Opsiyonel)</label>
            <div className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-[#0a0a0b] border border-[#2a2a2e] flex items-center justify-center shrink-0 group-focus-within:border-[#c5a880] transition-colors">
                <Phone className="w-5 h-5 text-[#52525b] group-focus-within:text-[#c5a880] transition-colors" />
              </div>
              <input
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="+90 555 111 2233"
                className="flex-1 bg-[#0a0a0b] border border-[#2a2a2e] rounded-2xl py-4 px-4 text-white placeholder-[#52525b] text-base focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880] transition-all duration-300"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#a1a1aa]">Şifre</label>
            <div className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-[#0a0a0b] border border-[#2a2a2e] flex items-center justify-center shrink-0 group-focus-within:border-[#c5a880] transition-colors">
                <Lock className="w-5 h-5 text-[#52525b] group-focus-within:text-[#c5a880] transition-colors" />
              </div>
              <div className="flex-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#0a0a0b] border border-[#2a2a2e] rounded-2xl py-4 px-4 pr-12 text-white placeholder-[#52525b] text-base focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880] transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#52525b] hover:text-[#a1a1aa] transition-colors cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[#c5a880] hover:bg-[#d5b890] active:bg-[#b3936a] disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl text-black font-extrabold text-base transition-all duration-300 shadow-xl shadow-[#c5a880]/20 hover:shadow-[#c5a880]/30 hover:scale-[1.02] cursor-pointer mt-2"
          >
            {isLoading ? (
              <span className="inline-block w-5 h-5 border-2 border-[#09090b]/30 border-t-[#09090b] rounded-full animate-spin" />
            ) : (
              <>
                Kayıt Ol
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-[#2a2a2e]" />
          <span className="text-xs font-bold text-[#52525b] uppercase tracking-wider">veya</span>
          <div className="flex-1 h-px bg-[#2a2a2e]" />
        </div>

        {/* Switch to Login */}
        <p className="text-center text-base font-medium text-[#a1a1aa]">
          Zaten hesabınız var mı?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-[#c5a880] hover:text-[#d4a96a] font-bold transition-colors cursor-pointer"
          >
            Giriş Yap
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
