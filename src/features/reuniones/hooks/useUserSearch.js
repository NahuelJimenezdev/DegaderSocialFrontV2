import { useState, useCallback } from "react";
import api from "../../../api/config";

export function useUserSearch() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const searchParticipants = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return [];
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      const res = await api.get(`/usuarios/search?q=${query}`);

      const users =
        res.data?.data ||
        res.data?.resultados?.usuarios ||
        [];

      const formatted = users.map((u) => ({
        id: u._id,
        name: `${u.nombres?.primero || ''} ${u.apellidos?.primero || ''}`.trim() || u.email || 'Usuario',
        email: u.email,
        avatar: u.social?.fotoPerfil,
        username: u.social?.username
      }));

      setSearchResults(formatted);

      return formatted;  // ← ← ← IMPORTANTE
    } catch (err) {
      setSearchError("Error al buscar usuarios");
      return [];
    } finally {
      setSearchLoading(false);
    }
  }, []);


  return { searchResults, searchLoading, searchError, searchParticipants };
}
