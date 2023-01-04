
const { Schema, model } = require("mongoose");

class Cam{
    constructor(id, ip){
        this.id = id
        this.ip = ip
    }

    getIp(){
        return ip
    }

    setIp(ip){
        this.ip = ip
    }

    getId(){
        return id
    }

    setId(id){
        this.id = id
    }
}

const camSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },

    ip: {
        type: String,
        required: true
    }
});

const CamDB = model("Cam", camSchema);

module.exports = { Cam, CamDB };