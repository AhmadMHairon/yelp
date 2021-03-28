const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const User = require('./user');
const opts = { toJSON: { virtuals: true } };


const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  image: [{
    url: String,
    filename: String
  }],
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
}, opts);

CampgroundSchema.virtual('properties.ID').get(function () {
  return this._id
})
CampgroundSchema.virtual('properties.popup').get(function () {
  return `<h3> ${this.title} </h3> <p> ${this.description.substring(0, 10)} </p>`
})

CampgroundSchema.post('findOneAndDelete', async function (camp) {
  if (camp.reviews.length) {
    await Review.deleteMany({ _id: { $in: camp.reviews } })
  }
})


module.exports = mongoose.model('Campground', CampgroundSchema);

