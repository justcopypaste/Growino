const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
const db = require('./database')
const camRoutes = require('./routes/camRoutes')
const sensorRoutes = require('./routes/sensorRoutes')

const port = process.env.port || 6969

db.initDB();

nunjucks.configure(__dirname+"/public", {
    autoescape: true,
    express: app
});

app.use(express.json())
app.use(express.static(__dirname + '/public'))
app.set("view engine", "njk")

app.use("/cam", camRoutes);
app.use("/sensor", sensorRoutes);

app.get('/', (req, res) => {
    db.getCam(0).then((cam)=>{
        if(cam){
            res.render("index", { camUrl: cam.ip })
        }else{
            res.render("index", { camUrl: "" })
        }
    })
})

app.listen(port, ()=>{
    console.log("http://localhost:" + port)
})