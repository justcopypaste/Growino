const mongoose = require('mongoose')

const plantDataScheme = new mongoose.Schema({
    id: {type: Number, autoIncrement: true},
    soil: String,
    name: String,
})

const PlantData = mongoose.model("plants", plantDataScheme)

module.exports = PlantData 