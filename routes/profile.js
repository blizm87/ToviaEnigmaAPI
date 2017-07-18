const express = require('express');
const router = express.Router();
const DB = require('../db/config.js');

router.get('/', (req, res, next) => {
  console.log('ROUTE WORKS')
  console.log(req.query.imageUrl)

  DB.models.profiles.findAll({where: {userId: `${req.query.imageUrl}`}})
    .then((value) => {
      res.json({data: value})
    })

})

module.exports = router;
