"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/src/i18n/LanguageContext";
import { 
  Settings as SettingsIcon, 
  Palette, 
  User, 
  Bell, 
  Shield, 
  Globe,
  Check,
  LogOut,
  UserPlus,
  Lock,
  ChevronRight,
  LayoutGrid,
  Zap,
  Activity,
  Calendar,
  Clock,
  Users,
  BarChart3,
  Bot,
  Plus,
  Trash2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { CustomSelect } from "@/src/components/select/CustomSelect";

interface Role {
  id: string;
  name: string;
}

const customPalette = [
  "#040035", "#0A0A0A", "#1A1A1A", "#1E1E2E", "#0F172A", "#020617",
  "#111827", "#171717", "#050505", "#0F0F0F", "#121212",
  "#1A0B2E", "#2D0B2E", "#2E0B0B", "#0B2E1A", "#0B2E2E",
  "#1E1B4B", "#312E81", "#1E3A8A", "#2E1A0B", "#2E2E0B"
];

export const SettingsPage = () => {
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const [activeColor, setActiveColor] = useState("#040035");
  const [activeSection, setActiveSection] = useState("appearance");
  const [user, setUser] = useState<any>(null);
  const [permissions, setPermissions] = useState<any>(null);
  const [selectedRoleForPerms, setSelectedRoleForPerms] = useState("developer");
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRoleName, setNewRoleName] = useState("");

  const baseRoles = [
    { id: 'admin', name: 'Администратор' },
    { id: 'manager', name: 'Менеджер' },
    { id: 'accountant', name: 'Бухгалтер' },
    { id: 'teamlead', name: 'Тимлид' },
    { id: 'developer', name: 'Разработчик' },
    { id: 'hr', name: 'HR' }
  ];

  const defaultPermissions = {
    admin: { tabs: ["/calendar", "/table", "/", "/ai-assistant", "/ai-insights", "/timelogs", "/team", "/settings", "/analytics"], widgets: ["activity", "tasks", "calendar", "stats", "acc_stats", "permissions_widget"] },
    manager: { tabs: ["/calendar", "/table", "/", "/ai-assistant", "/ai-insights", "/timelogs", "/settings", "/analytics"], widgets: ["activity", "tasks", "calendar", "stats"] },
    accountant: { tabs: ["/calendar", "/table", "/", "/timelogs", "/settings"], widgets: ["calendar", "stats", "acc_stats"] },
    teamlead: { tabs: ["/calendar", "/table", "/", "/ai-assistant", "/ai-insights", "/timelogs", "/team", "/settings"], widgets: ["activity", "tasks", "calendar", "stats"] },
    developer: { tabs: ["/calendar", "/table", "/", "/ai-assistant", "/timelogs", "/settings"], widgets: ["activity", "tasks", "calendar"] },
    hr: { tabs: ["/calendar", "/", "/timelogs", "/team", "/settings"], widgets: ["calendar", "stats"] }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedProject");
    router.push("/");
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Load custom roles
    const savedCustomRoles = localStorage.getItem('custom-roles');
    const customRoles = savedCustomRoles ? JSON.parse(savedCustomRoles) : [];
    const allRoles = [...baseRoles, ...customRoles];
    setRoles(allRoles);

    // Load permissions
    const savedPerms = localStorage.getItem('role-permissions');
    const perms = savedPerms ? JSON.parse(savedPerms) : defaultPermissions;
    
    // Ensure all roles have a permission entry
    allRoles.forEach(role => {
      if (!perms[role.id]) {
        perms[role.id] = { tabs: ["/"], widgets: ["calendar"] };
      }
    });
    
    setPermissions(perms);

    // Load saved color from localStorage
    const savedColor = localStorage.getItem("flipcon-theme-color");
    if (savedColor) {
      setActiveColor(savedColor);
      applyTheme(savedColor);
    }
  }, []);

  const handleAddRole = () => {
    if (!newRoleName.trim()) return;
    const newRole = { id: `custom-${Date.now()}`, name: newRoleName.trim() };
    const updatedRoles = [...roles, newRole];
    setRoles(updatedRoles);
    
    // Save to custom-roles
    const savedCustomRoles = localStorage.getItem('custom-roles');
    const customRoles = savedCustomRoles ? JSON.parse(savedCustomRoles) : [];
    localStorage.setItem('custom-roles', JSON.stringify([...customRoles, newRole]));

    // Initialize permissions for new role
    const newPerms = { ...permissions };
    newPerms[newRole.id] = { tabs: ["/"], widgets: ["calendar"] };
    savePermissions(newPerms);

    setNewRoleName("");
  };

  const handleDeleteRole = (id: string) => {
    if (baseRoles.find(r => r.id === id)) return; // Can't delete base roles
    const updatedRoles = roles.filter(r => r.id !== id);
    setRoles(updatedRoles);
    
    const savedCustomRoles = JSON.parse(localStorage.getItem('custom-roles') || '[]');
    localStorage.setItem('custom-roles', JSON.stringify(savedCustomRoles.filter((r: Role) => r.id !== id)));
    
    if (selectedRoleForPerms === id) setSelectedRoleForPerms("developer");
  };

  const savePermissions = (newPerms: any) => {
    setPermissions(newPerms);
    localStorage.setItem('role-permissions', JSON.stringify(newPerms));
  };

  const toggleTab = (role: string, tab: string) => {
    const newPerms = { ...permissions };
    if (newPerms[role].tabs.includes(tab)) {
      newPerms[role].tabs = newPerms[role].tabs.filter((t: string) => t !== tab);
    } else {
      newPerms[role].tabs.push(tab);
    }
    savePermissions(newPerms);
  };

  const toggleWidget = (role: string, widget: string) => {
    const newPerms = { ...permissions };
    if (newPerms[role].widgets.includes(widget)) {
      newPerms[role].widgets = newPerms[role].widgets.filter((w: string) => w !== widget);
    } else {
      newPerms[role].widgets.push(widget);
    }
    savePermissions(newPerms);
  };

  const applyTheme = (hex: string) => {
    const gradient = `radial-gradient(ellipse 120% 80% at 50% 20%, ${hex} 0%, #000000 75%)`;
    
    document.documentElement.style.setProperty('--background', hex);
    document.documentElement.style.setProperty('--sidebar-background', hex);
    document.documentElement.style.setProperty('--background-gradient', gradient);
    localStorage.setItem("flipcon-theme-color", hex);
  };

  const handleColorChange = (color: string) => {
    setActiveColor(color);
    applyTheme(color);
  };

  return (
    <div className="flex h-screen text-white overflow-hidden transition-all duration-500">
      <div className="flex flex-1 transition-all duration-300 h-full overflow-y-auto custom-scrollbar">
        <main className="max-w-4xl mx-auto w-full p-12">
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-2">
              <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
                <SettingsIcon size={24} />
              </div>
              <h1 className="text-[32px] font-bold">{t.settings.title}</h1>
            </div>
            <p className="text-white/40">{t.settings.subtitle}</p>
          </header>

          <div className="grid grid-cols-[240px_1fr] gap-16">
            {/* Nav */}
            <nav className="space-y-2">
              {[
                { id: "appearance", icon: Palette, label: t.settings.appearance },
                { id: "profile", icon: User, label: t.settings.profile },
                ...(user?.role === 'admin' ? [
                  { id: "team", icon: UserPlus, label: t.settings.team },
                  { id: "roles", icon: Shield, label: t.settings.roles },
                  { id: "permissions", icon: Lock, label: t.settings.permissions }
                ] : []),
                { id: "notifications", icon: Bell, label: t.settings.notifications },
                { id: "security", icon: Shield, label: t.settings.security },
                { id: "language", icon: Globe, label: t.settings.language },
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all ${
                    activeSection === item.id ? "bg-white/5 text-white" : "text-white/40 hover:text-white/60"
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Content */}
            <div className="space-y-12">
              {activeSection === "appearance" && (
                <section className="animate-in">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[18px] font-bold flex items-center gap-2">
                      <Palette size={20} className="text-blue-400" />
                      {t.settings.theme}
                    </h3>
                    {activeColor !== "#040035" && (
                      <button 
                        onClick={() => handleColorChange("#040035")}
                        className="text-[13px] text-white/40 hover:text-white transition-all underline underline-offset-4"
                      >
                        {t.settings.resetTheme}
                      </button>
                    )}
                  </div>
                  <p className="text-white/40 text-[14px] mb-8">
                    {t.settings.themeDesc}
                  </p>

                  <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8">
                    <div className="grid grid-cols-10 gap-3">
                      {customPalette.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleColorChange(color)}
                          className={`h-8 w-8 rounded-full border transition-all hover:scale-110 active:scale-95 flex items-center justify-center ${
                            activeColor === color 
                              ? "border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                              : "border-white/10"
                          }`}
                          style={{ background: color }}
                        >
                          {activeColor === color && <Check size={12} className="text-white" />}
                        </button>
                      ))}
                    </div>
                    <div className="mt-8 flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="h-10 w-10 rounded-xl border border-white/10" style={{ background: activeColor }} />
                      <div>
                        <p className="text-[14px] font-medium">{t.settings.currentColor}</p>
                        <p className="text-[12px] text-white/30 uppercase">{activeColor}</p>
                      </div>
                    </div>
                  </div>
                </section>
              )}

      {activeSection === "language" && (
        <section className="animate-in">
          <h3 className="text-[18px] font-bold mb-6 flex items-center gap-2">
            <Globe size={20} className="text-green-400" />
            {t.settings.language}
          </h3>
          <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 space-y-4">
            <div className="space-y-4">
              <h4 className="text-[13px] font-black uppercase tracking-widest text-white/20 ml-1">Выбор языка системы</h4>
              <CustomSelect 
                options={[
                  { id: "ru", label: "Русский", icon: <span className="text-lg">🇷🇺</span> },
                  { id: "en", label: "English", icon: <span className="text-lg">🇺🇸</span> },
                ]}
                value={language}
                onChange={(val) => setLanguage(val as any)}
                className="max-w-xs"
              />
            </div>
          </div>
        </section>
      )}

              {activeSection === "profile" && (
                <section className="animate-in">
                  <h3 className="text-[18px] font-bold mb-6 flex items-center gap-2">
                    <User size={20} className="text-purple-400" />
                    {t.settings.accountInfo}
                  </h3>
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[12px] font-bold text-white/20 uppercase tracking-widest mb-1">{t.settings.username}</p>
                        <p className="text-[15px]">Stepan Dyleuski</p>
                      </div>
                      <button className="text-[13px] text-blue-400 hover:underline">{t.settings.change}</button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[12px] font-bold text-white/20 uppercase tracking-widest mb-1">{t.settings.email}</p>
                        <p className="text-[15px]">stepan@flipcon.app</p>
                      </div>
                      <button className="text-[13px] text-blue-400 hover:underline">{t.settings.change}</button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[12px] font-bold text-white/20 uppercase tracking-widest mb-1">Telegram</p>
                        <p className="text-[15px]">@stepandyleuski</p>
                      </div>
                      <button className="text-[13px] text-blue-400 hover:underline">{t.settings.change}</button>
                    </div>
                    
                    <div className="pt-4 border-t border-white/5">
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all text-[14px] font-medium"
                      >
                        <LogOut size={16} />
                        Выйти из аккаунта
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {activeSection === "team" && user?.role === 'admin' && (
                <section className="animate-in">
                  <h3 className="text-[18px] font-bold mb-6 flex items-center gap-2">
                    <UserPlus size={20} className="text-green-400" />
                    Управление командой
                  </h3>
                  <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 space-y-6">
                    <p className="text-white/60 text-[14px]">
                      Управление приглашениями перенесено в раздел <a href="/team" className="text-blue-400 underline underline-offset-4">Команда</a> в боковом меню.
                    </p>
                  </div>
                </section>
              )}

              {activeSection === "roles" && user?.role === 'admin' && (
                <section className="animate-in space-y-8">
                  <h3 className="text-[18px] font-bold mb-6 flex items-center gap-2">
                    <Shield size={20} className="text-purple-400" />
                    Управление ролями проекта
                  </h3>
                  
                  <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 space-y-6">
                    <div className="flex gap-4">
                      <input 
                        type="text"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        placeholder="Название новой роли (например, Зам)..."
                        className="flex-1 h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-[14px] outline-none focus:border-blue-500/50"
                      />
                      <button 
                        onClick={handleAddRole}
                        className="h-12 px-6 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all flex items-center gap-2"
                      >
                        <Plus size={18} />
                        Добавить
                      </button>
                    </div>

                    <div className="space-y-3 mt-8">
                      <h4 className="text-[12px] font-black uppercase tracking-widest text-white/20 ml-1">Список ролей</h4>
                      {roles.map(role => (
                        <div key={role.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40">
                              <Shield size={16} />
                            </div>
                            <span className="font-medium text-[15px]">{role.name}</span>
                            {baseRoles.find(r => r.id === role.id) && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-white/20 uppercase font-black">Системная</span>
                            )}
                          </div>
                          {!baseRoles.find(r => r.id === role.id) && (
                            <button 
                              onClick={() => handleDeleteRole(role.id)}
                              className="p-2 text-white/20 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {activeSection === "permissions" && user?.role === 'admin' && permissions && (
                <section className="animate-in space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[18px] font-bold flex items-center gap-2">
                        <Lock size={20} className="text-orange-400" />
                        Настройка уровней доступа
                      </h3>
                      <CustomSelect 
                        options={roles.map(r => ({ id: r.id, label: r.name }))}
                        value={selectedRoleForPerms}
                        onChange={setSelectedRoleForPerms}
                        className="w-56"
                      />
                    </div>

                  <div className="space-y-6">
                    <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8">
                      <h4 className="text-[13px] font-black uppercase tracking-widest text-white/20 mb-6">Вкладки в сайдбаре</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { id: "/calendar", label: "Календарь", icon: Calendar },
                          { id: "/table", label: "Доска (Trello)", icon: LayoutGrid },
                          { id: "/ai-assistant", label: "AI Ассистент", icon: Bot },
                          { id: "/ai-insights", label: "AI Аналитика", icon: Zap },
                          { id: "/timelogs", label: "Таймлоги", icon: Clock },
                          { id: "/team", label: "Команда", icon: Users },
                          { id: "/analytics", label: "Бизнес Аналитика", icon: BarChart3 },
                          { id: "/settings", label: "Настройки", icon: SettingsIcon },
                        ].map(tab => {
                          const hasAccess = permissions[selectedRoleForPerms].tabs.includes(tab.id);
                          return (
                            <button
                              key={tab.id}
                              onClick={() => toggleTab(selectedRoleForPerms, tab.id)}
                              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                                hasAccess ? "bg-blue-500/10 border-blue-500/20 text-white" : "bg-white/5 border-transparent text-white/40 opacity-60"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <tab.icon size={18} />
                                <span className="font-medium text-[14px]">{tab.label}</span>
                              </div>
                              <div className={`h-5 w-5 rounded-md border flex items-center justify-center ${hasAccess ? "bg-blue-500 border-blue-400" : "border-white/10"}`}>
                                {hasAccess && <Check size={12} strokeWidth={4} />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8">
                      <h4 className="text-[13px] font-black uppercase tracking-widest text-white/20 mb-6">Виджеты на дашборде</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { id: "activity", label: "График активности", icon: Activity },
                          { id: "tasks", label: "Список задач", icon: LayoutGrid },
                          { id: "calendar", label: "Мини-календарь", icon: Calendar },
                          { id: "stats", label: "Статистика", icon: BarChart3 },
                        ].map(widget => {
                          const hasAccess = permissions[selectedRoleForPerms].widgets?.includes(widget.id);
                          return (
                            <button
                              key={widget.id}
                              onClick={() => toggleWidget(selectedRoleForPerms, widget.id)}
                              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                                hasAccess ? "bg-green-500/10 border-green-500/20 text-white" : "bg-white/5 border-transparent text-white/40 opacity-60"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <widget.icon size={18} />
                                <span className="font-medium text-[14px]">{widget.label}</span>
                              </div>
                              <div className={`h-5 w-5 rounded-md border flex items-center justify-center ${hasAccess ? "bg-green-500 border-green-400" : "border-white/10"}`}>
                                {hasAccess && <Check size={12} strokeWidth={4} />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        </main>
      </div>


      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};
