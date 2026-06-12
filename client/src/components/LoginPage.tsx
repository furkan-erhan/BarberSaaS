import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { ILoginCredentials } from "../types/auth";
import AuthLayout from "./AuthLayout";

interface LoginPageProps {
  onSubmit: (credentials: ILoginCredentials) => void;
  onSwitchToRegister: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function LoginPage({
  onSubmit,
  onSwitchToRegister,
  isLoading = false,
  error = null,
}: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<ILoginCredentials>({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <AuthLayout
      panelTitle={"Zamanın En İyi\nBerberine Kavuş."}
      panelSubtitle="Premium berber dükkanlarını ve güncel hizmet fiyatlarını incele, dilediğin salona kolayca rezervasyon yap — tamamen ücretsiz bir kolaylaştırıcı köprü."
    >
      <div className="bg-[#111113]/80 backdrop-blur-md border border-[#2a2a2e]/50 p-8 sm:p-10 rounded-3xl shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Hoş Geldiniz
          </h2>
          <p className="text-[#a1a1aa] mt-2 text-base font-medium">
            Hesabınıza giriş yapın
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#a1a1aa]">
              E-posta Adresi
            </label>
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

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#a1a1aa]">
              Şifre
            </label>
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

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm font-bold text-[#c5a880] hover:text-[#d4a96a] transition-colors cursor-pointer"
            >
              Şifremi Unuttum?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[#c5a880] hover:bg-[#d5b890] active:bg-[#b3936a] disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl text-black font-extrabold text-base transition-all duration-300 shadow-xl shadow-[#c5a880]/20 hover:shadow-[#c5a880]/30 hover:scale-[1.02] cursor-pointer"
          >
            {isLoading ? (
              <span className="inline-block w-5 h-5 border-2 border-[#09090b]/30 border-t-[#09090b] rounded-full animate-spin" />
            ) : (
              <>
                Giriş Yap
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

        {/* Switch to Register */}
        <p className="text-center text-base font-medium text-[#a1a1aa]">
          Henüz hesabınız yok mu?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-[#c5a880] hover:text-[#d4a96a] font-bold transition-colors cursor-pointer"
          >
            Kayıt Ol
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
