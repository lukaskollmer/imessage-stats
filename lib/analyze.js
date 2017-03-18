const databasePath = require('./databasePath')();
const sqlite = require('sqlite3');
const model = require('./model');

const {
  Conversation,
  Handle,
  Message
} = model;



let conversations = {};

module.exports = (cb) => {
  const db = new sqlite.Database(databasePath);
  conversations = [];

  db.serialize(() => {
    db.get('SELECT Count(*) FROM message', (err, res) => {
      const numberOfMessages = res['Count(*)'];
      let index = 0;

      let allHandles = db.prepare('SELECT * FROM handle');
      allHandles.each((_, row) => {
        const handle = new Handle(row);
        conversations[handle.id] = {
          handle,
          messages: []
        };

        let allMessagesWithHandle = db.prepare(`SELECT * FROM message WHERE handle_id = ${handle.handle_id}`);
        allMessagesWithHandle.each((_, row) => {
          index++;
          let message = new Message(row);
          conversations[handle.id].messages.push(message);

          if (index === numberOfMessages) {
            db.close(() => {
              cb(conversations);
            })
          }
        });
        allMessagesWithHandle.finalize();

      });

      allHandles.finalize();

    });
  });
};
