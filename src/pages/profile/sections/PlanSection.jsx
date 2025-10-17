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
    <section className="plan-section">
      <div className="plan-section-header">
        <h2 className="plan-section-title">Mi Plan</h2>
        <p className="plan-section-subtitle">
          Elige el plan que mejor se adapte a tu entrenamiento.
        </p>
      </div>

      {loading ? (
        <p className="plan-loading">Cargando planes...</p>
      ) : (
        <div className="plans">
          {planes.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${
                planActual === plan.id ? "selected" : ""
              }`}
            >
              <h3 className="plan-name">{plan.nombre}</h3>
              <p className="plan-price">${plan.precio} / mes</p>

              <button
                className={`btn-plan ${
                  planActual === plan.id ? "active" : ""
                }`}
                onClick={() => handleSeleccionar(plan.id)}
              >
                {planActual === plan.id ? (
                  <>
                    <FaCheckCircle /> Plan actual
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
    </section>
  );
};

export default PlanSection;
