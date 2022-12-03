const DATABASE_NAME = "cloud-market-at-home";

const CONNECTION_STRING = `mongodb+srv://ducBird:ducBird@cmah-cluster.2rqwzwz.mongodb.net/${DATABASE_NAME}`;

//connection to your application
// const CONNECTION_STRING = `mongodb+srv://ducBird:ducBird@cmah-cluster.2rqwzwz.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`;
module.exports = {
  CONNECTION_STRING,
};
