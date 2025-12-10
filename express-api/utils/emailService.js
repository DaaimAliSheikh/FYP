const nodemailer = require("nodemailer");
const config = require("../config/env");

// Create transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "daaimalisheikh23@gmail.com",
    pass: "dstv vfwc uqjy qjic",
  },
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log("Email service error:", error);
  } else {
    console.log("Email service is ready to send messages");
  }
});

/**
 * Send verification email to user
 * @param {string} email - User's email address
 * @param {string} username - User's username
 * @param {string} token - Verification token
 */
async function sendVerificationEmail(email, username, token) {
  const verificationUrl = `${config.CLIENT_BASE_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: '"Wedding Event Management System" <daaimalisheikh23@gmail.com>',
    to: email,
    subject: "Verify Your Email Address",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1976d2; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; }
            .button { 
              display: inline-block; 
              padding: 12px 30px; 
              background-color: #1976d2; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
            }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Wedding Event Management System!</h1>
            </div>
            <div class="content">
              <h2>Hi ${username},</h2>
              <p>Thank you for registering with us. Please verify your email address to complete your registration.</p>
              <p>Click the button below to verify your email:</p>
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button"  style="color: #fff;">Verify Email Address</a>
              </div>
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; color: #1976d2;">${verificationUrl}</p>
              <p><strong>This link will expire in 24 hours.</strong></p>
              <p>If you didn't create an account, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2025 WeddingEvent Management System. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
}

/**
 * Send password reset email to user
 * @param {string} email - User's email address
 * @param {string} username - User's username
 * @param {string} token - Reset password token
 */
async function sendPasswordResetEmail(email, username, token) {
  const resetUrl = `${config.CLIENT_BASE_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: '"Wedding Event Management System" <daaimalisheikh23@gmail.com>',
    to: email,
    subject: "Reset Your Password",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #d32f2f; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; }
            .button { 
              display: inline-block; 
              padding: 12px 30px; 
              background-color: #d32f2f; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
            }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hi ${username},</h2>
              <p>We received a request to reset your password. Click the button below to reset it:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button" style="color: #fff;">Reset Password</a>
              </div>
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; color: #d32f2f;">${resetUrl}</p>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If you didn't request a password reset, please ignore this email or contact support if you're concerned.</p>
            </div>
            <div class="footer">
              <p>© 2025 Wedding Event Management System. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
}

/**
 * Send enquiry notification email to vendor
 * @param {string} vendorEmail - Vendor's email address
 * @param {string} vendorName - Vendor/business name
 * @param {string} customerName - Customer's name
 * @param {string} customerEmail - Customer's email
 * @param {string} customerPhone - Customer's phone
 * @param {string} enquiryMessage - Enquiry message
 * @param {string} vendorType - Type of vendor (venue, catering, etc.)
 * @param {string} enquiryId - Enquiry ID
 */
async function sendEnquiryNotificationEmail(
  vendorEmail,
  vendorName,
  customerName,
  customerEmail,
  customerPhone,
  enquiryMessage,
  vendorType,
  enquiryId
) {
  const enquiriesUrl = `${config.CLIENT_BASE_URL}/dashboard/${vendorType}/enquiries`;

  // Capitalize vendor type for display
  const vendorTypeFormatted = vendorType
    .replace("_", " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const mailOptions = {
    from: '"Wedding Event Management System" <daaimalisheikh23@gmail.com>',
    to: vendorEmail,
    subject: `New Enquiry for Your ${vendorTypeFormatted} Service`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1976d2; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; }
            .enquiry-details { 
              background-color: white; 
              padding: 20px; 
              border-radius: 8px; 
              margin: 20px 0;
              border-left: 4px solid #1976d2;
            }
            .customer-info { margin: 15px 0; }
            .customer-info strong { color: #1976d2; }
            .message-box { 
              background-color: #f5f5f5; 
              padding: 15px; 
              border-radius: 5px; 
              margin: 15px 0;
              border: 1px solid #ddd;
            }
            .button { 
              display: inline-block; 
              padding: 12px 30px; 
              background-color: #1976d2; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
            }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 New Customer Enquiry!</h1>
            </div>
            <div class="content">
              <h2>Hi ${vendorName},</h2>
              <p>You have received a new enquiry for your ${vendorTypeFormatted.toLowerCase()} service through our platform.</p>
              
              <div class="enquiry-details">
                <h3>Customer Details:</h3>
                <div class="customer-info">
                  <strong>Name:</strong> ${customerName}<br>
                  <strong>Email:</strong> ${customerEmail}<br>
                  <strong>Phone:</strong> ${customerPhone}
                </div>
                
                <h3>Enquiry Message:</h3>
                <div class="message-box">
                  "${enquiryMessage}"
                </div>
                
                <p><strong>Enquiry ID:</strong> #${enquiryId
                  .toString()
                  .slice(-8)
                  .toUpperCase()}</p>
                <p><strong>Received:</strong> ${new Date().toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}</p>
              </div>
              
              <div style="text-align: center;">
                <a href="${enquiriesUrl}" class="button" style="color: #fff;">View All Enquiries</a>
              </div>
              
              <p>Please respond to the customer promptly to provide excellent service and grow your business.</p>
              
              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>Log in to your dashboard to view the full enquiry</li>
                <li>Contact the customer directly via phone or email</li>
                <li>Mark the enquiry as closed once resolved</li>
              </ul>
              
            </div>
            <div class="footer">
              <p>© 2025 Wedding Event Management System. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Enquiry notification email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending enquiry notification email:", error);
    throw error;
  }
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendEnquiryNotificationEmail,
};
