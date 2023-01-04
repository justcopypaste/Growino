const mongoose = require('mongoose')
const {CamDB, Cam} = require('./models/cam')

const initDB = async () => {
    const connectionUrl = process.env.DB_CONNECTION_STRING || "mongodb+srv://joako:0WrivbeSbXMmTxFX@cluster0.5pbyj4f.mongodb.net/?retryWrites=true&w=majority"
    try {
        mongoose.connect(connectionUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false,
        });
  
        mongoose.connection.on("error", (error) => {
            console.log("Error mientras se tenía conexión con la base de datos.", error);
        });
    } catch (error) {
      console.error("Error al iniciar conexión con la base de datos.", error);
    }
  };

const createCam = (cam) => {
    return new Promise((resolve, reject) => {
        CamDB.create({
            id: cam.id,
            ip: cam.ip
        }).then((res) => {
            resolve(res);
        }).catch((err)=>{
            reject(err)
        });
    });
}

const getCam = (id) => {
    return new Promise((resolve, reject) => {
        CamDB.findOne({id}).then((cam) => {
            resolve(cam);
        }).catch((err)=>{reject(err)});
    });
}

const updateCam = (cam) => {
    return new Promise((resolve, reject) => {
        CamDB.updateOne({id: cam.id}, 
            { $set: { ip: cam.ip } }).then((res) => {
            resolve(res);
        }).catch((err)=>{
            reject(err)
        });
    });
}

const deleteCam = (id) => {
    return new Promise((resolve, reject) => {
        CamDB.findOneAndDelete({id})
        .then((res) => {
            resolve(res);
        }).catch((err)=>{
            reject(err)
        });
    });
}

module.exports = { 
    initDB,
    createCam,
    getCam,
    updateCam,
    deleteCam
}