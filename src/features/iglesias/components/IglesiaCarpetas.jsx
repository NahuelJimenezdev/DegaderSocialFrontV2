import styles from '../styles/IglesiaPage.module.css'

const IglesiaCarpetas = () => {
  const carpetas = [
    { id: 1, nombre: 'Recursos Juveniles', icono: '📁' },
    { id: 2, nombre: 'Material de Oración', icono: '📁' },
    { id: 3, nombre: 'Planes de Estudio Bíblico', icono: '📁' }
  ]

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Carpetas Grupales</h3>
      <ul className={styles.list}>
        {carpetas.map(carpeta => (
          <li key={carpeta.id}>
            {carpeta.icono} {carpeta.nombre}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default IglesiaCarpetas
