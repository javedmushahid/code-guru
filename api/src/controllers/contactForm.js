const express = require("express");
const { loggerUtil } = require("../utils/logger");
const {
  OK,
  WRONG_ENTITY,
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR,
} = require("../utils/statusCode");
const ContactForm = require("../models/contactForm");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");
const credentials = require("../../userdetails-396105-d0276a6935f5.json");
const { google } = require("googleapis");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mushaid@flynaut.com", // Healthtag Email Address
    pass: "Mushahid@786", // Healthtag password
  },
});

const addContact = async (req, res) => {
  try {
    const { name, email, phoneNumber, message } = req.body;

    const auth = new google.auth.GoogleAuth({
      keyFile: "userdetails-396105-d0276a6935f5.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const client = await auth.getClient();

    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1ZZOtAVSHPO77rdtqTF1Txv1av7zJFrpsYXir2O87T94";
    const metaData = await googleSheets.spreadsheets.get({
      auth,
      spreadsheetId,
    });

    const getRows = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "Sheet1!A:A",
    });

    //   values: [[`${name}`, `${email}`,`${phoneNumber}`,`${message}`]],

    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "Sheet1!A:D",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[`${name}`, `${email}`, `+${phoneNumber}`, `${message}`]],
      },
    });

    // iamraj.1030@gmail.com
    const mailOptions = {
      from: "mushaid@flynaut.com",
      to: "javedmushahid@gmail.com,iamraj.1030@gmail.com",
      subject: "New Contact Form Submission Received",
      html: `
          <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
            <div style="background-color: #ffffff; border-radius: 5px; padding: 20px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #333;">New Contact Form Submission</h2>
              <p style="margin-top: 10px; font-size: 16px;">You have received a new contact form submission. Here are the details:</p>
              <ul style="list-style: none; margin: 0; padding: 0;">
                <li style="margin-top: 15px; font-size: 16px;">
                  <strong>Name:</strong> ${name}
                </li>
                <li style="margin-top: 5px; font-size: 16px;">
                  <strong>Email:</strong> ${email}
                </li>
                <li style="margin-top: 5px; font-size: 16px;">
                  <strong>Phone Number:</strong> +${phoneNumber}
                </li>
                <li style="margin-top: 5px; font-size: 16px;">
                  <strong>Message:</strong> ${message}
                </li>
              </ul>
              <p style="margin-top: 20px; color: #777; font-size: 14px;">Thank you for using our contact form. We appreciate your interest and will get back to you as soon as possible.</p>
            </div>
          </div>
        `,
    };

    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({
          error: "An error occurred while sending email.",
        });
      } else {
        // console.log("Email sent");

        const newContact = new ContactForm({
          name,
          email,
          phoneNumber,
          message,
        });

        await newContact.save();

        res
          .status(OK)
          .json({ message: "Contact added successfully", contact: newContact });
      }
    });
  } catch (error) {
    console.error("Error adding contact:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "An error occurred" });
  }
};

const getContact = async (req, res) => {
  try {
    const contacts = await ContactForm.find();

    res.status(OK).json({ contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "An error occurred" });
  }
};

module.exports = { addContact, getContact };
