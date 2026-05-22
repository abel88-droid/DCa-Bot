const reminders = new Map(); 

let idCounter = 0;

function addReminder(userId, text, duration, sendCallback) {
  const id = ++idCounter;
  const timeout = setTimeout(() => {
    sendCallback();
    removeReminder(userId, id); 
  }, duration);

  if (!reminders.has(userId)) reminders.set(userId, []);
  reminders.get(userId).push({ id, text, timeout, duration });

  return id;
}

function getReminders(userId) {
  return reminders.get(userId) || [];
}

function removeReminder(userId, id) {
  const userReminders = reminders.get(userId);
  if (!userReminders) return false;

  const index = userReminders.findIndex(r => r.id === id);
  if (index === -1) return false;

  clearTimeout(userReminders[index].timeout);
  userReminders.splice(index, 1);
  return true;
}

module.exports = { addReminder, getReminders, removeReminder };
