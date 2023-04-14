
// Initialize MongoDB
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const url = ''; // TODO: replace with mongo connection string
// const mongo_client = new MongoClient(url, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// Initialize Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio_client = require('twilio')(accountSid, authToken);

function sendMessage(number, timeToPickup) {
  twilio_client.messages
    .create({
      body: `Reminder: pickup in ${timeToPickup}!`,
      to: number,
      from: '+16017518157',
    })
    .then((message) => console.log(message.sid))
    .catch((error) => {
      console.log(error);
    });
}

function subtractMinutes(date, minutes) {
  const copy = new Date(date);
  copy.setMinutes(date.getMinutes() - minutes);
  return copy;
}

/**
 * Send pending messages
 */
function checkTime() {
  while (new Date() >= message_dates.peek().timeToPickup) {
    msg = message_dates.dequeue();
    sendMessage(msg.clientNumber, msg.timeToPickup);
  }
}

// Initialize when to send messages based on order_dates
// Using priority queue for fast ordering and edits to message_dates
const PriorityQueue = require('js-priority-queue');
let message_dates = new PriorityQueue({ comparator: (a, b) => a.messageTime - b.messageTime });
var order_dates = [new Date('2023-06-01T08:15:00'), new Date('2023-05-01T10:00:00')];

order_dates.forEach((date) => {
  message_dates.queue({
    clientNumber: '+16035849900', // TODO: use actual client number
    timeToPickup: '15 minutes',
    messageTime: subtractMinutes(date, 15)
  });
  // Can push more times if multiple reminders for each order
})

// message_dates[0] is the most recent message to send
// while (message_dates.length > 0) {
//   console.log(message_dates.dequeue().messageTime);
// }

// setInterval(checkTime, 60000); // Check if any messages need to be sent every minute
