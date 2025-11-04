import styles from '../styles/IglesiaPage.module.css'

const IglesiaMiembros = () => {
  const miembros = [
    { id: 1, nombre: 'Juan Pérez', rol: 'Líder de Alabanza' },
    { id: 2, nombre: 'Ana Gómez', rol: 'Maestra de Escuela Dominical' },
    { id: 3, nombre: 'Carlos Ruiz', rol: 'Coordinador de Jóvenes' }
  ]

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Directorio de Miembros</h3>
      <ul className={styles.list}>
        {miembros.map(miembro => (
          <li key={miembro.id}>
            {miembro.nombre} — {miembro.rol}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default IglesiaMiembros
