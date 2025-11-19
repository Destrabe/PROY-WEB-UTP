const form = document.getElementById("reserva");

const alertCard = document.getElementById("alert-card");
const alertMessage = document.getElementById("alert-message");
const closeCard = document.getElementById("close-card");

closeCard.addEventListener("click", () => {
  alertCard.classList.add("hidden");
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(form));

  const data = {
    nombre: formData.name.trim(),
    apellido: formData.apellido.trim(),
    email: formData.email.trim(),
    telefono: formData.telefono.trim(),
    tipo_documento: formData.tipo_documento.trim(),
    numero_documento: formData.numero_documento.trim(),
    cantidad_personas: parseInt(formData.cantidad_personas),
    fecha: new Date(formData.fecha),
    hora: formData.hora,
    observaciones: formData.observaciones.trim() || null,
  };

  try {
    const response = await axios.post("http://localhost:3005/reservas", data);
    console.log("Reserva creada con éxito");
    alertMessage.textContent = "Reserva creada con éxito";
    alertCard.classList.remove("hidden");
    form.reset();
  } catch (error) {
    console.error(error);
    if (error.response) {
      showToast(`Error: ${error.response.data.message || "Algo salió mal"}`);
    } else {
      showToast("Error de conexión con el servidor");
    }
  }
});
