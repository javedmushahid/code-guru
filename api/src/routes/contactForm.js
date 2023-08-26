const express = require('express')
const { addContact, getContact } = require('../controllers/contactForm');

const contactFormRoute=express.Router();

contactFormRoute.post("/contact-details/",addContact)

contactFormRoute.get("/contact-details/",getContact)



module.exports=contactFormRoute;