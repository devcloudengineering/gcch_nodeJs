const { Schema, model } = require("mongoose");

// Función para formatear la fecha como DD/MM/AAAA
function formatDate(date) {
  if (!date) return null; // Manejo para cuando la fecha sea null o undefined
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const AnuncioSchema = Schema({
  titulo: {
    type: String,
    required: [true, "El titulo es obligatorio"],
  },
  parrafo: {
    type: String,
    required: [true, "El parrafo es obligatorio"],
  },
  cuerpo: {
    type: String,
    required: [true, "El cuerpo es obligatorio"],
  },
  imagen: {
    type: String,
    required: [true, "La imagen es obligatoria"],
  },
  fecha: {
    type: String,
    get: formatDate, // Aplicamos el getter para formatear la fecha
  },
});

// Configuración para que los getters se apliquen al convertir a JSON
AnuncioSchema.set("toJSON", { getters: true, virtuals: false });

AnuncioSchema.methods.toJSON = function () {
  const { __v, ...anuncio } = this.toObject();
  return anuncio;
};

// Exportamos el modelo
module.exports = model("Anuncio", AnuncioSchema);
