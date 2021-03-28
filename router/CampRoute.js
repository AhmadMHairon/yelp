const express = require("express");
const router = express.Router()
const catchAsync = require("../utily/catchAsync");
const { isLoggedIn, isAuthor, validateCampGround, MinImages, insertpix } = require("../middleware")
const ErrorClass = require("../utily/errorclass")
const Campground = require('../models/campground');
const campController = require("../controllers/campController")
const multer = require('multer')
const { storage } = require("../cloudinary/index")
const upload = multer({ storage })


router.get("/", catchAsync(campController.getIndex))

router.get("/new", isLoggedIn, campController.getNewForm)

router.get("/edit/:id", isLoggedIn, isAuthor, catchAsync(campController.getEdit))

router.get("/:id", catchAsync(campController.getInfo))

router.post("/", isLoggedIn, upload.array('image'), insertpix, validateCampGround, catchAsync(campController.create))

router.patch('/:id', isLoggedIn, isAuthor, upload.array('image'), MinImages, validateCampGround, catchAsync(campController.update))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campController.destroy))


module.exports = router