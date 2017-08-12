const express = require('express');
const router = express.Router();
const request = require('request');
const DB = require('../db/config.js');
const base64 = require('base-64');

const client_id = process.env.GOOGLE_CLIENT_ID;
const client_secret = process.env.GOOGLE_CLIENT_SECRET;

router.get('/', (req, res, next) => {
  if(process.env.NODE_ENV === 'production') {
    var redirect_uri = 'https://nameless-brook-20005.herokuapp.com/auth/callback';
  } else {
    var redirect_uri = 'http://127.0.0.1:3001/auth/callback';
  }

  const url = 'https://accounts.google.com/o/oauth2/v2/auth';
  const queryParams = `response_type=code&client_id=${client_id}&scope=profile&state=abc&redirect_uri=${redirect_uri}`;
  res.redirect(url + '?' + queryParams);
});

router.get('/callback', (req, res, next) => {
  if(process.env.NODE_ENV === 'production') {
    var redirect_uri = 'https://nameless-brook-20005.herokuapp.com/auth/callback'
  } else {
    var redirect_uri = 'http://127.0.0.1:3001/auth/callback';
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
    url = 'https://www.googleapis.com/plus/v1/people/me';
    const access_token = data.access_token;
    const options = {
      method: 'GET',
      url,
      headers: { 'Authorization' : `Bearer ${access_token}`}
    }
    request(options, (err, response, body2) => {
      const userInfo = JSON.parse(body2);
      console.log('I AM THE USERINFO: ')
      console.log(userInfo)
      const imageUrl = userInfo.image.url;

      DB.models.profile.findAll({where: {userId: userInfo.id}})
        .then((member) => {
          if(member.length == 0){
            DB.models.profile.create({
              userId: userInfo.id,
              displayName: userInfo.displayName,
              gender: userInfo.gender,
              imageUrl: imageUrl
            }).then(user =>{
                user.createOutbox_message({
                  toUser: 'test',
                  passPhrase: 'testO',
                  content: base64.encode(`this is ${userInfo.displayName}'s first sent message`),
                  expireDate: new Date(Date.now())
                });
                user.createInbox_message({
                  fromUser: 'Tovia',
                  passPhrase: 'testI',
                  content: base64.encode(`this is ${userInfo.displayName}'s first received message`),
                  expireDate: new Date(Date.now())
                });
            })
          }
          if(process.env.NODE_ENV === 'production') {
            res.redirect(`https://afternoon-cliffs-80859.herokuapp.com?userId=${userInfo.id}`)
          } else {
            res.redirect(`http://127.0.0.1:3000?userId=${userInfo.id}`)
          }
        })
    });
  });
});

module.exports = router;
