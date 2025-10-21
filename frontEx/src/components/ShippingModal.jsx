import React, { useState } from "react";

const ShippingModal = ({ isOpen, onClose, onConfirm }) => {
  const [shippingInfo, setShippingInfo] = useState({
    nombreEnvio: "",
    direccionEnvio: "",
    telefonoEnvio: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    numeroTarjeta: "",
    nombreTitular: "",
    fechaVencimiento: "",
    cvv: "",
  });

  const [currentStep, setCurrentStep] = useState(1); // 1: Envío, 2: Pago, 3: Confirmación
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Formateo automático para mejor UX
    if (name === "numeroTarjeta") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
    } else if (name === "fechaVencimiento") {
      formattedValue = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2");
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setPaymentInfo((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateShippingForm = () => {
    const newErrors = {};

    if (!shippingInfo.nombreEnvio.trim()) {
      newErrors.nombreEnvio = "El nombre es requerido";
    }

    if (!shippingInfo.direccionEnvio.trim()) {
      newErrors.direccionEnvio = "La dirección es requerida";
    }

    if (!shippingInfo.telefonoEnvio.trim()) {
      newErrors.telefonoEnvio = "El teléfono es requerido";
    } else if (
      !/^\d{8,15}$/.test(shippingInfo.telefonoEnvio.replace(/[\s-]/g, ""))
    ) {
      newErrors.telefonoEnvio = "Ingrese un teléfono válido (8-15 dígitos)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentForm = () => {
    const newErrors = {};

    if (!paymentInfo.numeroTarjeta.trim()) {
      newErrors.numeroTarjeta = "El número de tarjeta es requerido";
    } else if (paymentInfo.numeroTarjeta.replace(/\s/g, "").length < 16) {
      newErrors.numeroTarjeta = "El número de tarjeta debe tener 16 dígitos";
    }

    if (!paymentInfo.nombreTitular.trim()) {
      newErrors.nombreTitular = "El nombre del titular es requerido";
    }

    if (!paymentInfo.fechaVencimiento.trim()) {
      newErrors.fechaVencimiento = "La fecha de vencimiento es requerida";
    } else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.fechaVencimiento)) {
      newErrors.fechaVencimiento = "Formato inválido (MM/AA)";
    } else {
      // Validar que la fecha no sea anterior a la actual
      const [month, year] = paymentInfo.fechaVencimiento.split("/");
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      if (
        parseInt(year) < currentYear ||
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)
      ) {
        newErrors.fechaVencimiento = "La tarjeta está vencida";
      }
    }

    if (!paymentInfo.cvv.trim()) {
      newErrors.cvv = "El CVV es requerido";
    } else if (paymentInfo.cvv.length < 3) {
      newErrors.cvv = "El CVV debe tener al menos 3 dígitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingSubmit = () => {
    if (validateShippingForm()) {
      setCurrentStep(2);
    }
  };

  const handlePaymentSubmit = async () => {
    if (validatePaymentForm()) {
      setIsProcessing(true);

      // Simulación de procesamiento de pago (2 segundos)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsProcessing(false);

      // Enviar tanto la información de envío como la de pago al componente padre
      onConfirm({
        shipping: shippingInfo,
        payment: {
          // No almacenamos datos sensibles de tarjeta en la base de datos
          metodoPago: "tarjeta_credito",
          ultimosDigitos: paymentInfo.numeroTarjeta.slice(-4),
          referenciaPago: `PAY-${Date.now()}`,
        },
      });

      resetForm();
    }
  };

  const resetForm = () => {
    setShippingInfo({
      nombreEnvio: "",
      direccionEnvio: "",
      telefonoEnvio: "",
    });
    setPaymentInfo({
      numeroTarjeta: "",
      nombreTitular: "",
      fechaVencimiento: "",
      cvv: "",
    });
    setCurrentStep(1);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  if (!isOpen) return null;

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-6">
      <div className="flex items-center space-x-4">
        {[1, 2].map((step) => (
          <React.Fragment key={step}>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                currentStep >= step
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "border-gray-300 text-gray-500"
              }`}
            >
              {step}
            </div>
            {step < 2 && (
              <div
                className={`w-12 h-1 ${
                  currentStep > step ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderStepLabels = () => (
    <div className="flex justify-between text-xs text-gray-500 mb-2 px-4">
      <span className={currentStep === 1 ? "text-blue-500 font-semibold" : ""}>
        Envío
      </span>
      <span className={currentStep === 2 ? "text-blue-500 font-semibold" : ""}>
        Pago
      </span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {currentStep === 1 && "Información de Envío"}
              {currentStep === 2 && "Información de Pago"}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition duration-200"
              disabled={isProcessing}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {renderStepLabels()}
          {renderStepIndicator()}

          {/* Paso 1: Información de Envío */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="nombreEnvio"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nombreEnvio"
                  name="nombreEnvio"
                  value={shippingInfo.nombreEnvio}
                  onChange={handleShippingChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 ${
                    errors.nombreEnvio ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ej: Juan Pérez"
                />
                {errors.nombreEnvio && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.nombreEnvio}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="direccionEnvio"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Dirección de envío <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="direccionEnvio"
                  name="direccionEnvio"
                  value={shippingInfo.direccionEnvio}
                  onChange={handleShippingChange}
                  rows="3"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 resize-none ${
                    errors.direccionEnvio ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ej: Av. Siempre Viva 123, Piso 4, Depto B"
                />
                {errors.direccionEnvio && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.direccionEnvio}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="telefonoEnvio"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Teléfono de contacto <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="telefonoEnvio"
                  name="telefonoEnvio"
                  value={shippingInfo.telefonoEnvio}
                  onChange={handleShippingChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 ${
                    errors.telefonoEnvio ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ej: 1123456789"
                />
                {errors.telefonoEnvio && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.telefonoEnvio}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Paso 2: Información de Pago */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="numeroTarjeta"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Número de Tarjeta <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="numeroTarjeta"
                  name="numeroTarjeta"
                  value={paymentInfo.numeroTarjeta}
                  onChange={handlePaymentChange}
                  maxLength="19"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 ${
                    errors.numeroTarjeta ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="1234 5678 9012 3456"
                />
                {errors.numeroTarjeta && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.numeroTarjeta}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="nombreTitular"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nombre del Titular <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nombreTitular"
                  name="nombreTitular"
                  value={paymentInfo.nombreTitular}
                  onChange={handlePaymentChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 ${
                    errors.nombreTitular ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Como aparece en la tarjeta"
                />
                {errors.nombreTitular && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.nombreTitular}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="fechaVencimiento"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Vencimiento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fechaVencimiento"
                    name="fechaVencimiento"
                    value={paymentInfo.fechaVencimiento}
                    onChange={handlePaymentChange}
                    maxLength="5"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 ${
                      errors.fechaVencimiento
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="MM/AA"
                  />
                  {errors.fechaVencimiento && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.fechaVencimiento}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="cvv"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    CVV <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={paymentInfo.cvv}
                    onChange={handlePaymentChange}
                    maxLength="4"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 ${
                      errors.cvv ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="123"
                  />
                  {errors.cvv && (
                    <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-700">
                  💳 <strong>Modo de prueba:</strong> Use cualquier número de
                  tarjeta válido (16 dígitos) y fecha futura.
                  <br />
                  <strong>Seguridad:</strong> Los datos de pago no se almacenan
                  en la base de datos.
                </p>
              </div>
            </div>
          )}

          {/* Botones de Navegación */}
          <div className="flex gap-3 mt-6">
            {currentStep === 1 && (
              <>
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleShippingSubmit}
                  className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition duration-200"
                >
                  Continuar al Pago
                </button>
              </>
            )}

            {currentStep === 2 && (
              <>
                <button
                  onClick={goToPreviousStep}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition duration-200 disabled:opacity-50"
                >
                  Atrás
                </button>
                <button
                  onClick={handlePaymentSubmit}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg font-semibold transition duration-200 flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Procesando...
                    </>
                  ) : (
                    "Confirmar Pago"
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingModal;
