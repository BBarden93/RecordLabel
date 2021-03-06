const
  express = require('express'),
  app = express(),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  port = process.env.port || 3000,
  Album = require('./models/Album.js'),
  Artist = require('./models/Artist.js')

mongoose.connect('mongodb://localhost/record-label', (err) => {
  console.log(err || "Connected to MongoDB.")
})

app.use(logger('dev'))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json({message: "Record Label API root."})
})

// THE COMPLETE API:

// 1. ALBUM ROUTES
///////////////////////////////////////////////

// get all albums
app.get('/albums', (req, res) => {
  Album.find({}, (err, allAlbums) => {
    res.json(allAlbums)
  })
})

// get a specific album
app.get('/albums/:id', (req, res) => {
  // Album.findById(req.params.id, (err, thatAlbum) => {
    Album.findById(req.params.id).populate('artist').exec((err, thatAlbum) => {
      res.json(thatAlbum)
    })
})

// delete an album


// 2. SONG ROUTES:
///////////////////////////////////////////////

// get all songs in an album

// post a new song to a specific album
app.post('/albums/:id/songs', (req, res) => {
  Album.findById(req.params.id, (err, thatAlbum) => {
    thatAlbum.songs.push(req.body)
    thatAlbum.save((err, savedAlbum) => {
      res.json({success: true, message: "Song added", album: savedAlbum})
    })
  })
})

// get a specific song from a specific album
// app.get('/albums/:id/songs/:_id', (req, res) => {
//   Album.findById(req.params.id, (err, thatAlbum) => {
//     thatAlbum.songs.id(req.params._id, (err, thatSong) => {
//       res.json({success: true, message: "View song", song: thatSong})
//     })
//   })
// })

// delete a song from an album
app.delete('/albums/:id/songs/:_id', (req, res) => {
  // thatAlbum = Album.findById(req.params.id)
  // thatAlbum.songs.findByIdAndRemove(req.params._id, (err, thatSong) => {
  //   res.json({message: "Song removed."})
  Album.findById(req.params.id, (err, thatAlbum) => {
    thatAlbum.songs.id(req.params._id).remove()
    thatAlbum.save((err, savedAlbum) => {
      res.json({success: true, message: "Song deleted.", album: savedAlbum})
    })
  })
})


// ARTIST ROUTES
///////////////////////////////////////////////
// index all artists
app.get('/artists', (req, res) => {
  Artist.find({}, (err, allDemArtists) => {
    res.json(allDemArtists)
  })
})

// create an artist
app.post('/artists', (req, res) => {
  Artist.create(req.body, (err, brandNewArtist) => {
    res.json({ success: true, message: "artist created.", artist: brandNewArtist})
  })
})

// get a specific artist

// create an album belonging to a specific artist
app.post('/artists/:id/albums', (req, res) => {
  const newAlbum = new Album(req.body)
  newAlbum.artist = req.params.id
  newAlbum.save((err, brandNewAlbum) => {
    res.json({success: true, message: "Album created.", album: brandNewAlbum})
  })
})

// delete an artist and all of their albums
app.delete('/artists/:id', (req, res) => {
  Artist.findByIdAndRemove(req.params.id, (err, deletedArtist) => {
    Album.remove({artist: req.params.id}, (err) => {
      res.json({success: true, message: "Artist deleted."})
    })
  })  
})

app.listen(port, (err) => {
  console.log(err || `Server running on ${port}`)
})
