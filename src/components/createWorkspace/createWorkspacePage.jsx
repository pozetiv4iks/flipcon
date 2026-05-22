"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Button } from "@/src/components/buttons/Buttons";
import { AuthPageLogo } from "@/src/components/login/AuthPageLogo";

const pageBgClass =
  "flex h-[100dvh] w-full flex-col overflow-hidden text-white";

const cardClass = "mx-auto flex w-full max-w-[400px] flex-col items-center";

const inputWrapperClass = "w-full space-y-1.5";
const labelClass = "text-[12px] font-medium text-white/70 ml-1";
const inputBaseClass =
  "h-10 w-full rounded-xl border border-white/15 bg-white/5 px-4 text-[13px] text-white outline-none transition-all placeholder:text-white/25 focus:border-white/30 focus:ring-2 focus:ring-white/5";

const selectWrapperClass = "relative w-full";
const selectButtonClass =
  "flex h-10 w-full items-center justify-between rounded-xl border border-white/15 bg-white/5 px-4 text-[13px] text-white/50 outline-none transition-all hover:bg-white/10";

export default function CreateWorkspacePage() {
  const router = useRouter();
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceUrl, setWorkspaceUrl] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [role, setRole] = useState("");
  
  const [openDropdown, setOpenDropdown] = useState(null); // 'teamSize' | 'role' | null

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const teamSizeOptions = [
    "Только я",
    "1-5",
    "5-10",
    "10-25",
    "25-100",
    "100-250",
    "250-1000",
    "1000+",
  ];

  const roleOptions = [
    "Основатель / CEO",
    "Менеджер продукта",
    "Дизайнер",
    "Разработчик",
    "Маркетолог",
    "Другое",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ workspaceName, workspaceUrl, teamSize, role });
  };

  return (
    <div className={pageBgClass}>
      {/* Header */}
      <header className="flex w-full items-center justify-between px-8 py-4">
        <button
          onClick={() => router.push("/login")}
          className="text-[12px] text-white/50 transition-colors hover:text-white"
        >
          Выйти
        </button>
        <div className="text-[12px] text-white/50">
          Вы вошли как: <span className="text-white">samlee.mobbin@gmail.com</span>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-5 pb-10 custom-scrollbar">
        <div className={cardClass}>
          <AuthPageLogo />

          <h1 className="mt-2 text-center text-[1.75rem] font-bold leading-tight tracking-tight">
            Создать новый воркспейс
          </h1>

          <p className="mt-2 max-w-[320px] text-center text-[12px] leading-relaxed text-white/95">
            Воркспейс — это общее пространство, где ваша
            <br />
            команда будет работать над проектами и задачами.
          </p>

          <div className="mt-6 w-full rounded-[20px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Workspace Name */}
              <div className={inputWrapperClass}>
                <label className={labelClass}>Название воркспейса</label>
                <input
                  type="text"
                  placeholder="не жёлуди а грецкие орехи"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className={inputBaseClass}
                />
              </div>

              {/* Workspace URL */}
              <div className={inputWrapperClass}>
                <label className={labelClass}>URL воркспейса</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-[13px] text-white/25">
                    flipcon.app/
                  </span>
                  <input
                    type="text"
                    value={workspaceUrl}
                    onChange={(e) => setWorkspaceUrl(e.target.value)}
                    className={`${inputBaseClass} pl-[84px]`}
                    placeholder="zholydi"
                  />
                </div>
              </div>

              <div className="h-px w-full bg-white/10" />

              {/* Team Size */}
              <div className={inputWrapperClass}>
                <label className={labelClass}>Сколько людей в команде?</label>
                <div className={selectWrapperClass}>
                  <button
                    type="button"
                    onClick={() => toggleDropdown('teamSize')}
                    className={`${selectButtonClass} ${openDropdown === 'teamSize' ? 'rounded-b-none border-b-0' : ''}`}
                  >
                    <span className={teamSize ? "text-white" : "text-white/50"}>
                      {teamSize || "Выбрать размер команды"}
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === 'teamSize' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {openDropdown === 'teamSize' && (
                    <div className="absolute left-0 top-full z-50 w-full overflow-hidden rounded-b-xl border border-t-0 border-white/15 bg-[#0D0D0D] backdrop-blur-xl">
                      <div className="max-h-[160px] overflow-y-auto custom-scrollbar">
                        {teamSizeOptions.map((option, idx) => (
                          <button
                            key={option}
                            type="button"
                            className={`flex h-9 w-full items-center px-4 text-[12px] text-white/70 transition-colors hover:bg-white/5 hover:text-white ${idx !== teamSizeOptions.length - 1 ? 'border-b border-white/5' : ''}`}
                            onClick={() => {
                              setTeamSize(option);
                              setOpenDropdown(null);
                            }}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Role */}
              <div className={inputWrapperClass}>
                <label className={labelClass}>Какая у вас роль в команде?</label>
                <div className={selectWrapperClass}>
                  <button
                    type="button"
                    onClick={() => toggleDropdown('role')}
                    className={`${selectButtonClass} ${openDropdown === 'role' ? 'rounded-b-none border-b-0' : ''}`}
                  >
                    <span className={role ? "text-white" : "text-white/50"}>
                      {role || "Выбрать свою роль в команде"}
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === 'role' ? 'rotate-180' : ''}`} />
                  </button>

                  {openDropdown === 'role' && (
                    <div className="absolute left-0 top-full z-50 w-full overflow-hidden rounded-b-xl border border-t-0 border-white/15 bg-[#0D0D0D] backdrop-blur-xl">
                      <div className="max-h-[160px] overflow-y-auto custom-scrollbar">
                        {roleOptions.map((option, idx) => (
                          <button
                            key={option}
                            type="button"
                            className={`flex h-9 w-full items-center px-4 text-[12px] text-white/70 transition-colors hover:bg-white/5 hover:text-white ${idx !== roleOptions.length - 1 ? 'border-b border-white/5' : ''}`}
                            onClick={() => {
                              setRole(option);
                              setOpenDropdown(null);
                            }}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>

          <Button
            type="submit"
            text="Создать новый воркспейс"
            className="mt-6"
            onClick={handleSubmit}
          />
        </div>
      </main>

      <style jsx>{`
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
}
