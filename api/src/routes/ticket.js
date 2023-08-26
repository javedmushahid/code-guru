const express = require("express");
const { getTickets, addTicket ,getTicketsByStatus} = require("../controllers/ticket");
const { isSameUserOrAdmin } = require("../middleware");

const ticketsRoute = express.Router();

ticketsRoute.get("/ticket/:userId", isSameUserOrAdmin, getTickets);

ticketsRoute.post("/ticket/:userId", isSameUserOrAdmin, addTicket);

ticketsRoute.get("/getstatus/:userId/:status", isSameUserOrAdmin, getTicketsByStatus);


module.exports = ticketsRoute;
