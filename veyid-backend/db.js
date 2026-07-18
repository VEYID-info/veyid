const { Low } = require("lowdb");
const { JSONFile } = require("lowdb/node");

const adapter = new JSONFile("db.json");
const db = new Low(adapter, {
  verifications: [],
});

async function initDB() {
  await db.read();

  db.data ||= {
    verifications: [],
  };

  await db.write();
}

module.exports = {
  db,
  initDB,
};
