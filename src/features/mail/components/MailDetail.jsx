import React from "react";
import styles from "../styles/MailDetail.module.css";

export default function MailDetail({ mail }) {
  if (!mail)
    return (
      <div className={styles.emptyState}>
        <p>Selecciona un correo para leer su contenido</p>
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.subject}>{mail.subject}</h2>
        <p className={styles.meta}>
          De: <strong>{mail.sender}</strong> — {mail.time}
        </p>
      </div>

      <div
        className={styles.body}
        dangerouslySetInnerHTML={{ __html: mail.body }}
      />
    </div>
  );
}
