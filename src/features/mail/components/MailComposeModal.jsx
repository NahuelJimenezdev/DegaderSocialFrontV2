import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/MailComposeModal.module.css";

export default function MailComposeModal({
  isOpen,
  isMinimized,
  onClose,
  onMinimize,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="compose"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`${styles.modal} ${isMinimized ? styles.minimized : ""}`}
        >
          <div className={styles.header}>
            <h3 className={styles.title}>Mensaje nuevo</h3>
            <div className={styles.controls}>
              <button
                type="button"
                onClick={onMinimize}
                className={styles.iconBtn}
                aria-label={isMinimized ? "Restaurar" : "Minimizar"}
              >
                <span className="material-symbols-outlined">
                  {isMinimized ? "expand_less" : "remove"}
                </span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className={styles.iconBtn}
                aria-label="Cerrar"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.content}
            >
              <div className={styles.field}>
                <input className={styles.input} type="text" placeholder="Para" />
              </div>

              <div className={styles.field}>
                <input className={styles.input} type="text" placeholder="Asunto" />
              </div>

              <div className={styles.editor}>
                <textarea
                  className={styles.textarea}
                  placeholder="Escribe tu mensaje..."
                />
              </div>

              <div className={styles.footer}>
                <div className={styles.actions}>
                  <button className={styles.iconAction} type="button" aria-label="Adjuntar">
                    <span className="material-symbols-outlined">attachment</span>
                  </button>
                  <button className={styles.iconAction} type="button" aria-label="Añadir foto">
                    <span className="material-symbols-outlined">add_photo_alternate</span>
                  </button>
                  <button className={styles.iconAction} type="button" aria-label="Eliminar">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>

                <button className={styles.sendBtn} type="button">
                  Enviar
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
