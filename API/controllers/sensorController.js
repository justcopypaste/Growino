const sensors = require('../models/sensor')

const getSensors = (req, res) => {
    sensors.find().then((s) => res.send(s))   
}

const getLastRead = (req, res) => {
    sensors.findOne().sort({$natural: -1}).limit(1).exec(function(err, read){
        if(err){
            console.log(err);
        } else{
            res.send(read)
        }
    })
}

const postSensors = (req, res) => {
    let temp = req.body.temp
    let hum = req.body.hum
    let soil = req.body.soil
    sensors.create({temperature: temp, humidity: hum, soil: soil}).then((s) => res.send(s))
}

module.exports = { 
    getSensors,
    getLastRead,
    postSensors 
}