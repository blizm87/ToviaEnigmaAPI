const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  let data = {
    test: 'value'
  }
  res.json({data: data})
})

module.exports = router;
