//imports
const express = require('express')
const pug = require('pug')
const openFF = require('openfoodfacts-nodejs');
var bodyParser = require('body-parser')


//Instanz wird generiert
const server = express()
server.set('view engine', 'pug');
const client = new openFF();

//statische ressourcen
server.use(express.static("./public"));

//Middlewares
server.use(express.urlencoded({ extended: true}));
server.use(bodyParser.json({limit: '10mb', extended: true}))

//Routes
server.get('/', (request, respone) => {
  //respone.send ("Moin Liebe Kollegen");
  respone.render("index", {text: "Jungs"});
})

server.get('/cam', (request, respone) => {
  respone.render("take_picture");
})

server.post("/",(request, response) => {
  console.log(request.body.ID)
  client.getProduct(request.body.ID).then(product =>{
    var obj = product
    console.log(obj)
    //var res = JSON.stringify(obj)
    //response.json({obj})

    response.render("output", { obj });

  })
})

server.post("/upload",(request, response) => {
  var num = request.body
  console.log(num)
  return response.end('Done')
})

const projectRouter = require("./routes/projects");
server.use("/projekte", projectRouter);

// Webserver listen auf Port 3000
server.listen('3000', () => console.log("Server gestartet"));