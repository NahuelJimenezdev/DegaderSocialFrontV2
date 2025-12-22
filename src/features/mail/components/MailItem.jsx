import React from "react";
import styles from "../styles/MailItem.module.css";

export default function MailItem({ mail, onClick, isActive }) {
  return (
    <div
      onClick={onClick}
      className={`${styles.mailItem} ${isActive ? styles.active : ""}`}
    >
      <div className={styles.topRow}>
        <p className={styles.sender}>{mail.sender}</p>
        <span className={styles.time}>{mail.time}</span>
      </div>

      <p className={styles.subject}>{mail.subject}</p>
      <p className={styles.preview}>{mail.preview}</p>
    </div>
  );
}


