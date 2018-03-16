// Album model here...
const 
    mongoose = require('mongoose'),
    songSchema = new mongoose.Schema({
        title: String
    }),
    albumSchema = new mongoose.Schema({
        title: String,
        releaseDate: Date,
        albumArt: String,
        songs: [songSchema] // Items added to array follow songSchema
    }, {timestamps: true})

    const Album = mongoose.model('Album', albumSchema)
    module.exports = Album