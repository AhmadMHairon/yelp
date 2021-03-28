const express = require("express");
const router = express.Router({ mergeParams: true })
const Review = require('../models/review');
const ErrorClass = require("../utily/errorclass")
const catchAsync = require("../utily/catchAsync");
const Campground = require('../models/campground');
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware")
const reviewController = require("../controllers/reviewController")








router.post("/:camp_id/new", isLoggedIn, validateReview, catchAsync(reviewController.create))




router.delete('/:review_id/:camp_id', isLoggedIn, isReviewAuthor, catchAsync(reviewController.destroy))



module.exports = router