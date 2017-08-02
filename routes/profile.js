const express = require('express');
const router = express.Router();
const DB = require('../db/config.js');
const base64 = require('base-64');

router.post('/:userId', (req,res, next) => {
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

router.post('/decrypt/:passPhrase', (req, res, next) => {
  let decodedData = base64.decode(req.body.content);
  res.json({data: decodedData, notice: 'Decryption Completed'})
})

module.exports = router;
