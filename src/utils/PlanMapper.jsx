// Definición de ID's de planes
export const PLAN_IDS = {
  BASICO: 1,
  AVANZADO: 2,
  PREMIUM: 3,
};

// Definición de las restricciones de cada plan
export const PLAN_RESTRICTIONS = {
  [PLAN_IDS.BASICO]: {
      maxReservas: 2, // Límite de 2 clases a la vez
      tiposPermitidos: ["general"], // Solo clases generales
      nombre: "Básico",
  },
  [PLAN_IDS.AVANZADO]: {
      maxReservas: 3, // Límite de 3 clases a la vez
      tiposPermitidos: ["general", "especializada"], // Clases generales y especializadas
      nombre: "Avanzado",
  },
  [PLAN_IDS.PREMIUM]: {
      maxReservas: Infinity, // Sin límite
      tiposPermitidos: ["general", "especializada"],
      nombre: "Premium",
  },
};

// Función de mapeo de nombre (la que ya tenías)
export const mapPlanIdToName = (planId) => {
  switch (Number(planId)) {
      case PLAN_IDS.BASICO:
          return PLAN_RESTRICTIONS[PLAN_IDS.BASICO].nombre;
      case PLAN_IDS.AVANZADO:
          return PLAN_RESTRICTIONS[PLAN_IDS.AVANZADO].nombre;
      case PLAN_IDS.PREMIUM:
          return PLAN_RESTRICTIONS[PLAN_IDS.PREMIUM].nombre;
      default:
          return "Sin plan";
  }
};