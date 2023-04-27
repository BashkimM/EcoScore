const express = require('express')
const pug = require('pug')
const router = express.Router();

router.get('/', (request, respone) => {
    //respone.send ("Moin Liebe Kollegen");
    respone.render("projectList");
})

module.exports = router ;
