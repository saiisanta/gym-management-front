
import { createContext, useState, useContext } from "react";

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [coordsData, setCoordsData] = useState([]); // null significa que aún no cargó

  return (
    <MapContext.Provider value={{ coordsData, setCoordsData }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapData = () => useContext(MapContext);
