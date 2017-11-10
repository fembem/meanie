var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Site = require('./site');

var schema = new Schema({
    username: { type: String, required: true, unique: true },
    hash: String,
    createdDate: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
});

schema.virtual('sites', {
    ref: 'Site',
    localField: '_id',
    foreignField: 'users'
});

schema.post('save', function (user) {
    // remove user from all sites
    Site.updateMany(
        {},
        { $pull: { users: user._id } },
        (err, raw) => { }
    );

    // add user to referenced sites
    Site.updateMany(
        { _id: { $in: user.sites } },
        { $push: { users: user._id } },
        (err, raw) => { }
    );    
});

schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);