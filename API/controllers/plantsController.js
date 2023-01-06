const PlantData = require('../models/PlantData')

const getPlants = (req, res) => {
    PlantData.find().then((plants) => res.send(plants))   
}

const postPlants = (req, res) => {
    let name = req.body.name
    let soil = req.body.soil
    PlantData.create({name: name, soil: soil}).then((plant) => res.send(plant))
}

module.exports = { 
    getPlants,
    postPlants 
}