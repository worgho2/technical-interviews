db.createUser({
  user: 'development',
  pwd: 'development',
  roles: [
    {
      role: 'readWrite',
      db: 'development',
    },
  ],
});

// db.getSiblingDB('admin').auth(
//   process.,
//   process.env.MONGO_INITDB_ROOT_PASSWORD
// );
// db.createUser({
//   user: process.env.MONGO_USER,
//   pwd: process.env.MONGO_PASSWORD,
//   roles: ["readWrite"],
// });
