const router = require('express').Router()
const Device = require('../models/Device')
const Message = require('../models/Message')

const aqp = require('api-query-params')

router.get('/', async (req, res, next) => {
    const { filter, skip, limit, sort, projection, population } = aqp(req.query)
    Device.find(filter)
        .lean()
        .skip(skip)
        .limit(limit || 50)
        .sort(sort)
        .select(projection)
        .populate(population)
        .then(devices => res.json(devices))
        .catch(err => next(err))
})

router.get('/:id', async (req, res, next) => {
    try {
        const device = await Device.getByIdOrName(req.params.id)
        console.log(device)
        res.send(device.populate('chats'))
    } catch (e) {
        console.log(e)
        res.status(404).json({
            message: `Device for ID: ${req.params.id} was not found.`,
        })
    }
})

router.get('/:id/messages', async (req, res, next) => {
    try {
        const device = await Device.getByIdOrName(req.params.id)
        res.json(
            device.messages
                .filter(message => !message.read)
                .map((message) => {
                    message.read = true
                    message.save()
                    return message.message
                })
        )
    } catch (e) {
        console.log(e)
        res.status(404).json({ error: 'Could not find device messages.' })
    }
})

module.exports = router
