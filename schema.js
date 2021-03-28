const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!'
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value) return helpers.error('string.escapeHTML', { value })
        return clean;
      }
    }
  }
});

const Joi = BaseJoi.extend(extension)

module.exports.CampgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
    price: Joi.number().min(0).required(),
  }).required(),
  deleteImages: Joi.array()
})


module.exports.ReviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required().escapeHTML(),
    rating: Joi.number().required().max(5).min(1),
  }).required()
})


