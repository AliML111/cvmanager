import mongoose from 'mongoose';
import MongooseDelete from 'mongoose-delete';

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        logo: {
            type: String,
            default: null
        },
        is_active: {
            type: Boolean,
            default: 1
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true
        },
        toJSON: {
            transform: function (doc, ret, opt) {
                delete ret['deletedBy']
                delete ret['deletedAt']
                delete ret['__v']
                return ret
            }
        }
    })

schema.plugin(MongooseDelete, { deletedBy: true, deletedAt: true });
schema.pre(/^find/, function () {
    this.where({ deleted: false });
});

const Company = mongoose.model('companies', schema);

export default Company;
