const express = require("express");
const app = express();
const stripe = require("stripe");
("sk_test_YOURAPIKEY GOES HERE");
// http methods :  GET, POST, PUT, DELETE, PATCH
// define an api endpoint (route, )
app.get("/api", (req, res) => {
  const apiKey = req.query.apiKey;

  // TODO validate apiKey
  // TODO bill user for api usage8
  res.send({ data: "🔥🔥🔥🔥🔥 " });
});

app.listen(8080, () => {
  console.log("🚀 Server ready at http://localhost:8080");
});
