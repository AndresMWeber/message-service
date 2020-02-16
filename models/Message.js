const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema(
    {
        toDevice: {
            type: Schema.Types.ObjectId,
            ref: 'Device',
            required: true,
        },
        fromDevice: {
            type: Schema.Types.ObjectId,
            ref: 'Device',
            required: true,
        },
        message: {
            type: String,
            max: 32,
            required: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
        },
    }
)

messageSchema.set('toObject', { virtuals: true })
messageSchema.set('toJSON', { virtuals: true })

messageSchema.static(
    'findOneOrCreate',
    async (condition, doc) =>
        (await this.findOne(condition)) || this.create(doc || condition)
)

const Message = mongoose.model('Message', messageSchema)

module.exports = Message
