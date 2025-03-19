const timestamp = "23:37:26.478"
const [hours, minutes, seconds] = timestamp.split(':').map(Number);
const now = new Date();
const scheduledTime = new Date(
    now.getFullYear(), 
    now.getMonth(), 
    now.getDate(), 
    hours, 
    minutes, 
    Math.floor(seconds)
  );
  

  const localScheduledTime = new Date(
    scheduledTime.getTime() - (scheduledTime.getTimezoneOffset() * 60000)
  );
  
  if (localScheduledTime <= now) {
    localScheduledTime.setDate(localScheduledTime.getDate() + 1);
  }

  console.log(localScheduledTime)
  console.log(`${localScheduledTime.toISOString().split('.')[0]}`)