import React from "react";
import MailItem from "./MailItem";
import styles from "../styles/MailList.module.css";

export default function MailList({ mails, onSelectMail, selectedMail }) {
  return (
    <div className={styles.mailList}>
      {mails.length > 0 ? (
        mails.map((mail) => (
          <MailItem
            key={mail.id}
            mail={mail}
            onClick={() => onSelectMail(mail)}
            isActive={selectedMail?.id === mail.id}
          />
        ))
      ) : (
        <div className={styles.emptyState}>No hay correos en esta sección.</div>
      )}
    </div>
  );
}
