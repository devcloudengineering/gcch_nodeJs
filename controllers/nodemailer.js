const { response, request } = require("express");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const postNodemailer = async (req, res = response) => {
  try {
    const { nombre, correo, telefono, mensaje } = req.body;
    const htmlEmail = await ejs.renderFile(
      path.join(__dirname, "../", "views", "email.ejs"),
      { nombre, correo, telefono, mensaje }
    );

    const userGmail = "devcloudengineering@gmail.com";
    const passAppGmail = process.env.GMAILKEY;

    // transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: userGmail,
        pass: passAppGmail,
      },
    });

    // options
    const mailOptions = {
      from: userGmail,
      to: userGmail,
      subject: "Nuevo consulta cliente Gestor Contable",
      html: htmlEmail,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      }
      console.log("Email enviado: " + info.response);
    });

    res.status(201).json({
      ok: true,
      status: "Mensaje enviado por SMTP",
      nombre,
      correo,
      telefono,
      mensaje,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hable com el administrador, correo electronico no enviado al servidor",
    });
  }
};

module.exports = {
  postNodemailer,
};
