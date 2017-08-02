const express = require('express');
const router = express.Router();
const DB = require('../db/config.js');
const base64 = require('base-64');

router.post('/:userId', (req,res, next) => {
  // SENDER'S PROFILE
  DB.models.profile.findAll({where: {userId: `${req.params.userId}`}})
    .then((sender) => {
      sender[0].createOutbox_message({
        toUser: req.body.toUser ,
        passPhrase: req.body.passPhrase,
        content: base64.encode(req.body.content),
        expireDate: req.body.expireDate
      })
    })
  // RECEIVER'S PROFILE
  DB.models.profile.findAll({where: {displayName: `${req.body.toUser}`}})
    .then((receiver) => {
      receiver[0].createInbox_message({
        fromUser: req.body.fromUser,
        passPhrase: req.body.passPhrase,
        content: base64.encode(req.body.content),
        expireDate: req.body.expireDate
      })
    })


  res.json({data: 'Message Sent'})
})

router.post('/decrypt/:passPhrase', (req, res, next) => {
  let decodedData = base64.decode(req.body.content);
  res.json({data: decodedData, notice: 'Decryption Completed'})
})

module.exports = router;
