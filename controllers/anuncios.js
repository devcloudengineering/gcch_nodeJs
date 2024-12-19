const { response, request } = require("express");
const Anuncio = require("../models/anuncios.js");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const getAnuncio = async (req = request, res = response) => {
  const anuncios = await Anuncio.find();
  res.status(200).json({
    ok: true,
    msg: "get API - controlador",
    anuncios,
  });
};

const postAnuncio = async (req, res = response) => {
  try {
    const { titulo, parrafo, cuerpo, fecha } = req.body;
    // Subir imagen a Cloudinary
    const { tempFilePath } = req.files.imagen; // La imagen se espera en `req.files`
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    // Crear nueva instancia del cliente
    const anuncio = new Anuncio({
      titulo,
      parrafo,
      cuerpo,
      fecha,
      imagen: secure_url,
    });

    // Guardar en la base de datos
    await anuncio.save();
    const anuncios = await Anuncio.find();

    // Respuesta exitosa
    res.status(201).json({
      ok: true,
      msg: "Anuncio creado correctamente",
      anuncios,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al ingresar el anuncio",
      error: error.message,
    });
  }
};

const putAnuncio = async (req, res = response) => {
  const { id } = req.params;
  const { titulo, parrafo, cuerpo, fecha } = req.body;

  let updatedFields = { titulo, parrafo, cuerpo, fecha };

  if (req.files?.imagen) {
    // Subir nueva imagen a Cloudinary
    const { tempFilePath } = req.files.imagen;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    updatedFields.imagen = secure_url; // Actualizar la URL de la imagen
  }

  const anuncioActualizado = await Anuncio.findByIdAndUpdate(
    id,
    updatedFields,
    {
      new: true,
    }
  );

  if (!anuncioActualizado) {
    return res.status(404).json({
      ok: false,
      msg: "Anuncio no encontrado",
    });
  }

  res.status(200).json({
    ok: true,
    msg: "Anuncio actualizado correctamente",
    anuncio: anuncioActualizado,
  });
};

const deleteAnuncio = async (req, res = response) => {
  try {
    const { id } = req.params;

    const anuncio = await Anuncio.findById(id);
    if (!anuncio) {
      return res.status(404).json({
        ok: false,
        msg: "Anuncio no encontrado",
      });
    }

    // Eliminar imagen de Cloudinary
    const public_id = anuncio.imagen.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(public_id);

    // Eliminar anuncio de la base de datos
    await Anuncio.findByIdAndDelete(id);

    const anuncios = await Anuncio.find();

    res.status(200).json({
      ok: true,
      msg: "Anuncio eliminado correctamente",
      anuncios,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error.message,
    });
  }
};

module.exports = {
  getAnuncio,
  deleteAnuncio,
  postAnuncio,
  putAnuncio,
};
