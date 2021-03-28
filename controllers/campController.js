const { cloudinary } = require('../cloudinary')
const Campground = require('../models/campground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const MapBoxToken = process.env.MapBox_Token;
const geoCoder = mbxGeocoding({ accessToken: MapBoxToken });



module.exports.getIndex = async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render("camps", { campgrounds })
}

module.exports.getInfo = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id).populate({
    path: 'reviews', //this basically says to populate reviews then populate the author in the reviews themselves 
    populate: {
      path: 'author'
    }
  }).populate('author') //while this populates the author on the campground instead of the review's author
  if (!campground) {
    req.flash('error', 'no campground found')
    return res.redirect('/camps')
  }
  res.render("campinfo", { campground })
}

module.exports.getNewForm = (req, res,) => {
  res.render("newCamp")
}


module.exports.getEdit = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
  if (!campground) {
    req.flash('error', 'no campground found')
    return res.redirect('/camps')
  }
  res.render("editCamp", { campground })
}



module.exports.create = async (req, res, next) => {
  console.log("meow")
  const geodata = await geoCoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  }).send()
  console.log(geodata.body.features[0].geometry.coordinates)
  const newcamp = new Campground(req.body.campground)
  newcamp.author = req.user;
  newcamp.geometry = geodata.body.features[0].geometry;
  newcamp.image = req.files.map(f => ({ url: f.path, filename: f.filename }))
  await newcamp.save().then(m => console.log(m));
  req.flash('success', 'new camp ground created')
  res.redirect(`camps/${newcamp.id}`);
}

module.exports.update = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true, new: true })
  const img = req.files.map(f => ({ url: f.path, filename: f.filename }))
  campground.image.push(...img);
  await campground.save()
  if (req.body.deleteImages) {
    console.log("hey")
    await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
  }
  req.flash('success', 'camp ground has been updated successfuly ')
  res.redirect(`/camps/${id}`)
}

module.exports.destroy = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id).then(c => console.log(c))
  req.flash('success', 'camp has been deleted')
  res.redirect(`/camps`)
}



