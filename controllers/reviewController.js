const Review = require('../models/review');
const Campground = require('../models/campground')


module.exports.create = async (req, res, next) => {
  const { camp_id } = req.params;
  const campground = await Campground.findById(camp_id)
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  review.author = req.user._id;
  await review.save().then(m => console.log(m));
  await campground.save();
  req.flash('success', 'a new review has been created')
  res.redirect(`/camps/${camp_id}`)
}


module.exports.destroy = async (req, res) => {
  const { review_id, camp_id } = req.params;
  await Campground.findByIdAndUpdate(camp_id, { $pull: { reviews: review_id } }).then(c => console.log(c))
  await Review.findByIdAndDelete(review_id).then(c => console.log(c))
  req.flash('success', 'review has been deleted')
  res.redirect(`/camps/${camp_id}`)
}