const express = require('express')
const { isSameUserOrAdmin } = require('../middleware')
const HealthCategoryRoute = express.Router()


HealthCategoryRoute.post("/health-category",isSameUserOrAdmin)

module.exports = HealthCategoryRoute

