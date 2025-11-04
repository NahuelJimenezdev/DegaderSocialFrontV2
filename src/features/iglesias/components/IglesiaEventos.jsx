import styles from '../styles/IglesiaPage.module.css'

const IglesiaEventos = () => {
  const eventos = [
    { id: 1, nombre: 'Retiro Juvenil', fecha: '15 - 17 Noviembre' },
    { id: 2, nombre: 'Conferencia Regional', fecha: '5 Diciembre' },
    { id: 3, nombre: 'Ayuno Congregacional', fecha: '12 Diciembre' }
  ]

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Eventos de la Iglesia</h3>
      <ul className={styles.list}>
        {eventos.map(evento => (
          <li key={evento.id}>
            <strong>{evento.nombre}:</strong> {evento.fecha}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default IglesiaEventos
