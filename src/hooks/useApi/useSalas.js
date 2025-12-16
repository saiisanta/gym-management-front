import { useState, useCallback } from 'react';
import { 
    getSalasBySucursal, 
    createSala, 
    updateSala, 
    deleteSala 
} from '../../services/api'; // Asegúrate de que la ruta sea correcta

export const useSalas = () => {
    const [salas, setSalas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSalas = useCallback(async (sucursalId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getSalasBySucursal(sucursalId);
            setSalas(data || []);
        } catch (err) {
            setError(err.message || "Error al cargar las salas.");
            setSalas([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const createNewSala = useCallback(async (salaData) => {
        setLoading(true);
        setError(null);
        try {
            const newSala = await createSala(salaData);
            setSalas(prev => [...prev, newSala]);
            setLoading(false);
            return newSala;
        } catch (err) {
            setError(err.message || "Error al crear la sala.");
            setLoading(false);
            throw err;
        }
    }, []);

    const updateExistingSala = useCallback(async (id, salaData) => {
        setLoading(true);
        setError(null);
        try {
            await updateSala(id, salaData);
            setSalas(prev => prev.map(s => (s.id === id ? { ...s, ...salaData } : s)));
            setLoading(false);
        } catch (err) {
            setError(err.message || "Error al actualizar la sala.");
            setLoading(false);
            throw err;
        }
    }, []);

    const deleteExistingSala = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deleteSala(id);
            setSalas(prev => prev.filter(s => s.id !== id));
            setLoading(false);
        } catch (err) {
            setError(err.message || "Error al desactivar la sala.");
            setLoading(false);
            throw err;
        }
    }, []);

    return {
        salas,
        loading,
        error,
        fetchSalas,
        createNewSala,
        updateExistingSala,
        deleteExistingSala,
    };
};