import mongoose from 'mongoose';

const travelSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  departureDate: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

export const Travel = mongoose.model('Travel', travelSchema);
