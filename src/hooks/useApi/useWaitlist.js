import { useState, useEffect } from "react";
import {
  getWaitlistByClase,
  createWaitlistEntry,
  deleteWaitlistEntry,
} from "../../services/api";

export const useWaitlist = (claseId = null) => {
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!claseId) return;
    const fetchWaitlist = async () => {
      try {
        const data = await getWaitlistByClase(claseId);
        setWaitlist(data);
      } catch (error) {
        console.error("Error cargando lista de espera:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWaitlist();
  }, [claseId]);

  const addToWaitlist = async (entry) => {
    const nuevo = await createWaitlistEntry(entry);
    setWaitlist((prev) => [...prev, nuevo]);
  };

  const removeFromWaitlist = async (id) => {
    await deleteWaitlistEntry(id);
    setWaitlist((prev) => prev.filter((w) => w.id !== id));
  };

  return { waitlist, loading, addToWaitlist, removeFromWaitlist };
};
