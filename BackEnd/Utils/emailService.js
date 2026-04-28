const nodemailer = require("nodemailer");

// Configure transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false }
});

// Primary Brand Colors
// Primary: #3081D0 (Blue)
// Success: #10B981 (Green)
// Danger: #EF4444 (Red)
// Warning: #F59E0B (Yellow)

const emailTemplateWrapper = (title, content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f4f7f6;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .email-container {
      max-width: 650px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
      border: 1px solid #eaeaea;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        margin: 15px !important;
        border-radius: 12px !important;
        width: auto !important;
      }
      .header, .body-content, .footer {
        padding: 20px 15px !important;
      }
      .greeting {
        font-size: 18px !important;
      }
    }
    .header {
      background-color: #ffffff;
      padding: 30px 40px;
      text-align: center;
      border-bottom: 4px solid #10B981;
    }
    .header img {
      height: 55px;
      margin-bottom: 15px;
    }
    .header h1 {
      color: #0f172a;
      font-size: 24px;
      margin: 0;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .body-content {
      padding: 40px;
      color: #334155;
      line-height: 1.7;
      font-size: 16px;
    }
    .footer {
      background-color: #f8fafc;
      padding: 25px 40px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      color: #94a3b8;
      font-size: 13px;
      margin: 5px 0;
    }
    .btn {
      display: inline-block;
      background-color: #10B981;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 25px 0;
      box-shadow: 0 4px 6px rgba(16, 185, 129, 0.25);
      transition: all 0.3s ease;
    }
    .greeting {
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 20px;
    }
    .box-info {
      background-color: #f1f5f9;
      border-left: 4px solid #10B981;
      padding: 20px;
      border-radius: 0 8px 8px 0;
      margin: 25px 0;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <img src="https://raw.githubusercontent.com/ShawkyMohamed2004/enjaz-task-manager/main/FrontEnd/src/assets/logos/logo-full.png" alt="Enjaz Logo" />
      <h1>${title}</h1>
    </div>
    <div class="body-content">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; 2026 Enjaz Task Manager. All rights reserved.</p>
      <p>You received this email because you are registered on Enjaz.</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Sends a password change confirmation email
 */
const sendPasswordChangeConfirmation = async (email, userName) => {
  const content = `
    <h2 class="greeting">Security Alert 🔒</h2>
    <p>Hello <strong>${userName}</strong>,</p>
    <p>This is a confirmation that your Enjaz account password has been successfully updated just now.</p>
    <div class="box-info">
      <p style="margin: 0;"><strong>Action:</strong> Password Changed</p>
      <p style="margin: 5px 0 0 0;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
    </div>
    <p>If you made this change, you can safely ignore this email. You can now log in with your new credentials.</p>
    <div style="text-align: center;">
      <a href="${process.env.FRONTEND_DOMAIN}" class="btn">Login to Enjaz</a>
    </div>
    <p style="color: #ef4444; font-size: 14px; margin-top: 30px;">
      <strong>Didn't do this?</strong> Please contact our support team immediately to secure your account.
    </p>
  `;

  return transporter.sendMail({
    from: '"Enjaz Security" <' + process.env.EMAIL_USER + '>',
    to: email,
    subject: "Password Changed Successfully - Enjaz",
    html: emailTemplateWrapper("Password Update", content)
  });
};

/**
 * Sends a password reset link email
 */
const sendPasswordResetEmail = async (email, resetLink) => {
  const content = `
    <h2 class="greeting">Reset Your Password 🔑</h2>
    <p>Hello Enjaz User,</p>
    <p>We received a request to reset the password for the account associated with this email address.</p>
    <div style="text-align: center; padding: 20px 0;">
      <p style="margin-bottom: 25px; font-weight: 500;">Click the button below to choose a new password:</p>
      <a href="${resetLink}" class="btn" style="background-color: #10B981; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.25);">Reset Password</a>
    </div>
    <div class="box-info" style="border-left-color: #F59E0B; background-color: #FEF3C7;">
      <p style="margin: 0; color: #92400E;"><strong>Note:</strong> This link will expire in exactly <strong>10 minutes</strong> for your security.</p>
    </div>
    <p style="font-size: 14px; color: #64748b;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
  `;

  return transporter.sendMail({
    from: '"Enjaz Support" <' + process.env.EMAIL_USER + '>',
    to: email,
    subject: "Password Reset Request - Enjaz",
    html: emailTemplateWrapper("Account Recovery", content)
  });
};

/**
 * Sends a welcome email to newly registered users
 */
const sendWelcomeEmail = async (email, userName) => {
  const content = `
    <h2 class="greeting" style="line-height: 1.3; margin-bottom: 15px;">Welcome,<br><span style="color: #10B981;">${userName}</span> 🎉</h2>
    <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 25px;">We are absolutely thrilled to have you join the Enjaz community. Enjaz is your ultimate productivity companion, carefully designed to help you stay organized, focused, and in control of your daily goals.</p>
    
    <h3 style="color: #0f172a; margin-top: 30px;">Here is how you can get started:</h3>
    <ul style="padding-left: 20px; margin-bottom: 30px; color: #334155; line-height: 1.7;">
      <li style="margin-bottom: 15px;">🚀 <strong>Advanced Tasks:</strong> Manage your comprehensive projects with full priority and deadline tracking.</li>
      <li style="margin-bottom: 15px;">✅ <strong>Daily Checklists:</strong> Organize your day with lightweight, real-time To-Do items.</li>
      <li style="margin-bottom: 15px;">📝 <strong>Personal Notes:</strong> Capture your brilliant ideas and pin the most important ones.</li>
    </ul>

    <div class="box-info" style="border-left-color: #3B82F6; background-color: #EFF6FF;">
      <p style="margin: 0; color: #1E3A8A; font-weight: 600;">🔒 Smart Notifications:</p>
      <p style="margin: 5px 0 0 0; color: #1E3A8A; font-size: 14px;">You will receive <strong>Login Alerts</strong> to keep your account secure, and customizable <strong>Daily Reminders</strong> (at your preferred time) to keep you on top of your schedule.</p>
    </div>

    <div style="text-align: center; margin-top: 40px;">
      <a href="${process.env.FRONTEND_DOMAIN}" class="btn">Get Started Now</a>
    </div>
    
    <p style="margin-top: 40px; color: #64748b;">If you need any assistance, our team is always here for you. Just reply to this email!</p>
    <p style="color: #64748b;">Best regards,<br><strong style="color: #334155;">The Enjaz Team</strong></p>
  `;

  return transporter.sendMail({
    from: '"Enjaz Task Manager" <' + process.env.EMAIL_USER + '>',
    to: email,
    subject: "Welcome to Enjaz Task Manager! 🚀",
    html: emailTemplateWrapper("Welcome to Enjaz", content)
  });
};

/**
 * Sends an email when a new login is detected
 */
const sendNewLoginAlert = async (email, userName, deviceInfo) => {
  const content = `
    <h2 class="greeting">New Login Detected 🛡️</h2>
    <p>Hello <strong>${userName}</strong>,</p>
    <p>We noticed a successful login to your Enjaz account from a new device or browser.</p>
    
    <div class="box-info" style="border-left-color: #6366F1; background-color: #EEF2FF;">
      <p style="margin: 0 0 10px 0; color: #3730A3;"><strong>Date & Time:</strong> ${new Date().toLocaleString()}</p>
      <p style="margin: 0; color: #3730A3; line-height: 1.5;"><strong>Device/Browser:</strong><br><span style="font-size: 14px; opacity: 0.9;">${deviceInfo}</span></p>
    </div>

    <p style="font-size: 14px; color: #64748b;">If this was you, there is nothing you need to do. If you do not recognize this activity, please log in and change your password immediately.</p>
  `;

  return transporter.sendMail({
    from: '"Enjaz Security" <' + process.env.EMAIL_USER + '>',
    to: email,
    subject: "New Login to Your Enjaz Account",
    html: emailTemplateWrapper("Security Alert", content)
  });
};

/**
 * Sends a daily task reminder email
 */
const sendDailyReminder = async (email, userName, tasksArray, todosArray) => {
  
  const getPriorityBadge = (priority) => {
    let color = "#3B82F6"; // Low - Blue
    let bg = "#DBEAFE";
    if (priority === "High") { color = "#EF4444"; bg = "#FEE2E2"; }
    else if (priority === "Medium") { color = "#F59E0B"; bg = "#FEF3C7"; }
    
    return `<span style="background-color: ${bg}; color: ${color}; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; display: inline-block; text-align: center; min-width: 60px;">${priority}</span>`;
  };

  const getDynamicGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  let tasksHtml = '';
  if (tasksArray && tasksArray.length > 0) {
    tasksHtml = `
      <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 30px;">📋 Tasks Due Today (${tasksArray.length})</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
    `;
    tasksArray.forEach((task, index) => {
      const bgColor = index % 2 === 0 ? "#ffffff" : "#f8fafc";
      tasksHtml += `
        <tr style="background-color: ${bgColor};">
          <td style="padding: 12px 10px; border: 1px solid #e2e8f0; border-right: none; border-radius: 8px 0 0 8px;">
            <strong style="color: #1e293b; font-size: 14px; word-break: break-word;">${task.taskName}</strong>
          </td>
          <td style="padding: 12px 10px; border: 1px solid #e2e8f0; border-left: none; text-align: right; border-radius: 0 8px 8px 0; width: 80px;">
            ${getPriorityBadge(task.priority || 'Normal')}
          </td>
        </tr>
      `;
    });
    tasksHtml += `</table>`;
  } else {
    tasksHtml = `
      <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 30px;">📋 Tasks Due Today</h3>
      <p style="color: #64748b; font-style: italic; background-color: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; border: 1px dashed #cbd5e1; font-size: 14px;">You have 0 tasks due today. Great job keeping up!</p>
    `;
  }

  let todosHtml = '';
  if (todosArray && todosArray.length > 0) {
    todosHtml = `
      <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 40px;">✅ Daily To-Dos (${todosArray.length})</h3>
      <ul style="list-style: none; padding: 0; margin-top: 15px;">
    `;
    todosArray.forEach(todo => {
      todosHtml += `
        <li style="background-color: #ffffff; border: 1px solid #e2e8f0; padding: 12px 15px; margin-bottom: 10px; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.02); display: flex; align-items: center; width: 100%; box-sizing: border-box;">
          <div style="width: 16px; height: 16px; border: 2px solid #cbd5e1; border-radius: 4px; margin-right: 12px; flex-shrink: 0;"></div>
          <div style="color: #334155; font-size: 14px; flex-grow: 1; word-break: break-word; padding-right: 10px; line-height: 1.4;">${todo.title}</div>
          <div style="background-color: #f1f5f9; color: #64748b; font-size: 10px; padding: 5px 10px; border-radius: 12px; font-weight: 600; flex-shrink: 0; white-space: nowrap;">${todo.category || 'General'}</div>
        </li>
      `;
    });
    todosHtml += `</ul>`;
  } else {
    todosHtml = `
      <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 40px;">✅ Daily To-Dos</h3>
      <p style="color: #64748b; font-style: italic; background-color: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; border: 1px dashed #cbd5e1; font-size: 14px;">No pending To-Dos for today.</p>
    `;
  }

  const content = `
    <h2 class="greeting" style="line-height: 1.3; margin-bottom: 15px;">${getDynamicGreeting()},<br><span style="color: #10B981;">${userName}</span></h2>
    <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 25px;">We hope you are having a wonderful day. Below is a summary of your scheduled tasks and daily checklist to help you stay on track and achieve your goals.</p>
    
    ${tasksHtml}
    ${todosHtml}

    <div style="text-align: center; margin-top: 40px;">
      <a href="${process.env.FRONTEND_DOMAIN}/Home" class="btn">Open My Dashboard</a>
    </div>
  `;

  return transporter.sendMail({
    from: '"Enjaz Reminder" <' + process.env.EMAIL_USER + '>',
    to: email,
    subject: "Your Daily Enjaz Agenda 📅",
    html: emailTemplateWrapper("Daily Summary", content)
  });
};

module.exports = {
  sendPasswordChangeConfirmation,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendNewLoginAlert,
  sendDailyReminder
};
