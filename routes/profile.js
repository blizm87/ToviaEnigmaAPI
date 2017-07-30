const express = require('express');
const router = express.Router();
const DB = require('../db/config.js');

router.get('/', (req, res, next) => {
  // console.log('ROUTE WORKS')
  // console.log(req.query.userId)

  // DB.models.profile.findAll({where: {userId: `${req.query.userId}`}})
  //   .then((value) => {
  //     res.json({data: value})
  //   })
})

router.post('/:userId', (req,res, next) => {
  console.log('I AM POST REQUEST')
  console.log(req.params.userId)
  console.log(req.body)
  DB.models.profile.findAll({where: {userId: `${req.params.userId}`}})
    .then((user) => {
      user[0].createOutbox_message({
        toUser: req.body.toUser ,
        fromUser: req.body.fromUser,
        fromUserId: req.params.userId,
        passPhrase: req.body.passPhrase,
        content: req.body.content,
        expireDate: req.body.expireDate
      })
    })
  res.json({data: 'Message Sent'})
})

module.exports = router;
