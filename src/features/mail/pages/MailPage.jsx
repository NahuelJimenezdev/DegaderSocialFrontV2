import React, { useState } from "react";
import { mockMails } from "../data/mockMails";
import MailSidebar from "../components/MailSidebar";
import MailList from "../components/MailList";
import MailDetail from "../components/MailDetail";
import MailComposeModal from "../components/MailComposeModal";
import style from "../styles/MailSidebar.module.css";

export default function MailPage() {
  const [activeSection, setActiveSection] = useState("inbox");
  const [selectedMail, setSelectedMail] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const mails = mockMails[activeSection] || [];

  return (
    <div className="
      flex 
      w-full 
      h-[75vh]
      relative 
      rounded-xl 
      overflow-hidden 
      border border-border-light dark:border-border-dark 
      bg-background-light dark:bg-background-dark 
      text-text-light-primary dark:text-text-dark-primary 
      shadow-[0_2px_10px_rgba(0,0,0,0.1)]
      transition-colors
      duration-300
    ">
      {/* 📂 Sidebar */}
      <MailSidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        onCompose={() => setIsComposeOpen(true)}
      />

      {/* 📨 Contenido principal */}
      <main className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* 📋 Lista de correos */}
        <div className="
          col-span-4 
          border-r border-border-light dark:border-border-dark 
          bg-surface-light dark:bg-surface-dark 
          transition-colors
          overflow-y-auto
          duration-300
        ">
          <MailList
            mails={mails}
            onSelectMail={setSelectedMail}
            selectedMail={selectedMail}
          />
        </div>

        {/* ✉️ Detalle del correo */}
        <div className="
          col-span-8 
          bg-surface-light dark:bg-surface-dark 
          transition-colors
          duration-300
        ">
          <MailDetail mail={selectedMail} />
        </div>
      </main>

      {/* 📝 Modal de redacción */}
      <MailComposeModal
        isOpen={isComposeOpen}
        isMinimized={isMinimized}
        onClose={() => setIsComposeOpen(false)}
        onMinimize={() => setIsMinimized(!isMinimized)}
      />
    </div>
  );
}


