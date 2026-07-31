"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, Folder } from "lucide-react";

interface Project {
  id: string;
  name: string;
}

export const ProjectSwitcher = ({ isHovered }: { isHovered: boolean }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      // Simulation of success without backend
      const data = [
        { id: '1', name: 'Проект Альфа' },
        { id: '2', name: 'Проект Бета' },
        { id: '3', name: 'Flipcon AI' }
      ];
      setProjects(data);
      if (data.length > 0) {
        const savedProject = localStorage.getItem('selectedProject');
        if (savedProject) {
          setSelectedProject(JSON.parse(savedProject));
        } else {
          setSelectedProject(data[0]);
          localStorage.setItem('selectedProject', JSON.stringify(data[0]));
        }
      }
    };
    fetchProjects();
  }, []);

  const handleSelect = (project: Project) => {
    setSelectedProject(project);
    localStorage.setItem('selectedProject', JSON.stringify(project));
    setIsOpen(false);
    // In a real app, you might want to refresh the page or update a context
    window.location.reload();
  };

  if (projects.length <= 1 && !selectedProject) return null;

  return (
    <div className="relative px-[14px] mt-4">
      <button
        onClick={() => isHovered && setIsOpen(!isOpen)}
        className={`flex h-10 w-full items-center rounded-xl bg-white/5 px-2 transition-colors hover:bg-white/10 ${
          !isHovered ? "justify-center" : ""
        }`}
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
          <Folder size={18} />
        </div>
        {isHovered && (
          <>
            <span className="ml-3 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left text-[14px] font-medium text-white">
              {selectedProject?.name || "Select Project"}
            </span>
            <ChevronDown
              size={16}
              className={`ml-2 text-white/50 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </>
        )}
      </button>

      {isHovered && isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 px-[14px]">
          <div className="rounded-xl border border-white/10 bg-[#1A1A1A] p-1 shadow-2xl">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleSelect(project)}
                className={`flex w-full items-center rounded-lg px-3 py-2 text-[13px] transition-colors ${
                  selectedProject?.id === project.id
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                {project.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
