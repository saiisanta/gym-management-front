import React, { useState, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
  Alert,
  ProgressBar,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useApi/useAuth";
import { usePlanes } from "../hooks/useApi/usePlanes";
import { useSucursales } from "../hooks/useApi/useSucursales";
import "../styles/login.css";
import logo from "../assets/images/logos/logo.svg";
import { MdHome } from "react-icons/md";

const PasoDatosPersonales = ({ form, errors, handleChange, nextStep }) => {
  const handleNext = (e) => {
    e.preventDefault();

    if (!form.nombre.trim()) return toast.error("El nombre es obligatorio");
    if (!form.lastname.trim()) return toast.error("El apellido es obligatorio");
    if (!form.telNumber.trim()) return toast.error("El teléfono es obligatorio");
    if (!form.dni.trim()) return toast.error("El DNI es obligatorio");
    if (!form.genero) return toast.error("El género es obligatorio");
    if (!form.fechaNacimiento)
      return toast.error("La fecha de nacimiento es obligatoria");
    if (!form.direccion.trim()) return toast.error("La dirección es obligatoria");
    
    if (!form.email.trim()) return toast.error("El email es obligatorio");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return toast.error("Email inválido");
    if (!form.password || form.password.length < 6)
      return toast.error("La contraseña debe tener al menos 6 caracteres");
    if (form.password !== form.confirmPassword)
      return toast.error("Las contraseñas no coinciden");

    nextStep();
  };

  return (
    <Form onSubmit={handleNext}>
      <Row className="mb-3">
        <Col>
          <Form.Control
            type="text"
            placeholder="Nombre *"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </Col>
        <Col>
          <Form.Control
            type="text"
            placeholder="Apellido *"
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
            required
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Control
            type="tel"
            placeholder="Teléfono *"
            name="telNumber"
            value={form.telNumber}
            onChange={handleChange}
            required
          />
        </Col>
        <Col>
          <Form.Control
            type="text"
            placeholder="DNI *"
            name="dni"
            value={form.dni}
            onChange={handleChange}
            required
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Select
            name="genero"
            value={form.genero}
            onChange={handleChange}
            required
          >
            <option value="">Género *</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </Form.Select>
        </Col>
        <Col>
          <Form.Control
            type="date"
            placeholder="Fecha de Nacimiento *"
            name="fechaNacimiento"
            value={form.fechaNacimiento}
            onChange={handleChange}
            required
          />
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Dirección *"
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Control
          type="email"
          placeholder="Email *"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Row className="mb-3">
        <Col>
          <Form.Control
            type="password"
            placeholder="Contraseña * (mín. 6 caracteres)"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </Col>
        <Col>
          <Form.Control
            type="password"
            placeholder="Confirmar contraseña *"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </Col>
      </Row>

      <div className="d-grid mb-3">
        <Button type="submit" className="custom-button w-100">
          Continuar a la Elección del Plan
        </Button>
      </div>

      <div className="text-center">
        <Link to="/login" className="custom-warning text-decoration-none">
          ¿Ya tienes cuenta? Inicia sesión
        </Link>
      </div>
    </Form>
  );
};

const PasoEleccionPlan = ({
  form,
  handleChange,
  prevStep,
  nextStep,
  planes,
  loadingPlanes,
}) => {
  const { sucursales, loading: loadingSucursales } = useSucursales();

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.planId)
      return toast.error("Debes seleccionar un plan de membresía.");
    if (!form.sucursalId)
      return toast.error("Debes seleccionar tu sucursal principal.");
    nextStep();
  };

  const selectedPlan = useMemo(
    () => planes.find((p) => p.id === parseInt(form.planId)),
    [form.planId, planes]
  );

  if (loadingPlanes || loadingSucursales)
    return <Alert variant="info">Cargando opciones de membresía...</Alert>;

  return (
    <Form onSubmit={handleNext}>
      <h5 className="mb-3 text-center">
        Selecciona tu Plan de Membresía y Sucursal
      </h5>
      <hr />

      <Form.Group className="mb-4">
        <Form.Label className="fw-bold">1. Elegir un Plan:</Form.Label>
        <div className="d-flex flex-column gap-2">
          {planes.map((plan) => (
            <Card
              key={plan.id}
              className={`p-3 cursor-pointer ${
                parseInt(form.planId) === plan.id
                  ? "border border-primary bg-light"
                  : ""
              }`}
              style={{ cursor: "pointer" }}
              onClick={() =>
                handleChange({
                  target: { name: "planId", value: plan.id.toString() },
                })
              }
            >
              <div className="d-flex justify-content-between align-items-center">
                <p className="mb-0 fw-bold">{plan.nombre}</p>
                <span className="text-primary fs-5">
                  ${plan.precio.toLocaleString("es-AR")}
                </span>
              </div>
              <small className="text-muted">{plan.descripcion}</small>
            </Card>
          ))}
        </div>
        {selectedPlan && (
          <Alert variant="success" className="mt-3 py-2 text-center">
            Plan seleccionado: {selectedPlan.nombre} por $
            {selectedPlan.precio.toLocaleString("es-AR")}
          </Alert>
        )}
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="fw-bold">
          2. Elegir Sucursal Principal:
        </Form.Label>
        <Form.Select
          name="sucursalId"
          value={form.sucursalId}
          onChange={handleChange}
        >
          <option value="">-- Selecciona tu Sucursal --</option>
          {sucursales.map((sucursal) => (
            <option key={sucursal.id} value={sucursal.id}>
              {sucursal.nombre} ({sucursal.direccion})
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Row>
        <Col>
          <Button
            variant="outline-secondary"
            className="w-100"
            onClick={prevStep}
          >
            Atrás (Datos Personales)
          </Button>
        </Col>
        <Col>
          <Button type="submit" className="custom-button w-100">
            Continuar al Pago
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

const PasoPagoSimulado = ({
  form,
  prevStep,
  handleSubmit,
  selectedPlan,
  loadingPlanes,
}) => {
  const [cardForm, setCardForm] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvc: "",
    billingAddress: form.direccion || "",
    billingCity: "",
    billingZip: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
    }
    if (name === "expiryDate") {
      const digits = value.replace(/[^\d]/g, "");
      if (digits.length > 2) {
        formattedValue = digits.substring(0, 2) + "/" + digits.substring(2, 4);
      } else {
        formattedValue = digits;
      }
    }

    setCardForm((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if (cardForm.cardNumber.replace(/\s/g, "").length !== 16) {
      toast.error("El número de tarjeta debe tener 16 dígitos.");
      return setIsProcessing(false);
    }
    if (!cardForm.cardName.trim()) {
      toast.error("El nombre del titular es obligatorio.");
      return setIsProcessing(false);
    }
    if (
      !/^\d{2}\/\d{2}$/.test(cardForm.expiryDate) ||
      cardForm.expiryDate.length !== 5
    ) {
      toast.error("Formato de fecha de expiración inválido (MM/AA).");
      return setIsProcessing(false);
    }
    if (cardForm.cvc.length !== 3) {
      toast.error("El CVC debe tener 3 dígitos.");
      return setIsProcessing(false);
    }
    if (!cardForm.billingAddress.trim() || !cardForm.billingCity.trim()) {
      toast.error("Debes completar la dirección de facturación.");
      return setIsProcessing(false);
    }

    toast.info("Procesando pago... (simulación bancaria)");
    
    setTimeout(() => {
      toast.success("Pago APROBADO. Completando su registro...");
      handleSubmit();
      setIsProcessing(false);
    }, 2000);
  };

  if (loadingPlanes) {
    return <Alert variant="info">Cargando datos del plan...</Alert>;
  }

  if (!selectedPlan) {
    return (
      <Alert variant="danger">
        Error: No se encontró el plan de membresía seleccionado. Por favor,
        regresa al paso anterior.
      </Alert>
    );
  }

  const planName = selectedPlan.nombre || "Plan Seleccionado";
  const planPrice = selectedPlan.precio
    ? selectedPlan.precio.toLocaleString("es-AR")
    : "N/A";

  return (
    <Form onSubmit={handlePayment}>
      <h5 className="mb-3 text-center">
        Finalizar Pago | Membresía {planName}
      </h5>
      <hr />

      <Alert variant="info" className="text-center fw-bold">
        Total a pagar: ${planPrice}
      </Alert>

      <h6 className="mb-2 text-primary">Datos de la Tarjeta</h6>
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Número de Tarjeta (16 dígitos)"
          name="cardNumber"
          value={cardForm.cardNumber}
          onChange={handleCardChange}
          maxLength={19}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Nombre del Titular (como aparece en la tarjeta)"
          name="cardName"
          value={cardForm.cardName}
          onChange={handleCardChange}
          required
        />
      </Form.Group>

      <Row className="mb-4">
        <Col xs={6}>
          <Form.Control
            type="text"
            placeholder="Fecha de Exp. (MM/AA)"
            name="expiryDate"
            value={cardForm.expiryDate}
            onChange={handleCardChange}
            maxLength={5}
            required
          />
        </Col>
        <Col xs={6}>
          <Form.Control
            type="text"
            placeholder="CVC/CCV"
            name="cvc"
            value={cardForm.cvc}
            onChange={handleCardChange}
            maxLength={3}
            required
          />
        </Col>
      </Row>

      <h6 className="mb-2 text-primary">Dirección de Facturación</h6>
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Dirección (calle y número)"
          name="billingAddress"
          value={cardForm.billingAddress}
          onChange={handleCardChange}
          required
        />
      </Form.Group>
      <Row className="mb-4">
        <Col xs={8}>
          <Form.Control
            type="text"
            placeholder="Ciudad / Localidad"
            name="billingCity"
            value={cardForm.billingCity}
            onChange={handleCardChange}
            required
          />
        </Col>
        <Col xs={4}>
          <Form.Control
            type="text"
            placeholder="Cód. Postal"
            name="billingZip"
            value={cardForm.billingZip}
            onChange={handleCardChange}
            required
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <Button
            variant="outline-secondary"
            className="w-100"
            onClick={prevStep}
            disabled={isProcessing}
          >
            Atrás (Cambiar Plan)
          </Button>
        </Col>
        <Col>
          <Button
            type="submit"
            className="custom-button w-100"
            disabled={isProcessing}
          >
            {isProcessing ? "Procesando..." : `Pagar $${planPrice}`}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const { planes, loading: loadingPlanes } = usePlanes();

  const [form, setForm] = useState({
    nombre: "",
    lastname: "",
    telNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    dni: "",
    genero: "",
    fechaNacimiento: "",
    direccion: "",
    planId: "",
    sucursalId: "",
  });

  const [errors, setErrors] = useState({});

  const selectedPlan = useMemo(
    () => planes.find((p) => p.id === parseInt(form.planId)),
    [form.planId, planes]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    try {
      const userToSave = {
        Nombre: form.nombre,
        Apellido: form.lastname,
        Telefono: form.telNumber,
        Email: form.email,
        Password: form.password,
        Dni: form.dni,
        Genero: form.genero,
        FechaNacimiento: form.fechaNacimiento,
        Direccion: form.direccion,
        Role: "Alumno",
        SucursalId: form.sucursalId ? parseInt(form.sucursalId) : null,
        Image: "",
        PlanId: form.planId ? parseInt(form.planId) : 0, 
      };
      
      await register(userToSave); 

      toast.success("¡Registro y Membresía activada exitosamente! Redirigiendo...");
      
      setTimeout(() => navigate("/login"), 1500); 
    } catch (err) {
      
      let errorMessage = "Error al completar el registro. Por favor, intenta nuevamente.";
      
      if (err.response && err.response.status === 400 && err.response.data) {
        errorMessage = err.response.data;
      }
      
      toast.error(errorMessage);
      console.error("Error en handleSubmit:", err);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PasoDatosPersonales
            form={form}
            errors={errors}
            handleChange={handleChange}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <PasoEleccionPlan
            form={form}
            handleChange={handleChange}
            prevStep={prevStep}
            nextStep={nextStep}
            planes={planes}
            loadingPlanes={loadingPlanes}
          />
        );
      case 3:
        return (
          <PasoPagoSimulado
            form={form}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
            selectedPlan={selectedPlan}
            loadingPlanes={loadingPlanes}
          />
        );
      default:
        return null;
    }
  };

  const progress = Math.round((step / 3) * 100);

  return (
    <Container
      fluid
      className="login-page d-flex justify-content-center align-items-center"
    >
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={6} lg={5}>
          <Card className="p-4 shadow rounded-3 text-dark">
            <div className="text-center mb-4">
              <Image src={logo} alt="Logo" style={{ maxHeight: "120px" }} />
            </div>

            <div className="mb-4">
              <p className="text-center fw-bold mb-1">
                Paso {step} de 3:{" "}
                {step === 1
                  ? "Datos Personales"
                  : step === 2
                  ? "Selección de Membresía"
                  : "Confirmación y Pago"}
              </p>
              <ProgressBar
                now={progress}
                label={`${progress}%`}
                className="custom-progress-bar"
              />
            </div>

            {renderStep()}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;