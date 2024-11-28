const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODBCNN);

    console.log("Conexion a la base de datos");
  } catch (error) {
    console.log(error);
    throw new Error("Error al conectar la base de datos");
  }
};

module.exports = {
  dbConnection,
};
