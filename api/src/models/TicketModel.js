const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticketId: { type: Number, required: [true, "Ticket ID is required"] },
    ticketTitle: { type: String, required: [true, "Ticket title is required"] },
    description: { type: String, required: [true, "Description is required"] },
    status: { type: Number, enum: [0, 1], default: 0 },
    topic: { type: String, enum: ["payments1", "payments2", "payments3", "payments4"] }

  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
