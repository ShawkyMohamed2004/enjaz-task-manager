const cron = require('node-cron');
const authModel = require('./Models/Model');
const dataModel = require('./Models/DataModel');
const emailService = require('./Utils/emailService');

// Function to check if a date string is today
const isToday = (dateStr) => {
  if (!dateStr) return false;
  try {
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) return false;
    
    const now = new Date();
    return parsed.getDate() === now.getDate() &&
           parsed.getMonth() === now.getMonth() &&
           parsed.getFullYear() === now.getFullYear();
  } catch (err) {
    return false;
  }
};

// Run every minute to check if it's someone's custom reminder time
const startCronJobs = () => {
  console.log("CRON: Scheduled daily reminder job running every minute");
  
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const currentHour = String(now.getHours()).padStart(2, '0');
      const currentMin = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${currentHour}:${currentMin}`;

      // Get users whose reminderTime matches current time (treat missing dailyReminders as true)
      const users = await authModel.find({ 
        $or: [{ dailyReminders: true }, { dailyReminders: { $exists: false } }],
        reminderTime: currentTime 
      });
      
      if (users.length === 0) {
        return;
      }

      console.log(`[${now.toLocaleTimeString()}] CRON: Found ${users.length} user(s) to notify at ${currentTime}...`);

      for (const user of users) {
        if (!user.email) continue;
        
        // Get user data
        const userData = await dataModel.findById(user._id);
        if (!userData) continue;
        
        const tasksDueToday = [];
        const todosDueToday = [];
        
        // Check tasks
        if (userData.tasks && userData.tasks.length > 0) {
          userData.tasks.forEach(taskObj => {
            if (!taskObj.done && taskObj.task && isToday(taskObj.task.deadline)) {
              tasksDueToday.push(taskObj.task);
            }
          });
        }
        
        // Check todos (ALL pending todos regardless of creation date)
        if (userData.todos && userData.todos.length > 0) {
          userData.todos.forEach(todo => {
            if (!todo.status) {
              todosDueToday.push(todo);
            }
          });
        }
        
        // If there are things due today, send email (even if tasks is 0 but todos is 5, etc.)
        if (tasksDueToday.length > 0 || todosDueToday.length > 0) {
          await emailService.sendDailyReminder(user.email, user.userName, tasksDueToday, todosDueToday);
          console.log(`[${now.toLocaleTimeString()}] CRON: Sent reminder to ${user.email} (Tasks: ${tasksDueToday.length}, Todos: ${todosDueToday.length})`);
        }
      }
    } catch (err) {
      console.error("CRON Error running daily reminder job:", err);
    }
  });
};

module.exports = { startCronJobs };
