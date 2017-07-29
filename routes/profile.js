const express = require('express');
const router = express.Router();
const DB = require('../db/config.js');

router.get('/', (req, res, next) => {
  console.log('ROUTE WORKS')
  console.log(req.query.userId)

  DB.models.profile.findAll({where: {userId: `${req.query.userId}`}})
    .then((value) => {
      res.json({data: value})
    })

})

module.exports = router;
