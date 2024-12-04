db = db.getSiblingDB('database1'); // Switch to 'database1'
db.createUser({
  user: "node",
  pwd: "password1234",
  roles: [{ role: "readWrite", db: "database1" }]
});
db.createCollection('Orders');
