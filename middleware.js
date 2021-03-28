const Campground = require('./models/campground');
const catchAsync = require("./utily/catchAsync");
const ErrorClass = require("./utily/errorclass");
const { CampgroundSchema, ReviewSchema } = require("./schema.js");
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // console.log(req.originalUrl, req.path) //checking to see what each one does 
    req.session.returnTo = req.originalUrl
    req.flash("error", "please log in")
    return res.redirect("/login")
  }
  next()
}

module.exports.ifLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.flash("error", "you're already logged in ")
    return res.redirect("/camps")
  }
  next()
}

module.exports.isAuthor = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const camp = await Campground.findById(id)
  if (!camp.author.equals(req.user._id)) {
    req.flash("error", "Wrong User")
    return res.redirect(`/camps/${id}`)
  }
  next()
})

module.exports.isReviewAuthor = catchAsync(async (req, res, next) => {
  const { review_id, camp_id } = req.params;
  const review = await Review.findById(review_id)
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "Wrong User")
    return res.redirect(`/camps/${camp_id}`)
  }
  next()
})


module.exports.validateCampGround = (req, res, next) => {

  const { error } = CampgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ErrorClass(msg, 400)
  }
  else (
    next()
  )
}

module.exports.validateReview = (req, res, next) => {

  const { error } = ReviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ErrorClass(msg, 400)
  }
  else (
    next()
  )
}

module.exports.MinImages = async (req, res, next) => {
  const { id } = req.params;
  if (req.body.deleteImages) {
    const dlt = req.body.deleteImages
    const img = req.files.map(f => ({ url: f.path, filename: f.filename }))
    console.log("come to papa")
    if (img.length >= dlt.length) {
      console.log("we entered here first")
      next()
    }
    else {
      const camp = await Campground.findById(id)
      if (camp.image.length + img.length > dlt.length) {
        next()
      }
      else {
        req.flash("error", "You Must Have atleast 1 Picture left")
        return res.redirect(`/camps/edit/${id}`)
      }
    }
  }
  else {
    next()
  }

}

module.exports.insertpix = async (req, res, next) => {
  console.log(1)
  const img = req.files.map(f => ({ url: f.path, filename: f.filename }))
  console.log(2)
  if (img.length > 0) {
    console.log(3)
    next()
  }
  else {
    req.flash("error", "You Must Have atleast 1 Picture")
    return res.redirect(`/camps/new`)
  }
}

