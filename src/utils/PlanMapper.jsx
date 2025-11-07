export const mapPlanIdToName = (planId) => {
    switch (planId) {
      case 1:
        return "Básico";
      case 2:
        return "Avanzado";
      case 3:
        return "Premium";
      default:
        return "Sin plan";
    }
  };