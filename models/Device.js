const mongoose = require('mongoose')
const Schema = mongoose.Schema

const deviceSchema = new Schema({
    name: {
        type: String,
        max: 10,
        required: true,
        unique: true,
    },
})

deviceSchema.virtual('messages', {
    ref: 'Message',
    localField: '_id',
    foreignField: 'toDevice',
    justOne: false,
})

deviceSchema.static(
    'findOneOrCreate',
    async (condition, doc) =>
        (await Device.findOne(condition)) || Device.create(doc || condition)
)

deviceSchema.static('getByIdOrName', async query => {
    const device =
        (await Device.findOne({ name: query }).populate('messages').sort({'created_at': 'desc'})) ||
        (await Device.findById(query).populate('messages').sort({'created_at': 'desc'}))
    if (!device) throw new Error()
    else return device
})

const Device = mongoose.model('Device', deviceSchema)

module.exports = Device
