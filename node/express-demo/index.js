const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const home = require("./routers/home");
const genres = require("./routers/genres");
const logger = require("./middlewares/logger");

const app = express();

app.set("view engine", "pug");
app.set("views", "./views"); // path to the template

console.log("NODE_ENV: ", process.env.NODE_ENV);
console.log("app.env: ", app.get("env"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());
app.use(morgan("common"));
app.use(logger.log);

app.use("/", home);
app.use("/api/courses", genres);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
