import React, { useState, useMemo, useContext, useEffect } from "react";
import { FaCreditCard, FaCheckCircle, FaInfoCircle, FaTimesCircle } from "react-icons/fa";
import { usePlanes } from "../../../hooks/useApi/usePlanes";
import { useSucursales } from "../../../hooks/useApi/useSucursales";
import { useMembresias } from "../../../hooks/useApi/useMembresias";
import { useUsuarios } from "../../../hooks/useApi/useUsuarios";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import "../../../styles/pages/profile/planSection.css";

const ONE_MONTH_MS = 1000 * 60 * 60 * 24 * 30;

const PlanSection = () => {
  const { planes, loading: loadingPlanes } = usePlanes();
  const { sucursales, loading: loadingSucursales } = useSucursales();
  const { user } = useContext(AuthContext);
  const alumnoId = user?.id ?? null;
  const { membresias = [], loading: loadingMembresias, addMembresia } = useMembresias(alumnoId);
  const { updateUsuario } = useUsuarios(false);

  const [expandedPlanId, setExpandedPlanId] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedSucursalId, setSelectedSucursalId] = useState(user?.sucursalId || "");
  const [processing, setProcessing] = useState(false);
  const [cardForm, setCardForm] = useState({ cardNumber: "", cardName: "", expiryDate: "", cvc: "" });

  const activeMembresia = useMemo(() => {
    if (!membresias || membresias.length === 0) return null;
    const activa = membresias.find((m) => m.estado === "activa");
    if (activa) return activa;
    return membresias.slice().sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio))[0];
  }, [membresias]);

  const selectedPlan = useMemo(() => planes.find((p) => p.id === Number(selectedPlanId)), [selectedPlanId, planes]);

  useEffect(() => {
    if (user?.sucursalId && !selectedSucursalId) {
      setSelectedSucursalId(user.sucursalId);
    }
  }, [user, selectedSucursalId]);

  const toggleExpand = (planId) => {
    setExpandedPlanId(expandedPlanId === planId ? null : planId);
  };

  const handleSelectPlan = (planId) => {
    setSelectedPlanId(planId);
    setExpandedPlanId(planId);
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    if (name === "cardNumber") {
      v = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
    }
    if (name === "expiryDate") {
      const digits = value.replace(/[^\d]/g, "");
      v = digits.length > 2 ? digits.substring(0, 2) + "/" + digits.substring(2, 4) : digits;
    }
    setCardForm((prev) => ({ ...prev, [name]: v }));
  };

  const validateCard = () => {
    if (cardForm.cardNumber.replace(/\s/g, "").length !== 16) return "El número de tarjeta debe tener 16 dígitos.";
    if (!cardForm.cardName.trim()) return "El nombre del titular es obligatorio.";
    if (!/^\d{2}\/\d{2}$/.test(cardForm.expiryDate)) return "Fecha de expiración inválida (MM/AA).";
    if (cardForm.cvc.length !== 3) return "CVC inválido.";
    return null;
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    if (!alumnoId) {
      toast.error("Debes iniciar sesión para suscribirte.");
      return;
    }
    if (!selectedPlanId) {
      toast.error("Selecciona un plan.");
      return;
    }
    if (!selectedSucursalId) {
      toast.error("Selecciona una sucursal.");
      return;
    }
    const validationError = validateCard();
    if (validationError) {
      toast.error(validationError);
      return;
    }
    setProcessing(true);
    toast.info("Procesando pago (simulación)...");
    setTimeout(async () => {
      try {
        const planIdNum = Number(selectedPlanId);
        await updateUsuario(alumnoId, { plan: planIdNum });
        const today = new Date();
        const end = new Date(today.getTime() + ONE_MONTH_MS);
        const membresiaPayload = {
          planId: planIdNum,
          alumnoId,
          fechaInicio: today.toISOString(),
          fechaFin: end.toISOString(),
          estado: "activa",
        };
        await addMembresia(membresiaPayload);
        toast.success("Pago aprobado: membresía activada y plan aplicado al perfil.");
        setCardForm({ cardNumber: "", cardName: "", expiryDate: "", cvc: "" });
        setSelectedPlanId(null);
        setSelectedSucursalId(user?.sucursalId || "");
        setExpandedPlanId(null);
      } catch (err) {
        console.error("Error aplicando membresía:", err);
        toast.error("Ocurrió un error al activar la membresía.");
      } finally {
        setProcessing(false);
      }
    }, 1500);
  };

  return (
    <section className="plan-section">
      <div className="plan-section-header">
        <div className="plan-current">
          <div className="plan-current-left">
            <h2 className="plan-section-title">Mi Plan</h2>
            <p className="plan-section-subtitle">Elige o actualiza tu membresía</p>
          </div>
          <div className="plan-current-right">
            {activeMembresia ? (
              <div className="plan-actual-card">
                <div className="plan-actual-top">
                  <strong>{planes.find(p => p.id === activeMembresia.planId)?.nombre || "Membresía"}</strong>
                  <span className="plan-actual-status">{activeMembresia.estado}</span>
                </div>
                <div className="plan-actual-body">
                  <small>Inicio: {new Date(activeMembresia.fechaInicio).toLocaleDateString()}</small>
                  <small>Fin: {new Date(activeMembresia.fechaFin).toLocaleDateString()}</small>
                </div>
              </div>
            ) : (
              <div className="plan-actual-empty">
                <FaInfoCircle /> <span>No tienes membresía activa</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {loadingPlanes || loadingSucursales || loadingMembresias ? (
        <p className="plan-loading">Cargando planes y sucursales...</p>
      ) : (
        <div className="plans">
          {planes.map((plan) => {
            const expanded = expandedPlanId === plan.id;
            const selected = selectedPlanId === plan.id;
            const isFeatured = plan.recommended || plan.popular || plan.featured || plan.id === 2;
            return (
              <div key={plan.id} id="plan-card-2" className={`plan-card ${expanded ? "expanded" : ""} ${selected ? "selected-card" : ""}`}>
                {isFeatured && <div className="plan-badge">RECOMENDADO</div>}
                <div className="plan-card-top" onClick={() => toggleExpand(plan.id)}>
                  <div>
                    <h3 className="plan-name">{plan.nombre}</h3>
                    <p className="plan-price">${plan.precio.toLocaleString("es-AR")} / mes</p>
                  </div>
                </div>

                <div className="plan-card-inner">
                  <div className="plan-card-body">
                    <p className="plan-desc">{plan.descripcion}</p>
                    <ul className="plan-features">
                      {(plan.features || []).map((f, idx) => <li key={idx}>{f}</li>)}
                    </ul>

                    {selectedPlanId === plan.id && (
                      <form className="plan-purchase-form" onSubmit={handleConfirmPayment}>
                          <div className="form-row">
                            <div className="payment-block">
                            <label className="form-label">Sucursal principal</label>
            
                            <select value={selectedSucursalId ?? ""} onChange={(e) => setSelectedSucursalId(Number(e.target.value))}>
                              <option value="">-- Selecciona una sucursal --</option>
                              {sucursales.map(s => <option key={s.id} value={s.id}>{s.nombre} ({s.direccion})</option>)}
                            </select>
                          </div>
                        </div>

                        <div className="payment-block">
                          <h5 className="payment-title form-label">Pago</h5>
                          <div className="form-row two">
                            <input name="cardNumber" placeholder="Número de tarjeta" value={cardForm.cardNumber} onChange={handleCardChange} maxLength={19} />
                            <input name="cardName" placeholder="Nombre en la tarjeta" value={cardForm.cardName} onChange={handleCardChange} />
                          </div>
                          <div className="form-row two">
                            <input name="expiryDate" placeholder="MM/AA" value={cardForm.expiryDate} onChange={handleCardChange} maxLength={5} />
                            <input name="cvc" placeholder="CVC" value={cardForm.cvc} onChange={handleCardChange} maxLength={3} />
                          </div>

                          <div className="form-actions">
                            <button type="button" className="btn-outline" onClick={() => { setSelectedPlanId(null); }}>
                              Cancelar
                            </button>
                            <button type="submit" className="custom-button" disabled={processing}>
                              {processing ? "Procesando..." : `Pagar $${plan.precio.toLocaleString("es-AR")}`}
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </div>

                <div className="plan-card-footer">
                  <div className="plan-footer-actions">
                    <button
                      className={`btn-plan ${selected ? "active selected" : ""}`}
                      onClick={(ev) => { ev.stopPropagation(); selected ? setSelectedPlanId(null) : handleSelectPlan(plan.id); }}
                    >
                      <span className="btn-plan-label">{selected ? <><FaCheckCircle /> Seleccionado</> : "Seleccionar"}</span>
                      <span className="btn-plan-cancel"><FaTimesCircle /> Cancelar</span>
                    </button>
                    <button className="btn-toggle-more" onClick={(ev) => { ev.stopPropagation(); toggleExpand(plan.id); }}>
                      {expanded ? "Ver menos" : "Ver más"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="payment-info">
        <FaCreditCard /> <span>Métodos de pago reales próximamente.</span>
      </div>
    </section>
  );
};

export default PlanSection;
