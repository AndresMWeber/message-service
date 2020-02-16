const express = require('express')
const router = express.Router()
const Message = require('../models/Message')

/* GET home page. */
router.get('/', async (req, res, next) => {
    res.render('index', {
        title: 'Messaging IoT API',
        messages: await Message.find().populate(['toDevice', 'fromDevice']),
    })
})

module.exports = router
