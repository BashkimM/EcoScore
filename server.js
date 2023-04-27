//imports
const express = require('express')
const pug = require('pug')
const openFF = require('openfoodfacts-nodejs');

//Instanz wird generiert
const server = express()
server.set('view engine', 'pug');
const client = new openFF();

//statische ressourcen
server.use(express.static("./public"));

//Middlewares
server.use(express.urlencoded({ extended: true}));

//Routes
server.get('/', (request, respone) => {
  //respone.send ("Moin Liebe Kollegen");
  respone.render("index", {text: "Jungs"});
})

server.post("/",(request, response) => {
  console.log(request.body.ID)
  client.getProduct(request.body.ID).then(product =>{
    var obj = product
    console.log(obj)
    //var res = JSON.stringify(obj)
    response.json({obj})
  })
})

const projectRouter = require("./routes/projects");
server.use("/projekte", projectRouter);

// Webserver listen auf Port 3000
server.listen('3000', () => console.log("Server gestartet"));