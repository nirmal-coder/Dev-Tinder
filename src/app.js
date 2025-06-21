const express = require("express");
const app = express();

const port = 1207;

app.listen(port, () => {
  console.log(`Server is running on port ${port}.......`);
});

app.use("/", (req, res) => {
  res.send("Welcome DevTinder Backend");
});
