const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workoutSchema = new Schema({
  day: {
    type: Date,
    default: Date.now
  },
  exercises: [
  {
    // CARDIO: type, name distance, duration:
    // RESISTANCE: type, name, weight, sets, reps, duration
    
    type: {
      type: String,
      required: "Type of exercise is required"
    },
    name: {
      type: String,
      required: "Name of exercise is required"
    },
    duration: {
      type: Number,
      required: "Duration is required"
    },
    distance: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    sets: {
      type: Number,
    },
    reps: {
      type: Number,
    }
  }
  ]
});

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;
