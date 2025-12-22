import React from "react";
import DOMPurify from 'dompurify';
import styles from "../styles/MailDetail.module.css";

export default function MailDetail({ mail }) {
  if (!mail)
    return (
      <div className={styles.emptyState}>
        <p>Selecciona un correo para leer su contenido</p>
      </div>
    );

  // Sanitize HTML to prevent XSS attacks
  const sanitizedBody = DOMPurify.sanitize(mail.body, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'img'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
    ALLOW_DATA_ATTR: false,
  });

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
        dangerouslySetInnerHTML={{ __html: sanitizedBody }}
      />
    </div>
  );
}


