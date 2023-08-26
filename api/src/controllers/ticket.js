const Ticket = require("../models/TicketModel");
const User = require("../models/UserModel");
const { loggerUtil } = require("../utils/logger");
const { OK, BAD_REQUEST, NOT_FOUND } = require("../utils/statusCode");



const addTicket = async (req, res) => {
    try {
      const { ticketTitle, description, topic} = req.body;
      const { userId } = req.params;
  
     await User.findOne({ userId: userId }).then((user) => {
        const createTicket = new Ticket({
          user: user._id,
          ticketId: Math.floor(100000 + Math.random() * 999999),
          ticketTitle: ticketTitle,
          description: description,
          topic:topic,
        });
   
        createTicket.save().then(async (Ticket) => {
          res.status(OK).json({
            status: OK,
            message: "Ticket added successfuly",
            data: Ticket,
          });
        });
      });
    } catch (err) {
      loggerUtil(err, "ERROR");
    } finally {
      loggerUtil("Add Ticket API Called.");
    }
  };

  
const getTickets = async (req, res) => {
    try {
      const { userId } = req.params;
  
      User.findOne({ userId:userId }).then((user) => {
        Ticket.find({ user: user._id })
          .sort({ createdAt: -1 })
          .then((Tickets) => {
            if (!Tickets) {
              return res.status(NOT_FOUND).json({
                error: "No Tickets were found in DB!",
              });
            }
            res.status(OK).json({
              status: OK,
              message: "Tickets Fetched Successfully!",
              data: Tickets,
            });
          });
      });
    } catch (error) {
      loggerUtil(error, "ERROR");
    } finally {
      loggerUtil("Get Tickets API Called");
    }
  };
  
  
  const getTicketsByStatus = async (req, res) => {
    try {
      const {userId,status} = req.params;
      const user = await User.findOne({ userId });
  
      if(!user){
        return res.status(NOT_FOUND).json({ 
          status:NOT_FOUND,
          message: 'User not found' });
      }

      const tickets = await Ticket.find({ user: user._id, status});  
      res.status(OK).json({
        status:OK,
        message:'Searched Tickets by status ',
        data:tickets,
      })
    } catch (error) {
  
      loggerUtil(error, 'ERROR');
    } finally {
      loggerUtil('Get Tickets By Status API Called');
    }
  };
  
  
  
  module.exports = { addTicket, getTickets,getTicketsByStatus};