import React, { useState } from "react";
import { FaCreditCard, FaCheckCircle } from "react-icons/fa";
import { usePlanes } from "../../../hooks/useApi";
import "../../../styles/pages/profile/planSection.css";

const PlanSection = () => {
  const { planes, loading } = usePlanes();
  const [planActual, setPlanActual] = useState(null);

  const handleSeleccionar = (planId) => {
    setPlanActual(planId);
  };

  return (
    <div className="plan-section">
      <h2>Mi Plan</h2>
      <p>Elige el plan que mejor se adapte a tu entrenamiento.</p>

      {loading ? (
        <p>Cargando planes...</p>
      ) : (
        <div className="plans">
          {planes.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${planActual === plan.id ? "active" : ""}`}
            >
              <h3>{plan.nombre}</h3>
              <p>${plan.precio} / mes</p>
              <button
                className={`btn-plan ${
                  planActual === plan.id ? "selected" : ""
                }`}
                onClick={() => handleSeleccionar(plan.id)}
              >
                {planActual === plan.id ? (
                  <>
                    <FaCheckCircle /> Actual
                  </>
                ) : (
                  "Seleccionar"
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="payment-info">
        <FaCreditCard /> Métodos de pago próximamente disponibles.
      </div>
    </div>
  );
};

export default PlanSection;
