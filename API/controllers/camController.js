const {Cam} = require('../models/cam')
const db = require('../database')

const updateCam = (req, res) => {
    const cam = new Cam(req.body.id, req.body.ip)
    db.updateCam(cam).then((r)=>{
        res.send(r)
    }).catch((err) => {
        res.send(err)
    })
}

const createCam = (req, res) => {
    const cam = new Cam(req.body.id, req.body.ip)
    db.createCam(cam).then((r)=>{
        res.send(r)
    }).catch((err) => {
        res.send(err)
    })
}

const deleteCam = (req, res) => {
    db.deleteCam(req.body.id).then((r)=>{
        res.send(r)
    }).catch((err) => {
        res.send(err)
    })
}

module.exports = {
    createCam,
    updateCam,
    deleteCam
}