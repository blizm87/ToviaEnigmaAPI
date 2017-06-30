const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({response:"I worked!!!"})
})

module.exports = router;
