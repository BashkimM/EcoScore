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
  client.getProduct(request.body.ID).then(product =>{
    var obj = product
    var img_src;
    var notfound;
    if (obj.status === 0) {
      obj = null;
      notfound = true;
    } else {
      if (obj.product.ecoscore_grade === "a") {
        img_src = "/images/ecoscore/ecoscore-a.svg";
      } else if (obj.product.ecoscore_grade === "b") {
        img_src = "/images/ecoscore/ecoscore-b.svg";
      } else if (obj.product.ecoscore_grade === "c") {
        img_src = "/images/ecoscore/ecoscore-c.svg";
      } else if (obj.product.ecoscore_grade === "d") {
        img_src = "/images/ecoscore/ecoscore-d.svg";
      } else if (obj.product.ecoscore_grade === "e") {
        img_src = "/images/ecoscore/ecoscore-e.svg";
      } else {
        img_src = "/images/ecoscore/ecoscore-unknown.svg";
      }
    }
    response.render("index", { obj, img_src, notfound });
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

  //DO STUFF WITH FILE
  Quagga.decodeSingle({
    src: "barcode3.png",
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
          barcode = result.codeResult.code
          response.send({barcode});
      } else {
        console.log("not detected", result);
      }
    });

  fs.unlinkSync("image.png");
})

// Webserver listen auf Port 3000
server.listen('3000', () => console.log("Server gestartet"));