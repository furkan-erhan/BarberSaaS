import { useState } from "react";
import { Store, Users, Plus, Trash2, UserCheck, Building2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IBarberShop } from "../types/barberShop";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  barberShopId?: string | null;
}

interface AdminDashboardProps {
  shops: IBarberShop[];
  users: AdminUser[];
  onAddShop: (shopData: {
    name: string;
    slug: string;
    phoneNumber: string;
    address: string;
  }) => void;
  onDeleteShop: (shopId: string) => void;
  onAssignRole: (userId: string, role: string, shopId?: string | null) => void;
  isLoading?: boolean;
}

type ActiveTab = "shops" | "roles";

const fadeVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export default function AdminDashboard({
  shops,
  users,
  onAddShop,
  onDeleteShop,
  onAssignRole,
  isLoading = false,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("shops");

  const [shopForm, setShopForm] = useState({
    name: "",
    slug: "",
    phoneNumber: "",
    address: "",
  });

  const [roleForm, setRoleForm] = useState({
    userId: "",
    role: "Barber",
    shopId: "",
  });

  const handleShopSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddShop(shopForm);
    setShopForm({ name: "", slug: "", phoneNumber: "", address: "" });
  };

  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssignRole(roleForm.userId, roleForm.role, roleForm.shopId || null);
    setRoleForm({ userId: "", role: "Barber", shopId: "" });
  };

  const tabs = [
    { key: "shops" as ActiveTab, label: "Dükkan Yönetimi", icon: Store },
    { key: "roles" as ActiveTab, label: "Rol Atama", icon: UserCheck },
  ];

  const InputRow = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
  }: {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    type?: string;
  }) => (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-[#a1a1aa]">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full bg-[#0a0a0b] border border-[#2a2a2e] rounded-xl py-3 px-4 text-white placeholder-[#52525b] text-xs font-semibold focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880] transition-all duration-300"
      />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-24 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Background decoration blurs */}
      <div className="absolute top-[15%] right-[-15%] w-[450px] h-[450px] rounded-full bg-[#c5a880]/[0.015] blur-[150px] pointer-events-none z-0" />

      {/* Header */}
      <div className="space-y-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111113] border border-[#2a2a2e]/50 text-[#a1a1aa] text-xs font-bold shadow-md">
          <ShieldCheck className="w-4 h-4 text-[#c5a880]" />
          <span>Sistem Yöneticisi</span>
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Admin Paneli
          </h1>
          <p className="text-[#a1a1aa] text-sm font-semibold mt-1.5">
            Tüm sistemi bu premium panel üzerinden yönetin.
          </p>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {[
          { label: "Toplam Dükkan", value: shops.length, icon: Building2, color: "text-[#c5a880]", bg: "from-amber-500/10 to-orange-500/5" },
          { label: "Toplam Kullanıcı", value: users.length, icon: Users, color: "text-blue-400", bg: "from-blue-500/10 to-indigo-500/5" },
          { label: "Berberler", value: users.filter((u) => u.role === "Barber").length, icon: UserCheck, color: "text-emerald-400", bg: "from-emerald-500/10 to-teal-500/5" },
          { label: "Müşteriler", value: users.filter((u) => u.role === "Customer").length, icon: Users, color: "text-purple-400", bg: "from-purple-500/10 to-pink-500/5" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-gradient-to-b from-[#18181b]/90 to-[#111113]/90 border border-white/5 rounded-3xl p-6 hover:translate-y-[-2px] transition-all duration-300 shadow-xl relative overflow-hidden group">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} opacity-20 pointer-events-none`} />
              <div className="relative z-10 flex flex-col justify-between h-full">
                <Icon className={`w-6 h-6 mb-6 ${stat.color}`} />
                <div>
                  <p className="text-3xl font-extrabold text-white mb-1 tracking-tight">{stat.value}</p>
                  <p className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-wider">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tab Bar Link Options */}
      <div className="flex border-b border-[#2a2a2e]/50 gap-4 relative z-10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-extrabold border-b-2 transition-all duration-300 -mb-px cursor-pointer
                ${isActive
                  ? "border-[#c5a880] text-[#c5a880]"
                  : "border-transparent text-[#52525b] hover:text-[#a1a1aa]"
                }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "shops" && (
          <motion.div
            key="shops"
            variants={fadeVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10"
          >
            {/* Shop List */}
            <div className="lg:col-span-3 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Store className="w-5 h-5 text-[#c5a880]" />
                  Kayıtlı Dükkanlar
                </h2>
                <span className="text-[10px] font-extrabold text-[#52525b] px-3 py-1 bg-[#18181b] rounded-full border border-white/5 uppercase tracking-wide">
                  {shops.length} dükkan
                </span>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-[#111113] border border-[#2a2a2e] rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : shops.length === 0 ? (
                <div className="flex flex-col items-center py-20 space-y-4 bg-[#111113]/30 rounded-3xl border border-white/5">
                  <Store className="w-10 h-10 text-[#52525b]" />
                  <p className="text-[#a1a1aa] text-xs font-semibold">Henüz dükkan eklenmemiş</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {shops.map((shop) => (
                    <div
                      key={shop.id}
                      className="flex items-center justify-between gap-4 bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-md border border-white/5 rounded-2xl p-4.5 hover:border-[#c5a880]/30 transition-all duration-300 shadow-xl group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#c5a880]/15 border border-[#c5a880]/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                          <Store className="w-4.5 h-4.5 text-[#c5a880]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-base font-bold text-white truncate">{shop.name}</p>
                          <p className="text-xs text-[#a1a1aa] truncate font-medium mt-0.5">{shop.slug} • {shop.phoneNumber}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => onDeleteShop(shop.id)}
                        className="p-2.5 text-[#52525b] hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 cursor-pointer"
                        title="Dükkanı Sil"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Shop Form Card */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl sticky top-28">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Plus className="w-4.5 h-4.5 text-[#c5a880]" />
                  Yeni Dükkan Ekle
                </h3>
                <form onSubmit={handleShopSubmit} className="space-y-4">
                  <InputRow
                    label="Dükkan Adı"
                    name="name"
                    value={shopForm.name}
                    onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })}
                    placeholder="Barber Kaya"
                  />
                  <InputRow
                    label="URL Slug"
                    name="slug"
                    value={shopForm.slug}
                    onChange={(e) => setShopForm({ ...shopForm, slug: e.target.value })}
                    placeholder="barber-kaya"
                  />
                  <InputRow
                    label="Telefon"
                    name="phoneNumber"
                    value={shopForm.phoneNumber}
                    onChange={(e) => setShopForm({ ...shopForm, phoneNumber: e.target.value })}
                    placeholder="+90 555 111 2233"
                  />
                  <InputRow
                    label="Adres"
                    name="address"
                    value={shopForm.address}
                    onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })}
                    placeholder="Beşiktaş, İstanbul"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2.5 py-4 mt-6 bg-gradient-to-r from-[#c5a880] to-[#e8d5b5] hover:from-[#d5b890] hover:to-[#f8e5c5] text-black font-extrabold text-sm rounded-xl transition-all duration-300 shadow-xl shadow-[#c5a880]/15 disabled:opacity-50 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    Dükkanı Sisteme Ekle
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "roles" && (
          <motion.div
            key="roles"
            variants={fadeVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10"
          >
            {/* User List */}
            <div className="lg:col-span-3 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#c5a880]" />
                  Sistem Kullanıcıları
                </h2>
                <span className="text-[10px] font-extrabold text-[#52525b] px-3 py-1 bg-[#18181b] rounded-full border border-white/5 uppercase tracking-wide">
                  {users.length} kullanıcı
                </span>
              </div>

              <div className="space-y-3">
                {users.map((u) => {
                  const roleColors: Record<string, string> = {
                    Admin: "text-purple-400 bg-purple-500/10 border-purple-500/20",
                    Barber: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                    Customer: "text-[#a1a1aa] bg-[#18181b] border-white/5",
                  };
                  const rStyle = roleColors[u.role] || roleColors.Customer;

                  return (
                    <div
                      key={u.id}
                      className="flex items-center justify-between gap-4 bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-md border border-white/5 rounded-2xl p-4.5 hover:border-[#c5a880]/30 transition-all duration-300 shadow-xl"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#18181b] border border-white/5 flex items-center justify-center font-bold text-white text-sm">
                          {u.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{u.name}</p>
                          <p className="text-xs text-[#52525b] truncate mt-0.5">{u.email}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1.5 rounded-full border text-[9px] font-extrabold uppercase tracking-wider ${rStyle}`}>
                        {u.role === "Customer" ? "Müşteri" : u.role === "Barber" ? "Berber" : "Admin"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Role Assign Form */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl sticky top-28">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <UserCheck className="w-4.5 h-4.5 text-[#c5a880]" />
                  Rol / Dükkan Atama
                </h3>
                <form onSubmit={handleRoleSubmit} className="space-y-5">
                  
                  {/* User Selection */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#a1a1aa]">Kullanıcı Seçin</label>
                    <select
                      value={roleForm.userId}
                      onChange={(e) => setRoleForm({ ...roleForm, userId: e.target.value })}
                      required
                      className="w-full bg-[#0a0a0b] border border-[#2a2a2e] rounded-xl py-3 px-4 text-white text-xs font-semibold focus:outline-none focus:border-[#c5a880]"
                    >
                      <option value="" disabled>Kullanıcı seçin...</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Role Select */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#a1a1aa]">Rol Belirleyin</label>
                    <select
                      value={roleForm.role}
                      onChange={(e) => setRoleForm({ ...roleForm, role: e.target.value })}
                      className="w-full bg-[#0a0a0b] border border-[#2a2a2e] rounded-xl py-3 px-4 text-white text-xs font-semibold focus:outline-none focus:border-[#c5a880]"
                    >
                      <option value="Customer">Müşteri (Customer)</option>
                      <option value="Barber">Berber (Barber)</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>

                  {/* Dynamic Shop Select for Barber Role */}
                  {roleForm.role === "Barber" && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-1.5"
                    >
                      <label className="block text-xs font-bold text-[#a1a1aa]">Berber Dükkanı Bağla (Zorunlu)</label>
                      <select
                        value={roleForm.shopId}
                        onChange={(e) => setRoleForm({ ...roleForm, shopId: e.target.value })}
                        required={roleForm.role === "Barber"}
                        className="w-full bg-[#0a0a0b] border border-[#2a2a2e] rounded-xl py-3 px-4 text-white text-xs font-semibold focus:outline-none focus:border-[#c5a880]"
                      >
                        <option value="" disabled>Dükkan seçin...</option>
                        {shops.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || !roleForm.userId || (roleForm.role === "Barber" && !roleForm.shopId)}
                    className="w-full flex items-center justify-center gap-2.5 py-4 mt-6 bg-gradient-to-r from-[#c5a880] to-[#e8d5b5] hover:from-[#d5b890] hover:to-[#f8e5c5] text-black font-extrabold text-sm rounded-xl transition-all duration-300 shadow-xl shadow-[#c5a880]/15 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4 stroke-[2.5]" />
                    Yetkilendirmeyi Güncelle
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
