const express = require('express');
const router = require('express-promise-router')();
const MessageModel = require('../models/MessageModel');

  router.get('/', (req, res) => {
    // Respond
  });

  router.post('/', (req, res) => {
    const message = new MessageModel({
      content: req.body.content,
      messageTo: req.body.messageTo,
      messageFrom: req.body.messageFrom,
    });

  message.save()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
  });

module.exports = router;
