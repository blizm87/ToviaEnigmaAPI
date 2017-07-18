const express = require('express');
const request = require('request');
const router = express.Router();
const Sequelize = require('sequelize');
const DB = require('../db/config.js');
const mySchema = require('../db/schema');
const { graphql, buildSchema } = require('graphql');

const client_id = process.env.GOOGLE_CLIENT_ID;
const client_secret = process.env.GOOGLE_CLIENT_SECRET;

router.get('/', (req, res, next) => {
  if(!process.env.prod) {
    var redirect_uri = 'http://127.0.0.1:3001/auth/callback';
  } else {
    var redirect_uri = 'https://arcane-wave-24103.herokuapp.com/auth/callback';
  }

  const url = 'https://accounts.google.com/o/oauth2/v2/auth';
  const queryParams = `response_type=code&client_id=${client_id}&scope=profile&state=abc&redirect_uri=${redirect_uri}`;
  res.redirect(url + '?' + queryParams);
})

router.get('/callback', (req, res, next) => {
  if(!process.env.prod) {
    var redirect_uri = 'http://127.0.0.1:3001/auth/callback';
  } else {
    var redirect_uri = 'https://arcane-wave-24103.herokuapp.com/auth/callback'
  }
  const {code, state} = req.query;
  let url = 'https://www.googleapis.com/oauth2/v4/token';
  const form = {
    code,
    client_id,
    client_secret,
    redirect_uri,
    grant_type: 'authorization_code'
  }
  request.post(url, {form}, (err, resp, body) => {
    const data = JSON.parse(body);
    req.session.access_token = data.access_token;
    url = 'https://www.googleapis.com/plus/v1/people/me';
    const access_token = req.session.access_token;
    const options = {
      method: 'GET',
      url,
      headers: { 'Authorization' : `Bearer ${access_token}`}
    }

    request(options, (err, response, body) => {

      // body = {
      //   id: '105883015749867115220',
      //   displayName: 'Justin Samuels',
      //   image_url: 'https://lh6.googleusercontent.com/-bntcPsxqf_g/AAAAAAAAAAI/AAAAAAAAACQ/wjTYTpCn-fg/photo.jpg?sz=50',
      //   gender: 'male'
      // }
      const userInfo = JSON.parse(body);
      const imageUrl = userInfo.image.url


      let userData = DB.define('profiles',
        {
          userId: Sequelize.STRING,
          displayName: Sequelize.STRING,
          gender: Sequelize.STRING,
          imageUrl: Sequelize.STRING
        }, {
          freezeTableName: true
        });

      DB.sync()
        .then(() => userData.create({
          userId: userInfo.id,
          displayName: userInfo.displayName,
          gender: userInfo.gender,
          imageUrl: imageUrl
        }))

      res.redirect(`http://127.0.0.1:3000?userId=${userInfo.id}`)
    });

  });
})

module.exports = router;
