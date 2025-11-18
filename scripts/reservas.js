const form = document.getElementById("reserva");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(form));

  const data = {
    nombre: formData.name,
    apellido: formData.apellido,
    email: formData.email,
    telefono: formData.telefono,
    tipo_documento: formData.tipo_documento,
    numero_documento: formData.numero_documento,
    cantidad_personas: parseInt(formData.cantidad_personas),
    fecha: formData.fecha,
    hora: formData.hora,
    observaciones: formData.observaciones || null,
  };

  try {
    const response = await axios.post("http://localhost:3005/reservas", data);
    alert("Reserva creada con éxito");
    form.reset();
  } catch (error) {
    console.error(error);
    if (error.response) {
      alert(`Error: ${error.response.data.message || "Algo salió mal"}`);
    } else {
      alert("Error de conexión con el servidor");
    }
  }
});
