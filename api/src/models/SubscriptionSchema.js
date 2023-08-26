const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
   
   userId:{type:Number},
    plan: { type: String, enum: ['month', '6months', 'yearly'] },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    price: {
      type: Number,
      required: true,
      enum: {
        values: [12, 50, 100], 
        message: 'Invalid price for subscription plan',
      },
    },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  });
  


  const Subscription = mongoose.model('Subscription', SubscriptionSchema);
  module.exports = Subscription;