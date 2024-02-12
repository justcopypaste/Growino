const express = require('express')
const cors = require('cors')
const app = express()
const nunjucks = require('nunjucks')
const db = require('./database')
const camRoutes = require('./routes/camRoutes')
const sensorRoutes = require('./routes/sensorRoutes')
const plantRoutes = require('./routes/plantsRoutes')

app.use(cors())

const port = process.env.port || 80

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
app.use("/plant", plantRoutes);

app.get('/', (req, res) => {
    res.render("views/home.html")
})
app.get('/dash', (req, res) => {
    res.render("views/dashboard.html")
})
app.get('/dashboard', (req, res) => {
    res.render("dashboard/index.html")
})
app.get('/charts', (req, res) => {
    res.render("views/charts.html")
})
app.get('/cam', (req, res) => {
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