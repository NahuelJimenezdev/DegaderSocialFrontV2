import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import myGroups from '../../../shared/json/MyGroups.json'
import mockMessages from '../../../shared/data/groups/mockGroupMessages.json'

export const useGroupData = (id) => {
  const navigate = useNavigate()
  const [groupData, setGroupData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const group = myGroups.find(g => g.id === parseInt(id))

    if (group) {
      setGroupData({
        ...group,
        messages: mockMessages[id] || []
      })
    } else {
      navigate('/Mis_grupos')
    }

    setLoading(false)
  }, [id, navigate])

  return { groupData, loading }
}
