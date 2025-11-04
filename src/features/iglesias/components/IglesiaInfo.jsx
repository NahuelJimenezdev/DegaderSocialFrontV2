import styles from '../styles/IglesiaPage.module.css'

const IglesiaInfo = ({ user }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Bienvenido a tu Iglesia</h3>
      <p className={styles.cardSubtitle}>
        Aquí encontrarás toda la información y recursos de tu comunidad de fe.
      </p>

      {user?.estructuraOrganizacional && (
        <div className={styles.userInfo}>
          <h4 className={styles.sectionTitle}>Tu información institucional</h4>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <strong>Área:</strong> {user.estructuraOrganizacional.area}
            </div>
            <div className={styles.infoItem}>
              <strong>Nivel:</strong> {user.estructuraOrganizacional.nivel}
            </div>
            <div className={styles.infoItem}>
              <strong>Rol:</strong> {user.rolUsuario}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default IglesiaInfo
