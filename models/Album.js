// Album model here...
const 
    mongoose = require('mongoose'),
    albumSchema = new mongoose.Schema({
        title: String,
        releaseDate: Date,
        albumArt: String
    }, {timestamps: true})

    const Album = mongoose.model('Album', albumSchema)
    module.exports = Album