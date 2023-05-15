//imports
const express = require('express')
const pug = require('pug')
const openFF = require('openfoodfacts-nodejs');
var bodyParser = require('body-parser')
const fs = require("fs");
var Quagga = require('quagga').default;

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
  console.log(request.body)
  respone.render("index", {text: "Jungs"});
})

server.get('/cam', (request, respone) => {
  respone.render("take_picture");
})

server.post("/",(request, response) => {
  console.log(request.body.ID)
  client.getProduct(request.body.ID).then(product =>{
    var obj = product
    response.render("index", { obj });
  })
})

server.post("/upload",(request, response) => {

  //HANDLE REQUEST
  var data = request.body
  var strData = JSON.stringify(data)
  var base64Data = strData.replace("data:image/png;base64,", "");
  base64Data = base64Data.replace("frame","");
  base64Data = base64Data.slice(4,-1);

  // Store Image into Server
  const buffer = Buffer.from(base64Data, "base64");
  fs.writeFileSync("image.png", buffer);
  fs.writeFileSync("image.txt", base64Data);

  //DO STUFF WITH FILE
  Quagga.decodeSingle({
    src: "barcode2.png",
    numOfWorkers: 0,  // Needs to be 0 when used within node
    inputStream: {
        size: 640  // restrict input-size to be 800px in width (long-side)
      },
    decoder: {
        readers: ["ean_reader"] // List of active readers
      },
      locate: true, 
    }, function(result) {
      if(result.codeResult) {
        console.log("result", result.codeResult.code);
        client.getProduct(result.codeResult.code).then(product =>{
          var obj = product
          response.render("output",{obj});
        })
      } else {
        console.log("not detected", result);
      }
    });
  //DELETE FILE AND RESPONSE
  //fs.unlinkSync("image.png");
})

const projectRouter = require("./routes/projects");
server.use("/projekte", projectRouter);

// Webserver listen auf Port 3000
server.listen('3000', () => console.log("Server gestartet"));