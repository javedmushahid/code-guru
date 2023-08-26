const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  text: { type: String, required: true },
  answers: { type: [String], required: true },
  correctAnswerIndex: { type: Number, required: true },
});

const healthCategorySchema = new Schema({
  OSA: {
    type: Boolean,
    default: false,
    questions: [
      new questionSchema({
        text: "In the past 4 weeks, how much of the time did your asthma keep you from getting as much done at work, school or at home?",
        answers: [
          "All of the time",
          "Most of the time",
          "Some of the time",
          "A little of the time",
          "None of the time",
        ],
        correctAnswerIndex: 0,
      }),
      new questionSchema({
        text: "During the past 4 weeks, how often have you had shortness of breath?",
        answers: [
          "More than Once a day",
          "Once a day",
          "3 to 6 times a week",
          "Once or twice a week",
          "Not at all",
        ],
        correctAnswerIndex: 3,
      }),
      new questionSchema({
        text: "During the past 4 weeks, how often have you had shortness of breath?",
        answers: [
          "More than Once a day",
          "Once a day",
          "3 to 6 times a week",
          "Once or twice a week",
          "Not at all",
        ],
        correctAnswerIndex: 1,
      }),
      new questionSchema({
        text: "In the past 4 weeks, how much of the time did your asthma keep you from getting as much done at work, school or at home?",
        answers: [
          "All of the time",
          "Most of the time",
          "Some of the time",
          "A little of the time",
          "None of the time",
        ],
        correctAnswerIndex: 4,
      }),
      new questionSchema({
        text: "During the past 4 weeks, how often have you had shortness of breath?",
        answers: [
          "More than Once a day",
          "Once a day",
          "3 to 6 times a week",
          "Once or twice a week",
          "Not at all",
        ],
        correctAnswerIndex: 2,
      }),
    ],
  },
  COPD: {
    type: Boolean,
    default: false,
    questions: [
      new questionSchema({
        text: "In the past 4 weeks, how much of the time did your asthma keep you from getting as much done at work, school or at home?",
        answers: [
          "All of the time",
          "Most of the time",
          "Some of the time",
          "A little of the time",
          "None of the time",
        ],
        correctAnswerIndex: 0,
      }),
      new questionSchema({
        text: "During the past 4 weeks, how often have you had shortness of breath?",
        answers: [
          "More than Once a day",
          "Once a day",
          "3 to 6 times a week",
          "Once or twice a week",
          "Not at all",
        ],
        correctAnswerIndex: 3,
      }),
      new questionSchema({
        text: "During the past 4 weeks, how often have you had shortness of breath?",
        answers: [
          "More than Once a day",
          "Once a day",
          "3 to 6 times a week",
          "Once or twice a week",
          "Not at all",
        ],
        correctAnswerIndex: 1,
      }),
      new questionSchema({
        text: "In the past 4 weeks, how much of the time did your asthma keep you from getting as much done at work, school or at home?",
        answers: [
          "All of the time",
          "Most of the time",
          "Some of the time",
          "A little of the time",
          "None of the time",
        ],
        correctAnswerIndex: 4,
      }),
      new questionSchema({
        text: "During the past 4 weeks, how often have you had shortness of breath?",
        answers: [
          "More than Once a day",
          "Once a day",
          "3 to 6 times a week",
          "Once or twice a week",
          "Not at all",
        ],
        correctAnswerIndex: 2,
      }),
    ],
  },
  Asthma: {
    type: Boolean,
    default: false,
    questions: [
      new questionSchema({
        text: "In the past 4 weeks, how much of the time did your asthma keep you from getting as much done at work, school or at home?",
        answers: [
          "All of the time",
          "Most of the time",
          "Some of the time",
          "A little of the time",
          "None of the time",
        ],
        correctAnswerIndex: 0,
      }),
      new questionSchema({
        text: "During the past 4 weeks, how often have you had shortness of breath?",
        answers: [
          "More than Once a day",
          "Once a day",
          "3 to 6 times a week",
          "Once or twice a week",
          "Not at all",
        ],
        correctAnswerIndex: 3,
      }),
      new questionSchema({
        text: "During the past 4 weeks, how often have you had shortness of breath?",
        answers: [
          "More than Once a day",
          "Once a day",
          "3 to 6 times a week",
          "Once or twice a week",
          "Not at all",
        ],
        correctAnswerIndex: 1,
      }),
      new questionSchema({
        text: "In the past 4 weeks, how much of the time did your asthma keep you from getting as much done at work, school or at home?",
        answers: [
          "All of the time",
          "Most of the time",
          "Some of the time",
          "A little of the time",
          "None of the time",
        ],
        correctAnswerIndex: 4,
      }),
      new questionSchema({
        text: "During the past 4 weeks, how often have you had shortness of breath?",
        answers: [
          "More than Once a day",
          "Once a day",
          "3 to 6 times a week",
          "Once or twice a week",
          "Not at all",
        ],
        correctAnswerIndex: 2,
      }),
    ],
  },

  Diabetes: {
    type: Boolean,
    default: false,
    questions: [
      new questionSchema({
        text: "In the past 4 weeks, how much of the time did your asthma keep you from getting as much done at work, school or at home?",
        answers: [
          "All of the time",
          "Most of the time",
          "Some of the time",
          "A little of the time",
          "None of the time",
        ],
        correctAnswerIndex: 0,
      }),
      new questionSchema({
        text: "During the past 4 weeks, how often have you had shortness of breath?",
        answers: [
          "More than Once a day",
          "Once a day",
          "3 to 6 times a week",
          "Once or twice a week",
          "Not at all",
        ],
        correctAnswerIndex: 3,
      }),
      new questionSchema({
        text: "During the past 4 weeks, how often have you had shortness of breath?",
        answers: [
          "More than Once a day",
          "Once a day",
          "3 to 6 times a week",
          "Once or twice a week",
          "Not at all",
        ],
        correctAnswerIndex: 1,
      }),
      new questionSchema({
        text: "In the past 4 weeks, how much of the time did your asthma keep you from getting as much done at work, school or at home?",
        answers: [
          "All of the time",
          "Most of the time",
          "Some of the time",
          "A little of the time",
          "None of the time",
        ],
        correctAnswerIndex: 4,
      }),
      new questionSchema({
        text: "During the past 4 weeks, how often have you had shortness of breath?",
        answers: [
          "More than Once a day",
          "Once a day",
          "3 to 6 times a week",
          "Once or twice a week",
          "Not at all",
        ],
        correctAnswerIndex: 2,
      }),
    ],
  },

  Weight_Management: {
    type: Boolean,
    default: false,
    questions: [
      new questionSchema({
        text: "In the past 4 weeks, how much of the time did your asthma keep you from getting as much done at work, school or at home?",
        answers: [
          "All of the time",
          "Most of the time",
          "Some of the time",
          "A little of the time",
          "None of the time",
        ],
        correctAnswerIndex: 0,
      }),
      new questionSchema({
        text: "During the past 4 weeks, how often have you had shortness of breath?",
        answers: [
          "More than Once a day",
          "Once a day",
          "3 to 6 times a week",
          "Once or twice a week",
          "Not at all",
        ],
        correctAnswerIndex: 3,
      }),
      new questionSchema({
        text: "During the past 4 weeks, how often have you had shortness of breath?",
        answers: [
          "More than Once a day",
          "Once a day",
          "3 to 6 times a week",
          "Once or twice a week",
          "Not at all",
        ],
        correctAnswerIndex: 1,
      }),
      new questionSchema({
        text: "In the past 4 weeks, how much of the time did your asthma keep you from getting as much done at work, school or at home?",
        answers: [
          "All of the time",
          "Most of the time",
          "Some of the time",
          "A little of the time",
          "None of the time",
        ],
        correctAnswerIndex: 4,
      }),
      new questionSchema({
        text: "During the past 4 weeks, how often have you had shortness of breath?",
        answers: [
          "More than Once a day",
          "Once a day",
          "3 to 6 times a week",
          "Once or twice a week",
          "Not at all",
        ],
        correctAnswerIndex: 2,
      }),
    ],
  },

  Hypertension: {
    type: Boolean,
    default: false,
    questions: [
      new questionSchema({
        text: "In the past 4 weeks, how much of the time did your asthma keep you from getting as much done at work, school or at home?",
        answers: [
          "All of the time",
          "Most of the time",
          "Some of the time",
          "A little of the time",
          "None of the time",
        ],
        correctAnswerIndex: 0,
      }),
      new questionSchema({
        text: "During the past 4 weeks, how often have you had shortness of breath?",
        answers: [
          "More than Once a day",
          "Once a day",
          "3 to 6 times a week",
          "Once or twice a week",
          "Not at all",
        ],
        correctAnswerIndex: 3,
      }),
      new questionSchema({
        text: "During the past 4 weeks, how often have you had shortness of breath?",
        answers: [
          "More than Once a day",
          "Once a day",
          "3 to 6 times a week",
          "Once or twice a week",
          "Not at all",
        ],
        correctAnswerIndex: 1,
      }),
      new questionSchema({
        text: "In the past 4 weeks, how much of the time did your asthma keep you from getting as much done at work, school or at home?",
        answers: [
          "All of the time",
          "Most of the time",
          "Some of the time",
          "A little of the time",
          "None of the time",
        ],
        correctAnswerIndex: 4,
      }),
      new questionSchema({
        text: "During the past 4 weeks, how often have you had shortness of breath?",
        answers: [
          "More than Once a day",
          "Once a day",
          "3 to 6 times a week",
          "Once or twice a week",
          "Not at all",
        ],
        correctAnswerIndex: 2,
      }),
    ],
  },

  Aging: {
    type: Boolean,
    default: false,
    questions: [
      new questionSchema({
        text: "In the past 4 weeks, how much of the time did your asthma keep you from getting as much done at work, school or at home?",
        answers: [
          "All of the time",
          "Most of the time",
          "Some of the time",
          "A little of the time",
          "None of the time",
        ],
        correctAnswerIndex: 0,
      }),
      new questionSchema({
        text: "During the past 4 weeks, how often have you had shortness of breath?",
        answers: [
          "More than Once a day",
          "Once a day",
          "3 to 6 times a week",
          "Once or twice a week",
          "Not at all",
        ],
        correctAnswerIndex: 3,
      }),
      new questionSchema({
        text: "During the past 4 weeks, how often have you had shortness of breath?",
        answers: [
          "More than Once a day",
          "Once a day",
          "3 to 6 times a week",
          "Once or twice a week",
          "Not at all",
        ],
        correctAnswerIndex: 1,
      }),
      new questionSchema({
        text: "In the past 4 weeks, how much of the time did your asthma keep you from getting as much done at work, school or at home?",
        answers: [
          "All of the time",
          "Most of the time",
          "Some of the time",
          "A little of the time",
          "None of the time",
        ],
        correctAnswerIndex: 4,
      }),
      new questionSchema({
        text: "During the past 4 weeks, how often have you had shortness of breath?",
        answers: [
          "More than Once a day",
          "Once a day",
          "3 to 6 times a week",
          "Once or twice a week",
          "Not at all",
        ],
        correctAnswerIndex: 2,
      }),
    ],
  },
},{ timestamps: true });

const HealthCategory = mongoose.model("HealthCategory", healthCategorySchema);
module.exports = HealthCategory;
