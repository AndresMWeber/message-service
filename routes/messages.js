const router = require('express').Router()
const Message = require('../models/Message')
const Device = require('../models/Device')
const aqp = require('api-query-params')

router.get('/search', async (req, res, next) => {
    const { filter, skip, limit, sort, projection, population } = aqp(req.query)
    Message.find(filter)
        .lean()
        .skip(skip)
        .limit(limit || 50)
        .sort(sort)
        .select(projection)
        .populate(population)
        .then(messages => res.json(messages))
        .catch(err => next(err))
})

router.get('/', async (req, res, next) => {
    res.send(await Message.find())
})

router.get('/:id', async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.id)
        if (!message)
            throw new Error(`Message for ID: ${req.params.id} was not found.`)
        res.send(message)
    } catch (e) {
        next(e)
    }
})

router.post('/', async (req, res, next) => {
    var { to, from, message } = req.body
    if (!(to && from && message)) {
        const msg = 'JSON must specify "to" "from" and "message" fields.'
        return res.status(400).send(msg)
    }
    var newMessage
    try {
        const toDevice = await Device.findOneOrCreate({ name: to })
        const fromDevice = await Device.findOneOrCreate({ name: from })
        newMessage = await Message.create({
            message,
            toDevice: toDevice._id,
            fromDevice: fromDevice._id,
        })
    } catch (e) {
        return next(e)
    }
    return res.json(newMessage)
})

module.exports = router
