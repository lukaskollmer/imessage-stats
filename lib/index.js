const analyze = require('./analyze');
const Table = require('cli-table');
const nameForProperty = require('./contacts');

console.log("Gathering data. This may take a couple of minutes...");

analyze(data => {
  let conversations = [];

  for (let handleId in data) {
    conversations.push(data[handleId]);
  }

  conversations.sort((obj1, obj2) => {
    return obj2.messages.length - obj1.messages.length;
  });

  let table = new Table({
    head: ["Contact", "Number of Messages"],
    colWidths: [40, 40]
  });

  for (let conversation of conversations) {
    table.push([nameForProperty(conversation.handle.id), conversation.messages.length]);
  }

  console.log(table.toString());

});
