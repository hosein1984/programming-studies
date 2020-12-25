# Learning Nodejs

# Node Architecture

Traditionally, Javascript could only be executed in Browser. Each browser offered a Javascript Engine. For example:

- Microsoft Edge offers **Chakra**
- Firefox Edge offers **SpiderMonkey**
- Chrome offers **V8**

Furthermore each browser offered a runtime environment for the javascript code. For example:

```javascript
document.getElementById("");
```

This gives the javascript the ability to interact with the environment in which is it running.

Then Nodejs came along. Ryan Dahl in 2009 took the Chrome's **v8** engine and embedded in a **C++** programmed and called it **Node**. So similar to a browser, Node is a runtime environment for javascript. Meaning node has:

- A javascript engine (v8) to execute the javascript code
- And a runtime environment that offers objects and capabilities such as working with file systems and etc.

Nodejs architecture is inherently asynchronous (non-blocking). Meaning a single request thread can respond to a large number of clients requests. This is the opposite of the synchronous architecture of the ASP.NET.
This makes Nodejs a suitable chose for building _I/O intensive_ application.

On the other hand, Nodejs is not a good chose for building _CPU intensive_ applications.

# Global Objects

Global objects are object that are globally accessibale every where in the app. Examples of global objects and functions are:

- `console` e.g. `console.log("...")`
- `setTimeout` and `clearTimeout`
- `setInterval` and `clearInterval`

Similar to how global functions and objects can be addressed via the `window` in normal javascript code, in Node they can be access via `global` object if need (most of the time we would just use these objects without the `global.` or `window.` prefixes) code.

# Modules

Every file in the Nodejs is considered to be a module. Variables and functions defined in the module are scoped this the same module unless that are explicitly `export`ed.

Each `module` information can be accessed via the `module` object.

```javascript
console.log(module);
```

## Module Wrapper Function

Node never executes the code inside a `module` directly. Instead it wraps the entire content of the file (`module`) in what is called a module wrapper function. This module wrapper function is what gives us the access to objects and variables such as, `require`, `module`, `__dirname` and `filename`.

For example if we have a module like this:

```javascript
function greeting() {
  console.log("Hello World1");
}

module.exports = { greetings };
```

would actually be wrapped by a module wrapper function (which is an Immediately Invoked Function Expression):

```javascript
(function (exports, require, module, __filename, __dirname) {
  function greeting() {
    console.log("Hello World1");
  }

  module.exports = { greetings };
});
```

## Examples of Built-in Modules

- **path** module:

  ```javascript
  const path = require("path");

  const pathObject = path.parse(__filename);

  console.log(pathObject);

  // prints
  {
  root: 'D:\\',
  dir: 'D:\\personal\\programming-studies\\node\\first-app',
  base: 'app.js',
  ext: '.js',
  name: 'app'
  }

  ```

- **os** module:

  ```javascript
  const os = require("os");

  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();

  console.log(`Total Memory: ${totalMemory}, Free memory: ${freeMemory}`);

  // prints
  Total Memory: 17005608960
  Free memory: 8856395776
  ```

- **fs** module:

  ```javascript
  const fs = require("fs");

  fs.readdir("./", (error, files) => {
    if (error) {
      console.log("Got an error", error);
      return;
    }

    console.log(files);
  });

  // prints
  ["app.js"];
  ```

- **events** module:

  ```javascript
  const { EventEmitter } = require("events");

  const emitter = new EventEmitter();

  emitter.on("messageLogged", (args) => {
    console.log("Received a messagedLogged event", args);
  });

  emitter.emit("messageLogged", { id: 1, url: "https://" });

  // prints:
  Received a messagedLogged event { id: 1, url: 'https://' }
  ```

  or

  ```javascript
  const { EventEmitter } = require("events");

  class Logger extends EventEmitter {
    log(message) {
      console.log(message);

      this.emit("messageLogged", message);
    }
  }

  const logger = new Logger();
  logger.on("messageLogged", (args) => {
    console.log("Received a messageLogged event with args:", args);
  });

  logger.log("new log entry");

  // prints
  new log entry
  Received a messageLogged event with args: new log entry
  ```

- **http** module:

  ```javascript
  const http = require("http");

  const server = http.createServer((req, res) => {
    if (req.url === "/") {
      res.write("Hello world!");
      res.end();
    }

    if (req.url === "/api/courses") {
      res.write(JSON.stringify([1, 2, 3]));
      res.end();
    }
  });
  server.listen(3000);

  console.log("listening on port 3000");
  ```

# Node Package Manager (NPM)

## Semantic Versioning:

Node packages are version using Semantic Versioning syntax. For example:

```json
"dependencies": {
    "lodash": "^4.17.20",
    "mongoose": "^5.11.4"
  }
```

Semantic Versioning usually consists of three parts: `Major.Minor.Patch`. Each part of the version is used for a specific purpose:

- **Path**: Is usually used for patches and bug fixes.
- **Minor**: Is used for new features that do not break the existing API
- **Major**: Is used for new features that possibly could break existing API

What is the role of the caret `^` character in `"lodash": "^4.17.20"`? It means that we want any version of lodash as long as it is compatible with version `4` which is equivalent to `4.x` syntax.

There is also a tilde `~` character like `"lodash": "~4.17.20"` that means all versions that that are compatible with lodash `4.17` which is equivalent to syntax `4.17.x`

So the actual version of dependency cannot be accurately inferred from `"lodash": "^4.17.20"`. For that and more information you can use these commands:

```sh
npm list

npm list --depth=0
```

## NPM Commands:

Here are some of the npm command examples:

- `npm view lodash`: Shows the information file of the lodash package on npm registry
- `npm view lodash dependencies`: Shows the dependencies of the lodash
- `npm view lodash versions`: Show all the version of lodash that are available on npm registry
- `npm install lodash@2.0.0`: Installed the exact version of the specified dependency
- `npm outdated`: Compares all the installed dependencies with npm registry and shows the packages that are updated
- `npm update`: Update all installed packaged. Note that only update to the latest compatible version (`^` that we learned about earlier) meaning only minor and patch versions
- `npm install -g npm-check-updates`: npm-check-updates command line tool can be used to update the packages to their latest version regardless of semantic versioning compatibility

# RESTful APIs with Express

Most modern web applications follow the Client-Server architecture. In this architecture the web app itself is the Client which under the hook it needs to talk to the Server (backend) to get or save the data. This communication happens using the HTTP protocol. So the Server exposes a number of services that are accessible via the HTTP protocol. Therefore the client can directly communicate with the server and its services by sending HTTP requests.

**Re**presentational **S**tate **T**ransfer (**REST**) is a convention on how to build this services.

The convention is to exposes _Resources_ at various endpoints on the server and enable manipulation of those resources via different kinds of HTTP requests.

For example suppose that you want to create a RESTful api for your company and you want to exposes a _customers_ endpoint. Therefore you might have something like this:

- `GET /api/customers`
- `GET /api/customers/{id}`
- `PUT /api/customers/{id}` and body contains the updated customer
- `POST /api/customers` and body contains the new customers
- `DELETE /api/customers/{id}`

## Example

Here's a simple express example for creating a REST api:

```javascript
const express = require("express");
const Joi = require("joi");

const app = express();
app.use(express.json());

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
  { id: 4, name: "course4" },
];

const courseSchema = Joi.object({
  name: Joi.string().min(3).required(),
});

function validateCourse(course) {
  return courseSchema.validate(course);
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/courses", (req, res) => {
  res.send(JSON.stringify([1, 2, 3]));
});

app.get("/api/courses/:id", (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  const course = courses.find((c) => c.id === +id);

  if (!course) {
    return res
      .status(404)
      .send("The course with the given ID does not exists on the server");
  }

  res.send(course);
});

app.post("/api/courses", (req, res) => {
  const { error, value } = validateCourse(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { name } = value;
  const course = {
    id: courses.length + 1,
    name,
  };
  courses.push(course);

  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  const { id } = req.params;

  const course = courses.find((c) => c.id === +id);
  if (!course) {
    return res
      .status(404)
      .send("The course with the given ID does not exists on the server");
  }

  const { error, value } = validateCourse(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { name } = value;
  course.name = name;

  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  console.log(req.params);
  const { id } = req.params;

  const course = courses.find((c) => c.id === +id);
  console.log(course);

  if (!course) {
    return res
      .status(404)
      .send("The course with the given ID does not exists on the server");
  }

  const courseIndex = courses.indexOf(course);
  courses.splice(courseIndex, 1);

  res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
```

## Middlewares

A middleware function is a function that takes a request object and either returns the response to client or passes it to another middlewares.

For example all of the above route handler functions (`get`, `put`, `post`, `delete`) are middlewares because it takes a request object and returns a returns a response to the client. So it terminates the request/response cycle.

Another example of middlewares that we saw earlier is the `app.use(express.json());`. Here the `express.json()` is a middleware which receive the request and if there is a json object in the body of the request, it will parse the body to a json object.

So here's how the process would look like:

![Request Processing Pipeline](./docs/images/request-processing-pipeline.png)

When a request is received, it will go through something that is called a **Request Processing Pipeline** which consists of several middlewares. Each middleware either terminates the request/response cycle by returning a response object or pass control to another middleware function in the pipeline.

Here's an example of two very simple custom middleware:

```javascript
app.use(express.json());
app.use((req, res, next) => {
  console.log("Logging...");
  next();
});
app.use((req, res, next) => {
  console.log("Authenticating...");
  next();
});
```

### Examples of Built-in Middlewares

- Urlencoded middleware: This middleware parses the data encoded in the url (e.g. `key=value&key=value`) to json object and put them in the body of the request.

  ```javascript
  app.use(express.urlencoded({ extended: true }));
  ```

- Static middleware: This middleware is used to serve static resources over the server:

  ```javascript
  app.use(express.static("public"));
  ```

  With this all contents of the `public` folder in the project would be served from the root of the website (e.g. `public/sample.txt` is served at `localhost:3000/sample.txt`)

## Detecting Current Environment

```javascript
console.log("NODE_ENV: ", process.env.NODE_ENV); // default value is undefined
// or
console.log("app.env: ", app.get("env")); // default value is development
```

By using this we can install different middlewares in production and development.

## Setting up Environment Variables

For example you can use the `config` package like this:

```javascript
const config = require("config");

console.log("Application name: ", config.get("name"));
console.log("Mail host: ", config.get("mail.host"));
```

and here's the config files themselves:

```json
// default.json
{
  "name": "My Express App"
}


// development.json
{
  "name": "My Express App - Development",
  "mail": {
    "host": "dev-mail-server"
  }
}

// production.json
{
  "name": "My Express App - Production",
  "mail": {
    "host": "prod-mail-server"
  }
}

```

## Templating Engine

In all of our server end point up until now we returned `json` objects. If you ever need to return markup to the client then you need **Templating Engines** at your disposal.

These are some of the popular templating engines:

- Pug
- Mustache
- EJS

Here's how you would use pug:

```javascript
app.set("view engine", "pug");
app.set("views", "./views"); // path to the template folder
```

Here is a template example

```pug
// ./views/index.pug
html
    head
        title= title
    body
        h1= message
```

and then serve the template on server like this:

```javascript
app.get("/", (req, res) => {
  res.render("index", { title: "My Express App", message: "Hello World!" });
});
```

# Application Structure

For each endpoint or resource (for example here `courses`) we ideally want a separate module (file).

But note that in the codes above we registered our routes directly to the `app` instance from the `express`. But when we separate the routes to different files we cannot do that.
Instead for each module we create a `router` and register our routes tp that `router` instance and then export it.

Like this:

```javascript
const express = require("express");
const Joi = require("joi");

const router = express.Router();

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
  { id: 4, name: "course4" },
];

const courseSchema = Joi.object({
  name: Joi.string().min(3).required(),
});

function validateCourse(course) {
  return courseSchema.validate(course);
}

router.get("/", (req, res) => {
  res.send(JSON.stringify(courses));
});

router.get("/:id", (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  const course = courses.find((c) => c.id === +id);

  if (!course) {
    return res
      .status(404)
      .send("The course with the given ID does not exists on the server");
  }

  res.send(course);
});

router.post("/", (req, res) => {
  const { error, value } = validateCourse(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { name } = value;
  const course = {
    id: courses.length + 1,
    name,
  };
  courses.push(course);

  res.send(course);
});

router.put("/:id", (req, res) => {
  const { id } = req.params;

  const course = courses.find((c) => c.id === +id);
  if (!course) {
    return res
      .status(404)
      .send("The course with the given ID does not exists on the server");
  }

  const { error, value } = validateCourse(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { name } = value;
  course.name = name;

  res.send(course);
});

router.delete("/:id", (req, res) => {
  console.log(req.params);
  const { id } = req.params;

  const course = courses.find((c) => c.id === +id);
  console.log(course);

  if (!course) {
    return res
      .status(404)
      .send("The course with the given ID does not exists on the server");
  }

  const courseIndex = courses.indexOf(course);
  courses.splice(courseIndex, 1);

  res.send(course);
});

module.exports = router;
```

Notice that we removed the `/api/courses` from all of the routes. That's because when we register the router to the express we can define what routes should be handled by the router.

We can do the same for our middlewares as well. For example here's our custom logger middleware:

```javascript
function log(req, res, next) {
  console.log(`Custom logger middleware. Url: ${req.url}`);
  next();
}

module.exports = { log };
```

And then we use the middlewares and routers in the with the express `app` instance like this:

```javascript
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const home = require("./routers/home");
const courses = require("./routers/courses");

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
app.use("/api/courses", courses);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
```

# MongoDB and Mongoose

First things that needs to be done is to connect to the MongoDB server and a particular database on that server.

```javascript
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((error) => {
    console.log(
      "Something went wrong when trying to connect to MongoDb",
      error
    );
  });
```

In the MongoDB jargon we have database and collections which correspond to the database and datatable in SQL.

Mongoose has the concept of the **Schemas** which define the shape of the data present in a MongoDB collection.

Here's an example:

```javascript
const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
});
```

From the schema we can create a Model. A model is essentially a representation of a Collection in the mongoose that we can create instances of later on (more accurately instances). This model correlates a Schema to a Collection in the database.

```javascript
const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
});

const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "Node.js Course",
    author: "Hosein Bahmany",
    tags: ["node", "backend"],
    isPublished: true,
  });

  const result = await course.save();
  console.log(result);
}

createCourse();
```

Notice that the MongoDB automatically create and assigns a id (`_id`) property to our record.

Now let's do some queries for our Collection:

```javascript
async function getCourses() {
  const courses = await Course.find({
    author: "Hosein Bahmany",
    isPublished: true,
  })
    .limit(10)
    .sort({ name: 1 }) // 1 meaning ascending and -1 meaning descending order
    .select({ name: 1, tags: 1 });
  console.log(courses);
}

getCourses();
```

Example of comparison operators:

```javascript
async function getCourses() {
  // eq    (equal)
  // ne    (not equal)
  // gt    (greater than)
  // gte   (greater than or equal to)
  // lt    (less than)
  // lte   (less than or equal to)
  // in
  // nin   (not in)

  const courses = await Course.find({
    author: "Hosein Bahmany",
    isPublished: true,
    price: { $gte: 10, $lte: 20 },
    price: { $in: [10, 15, 20] },
  })
    .limit(10)
    .sort({ name: 1 }) // 1 meaning ascending and -1 meaning descending order
    .select({ name: 1, tags: 1 });
  console.log(courses);
}
```

And there are some examples for logical operators

```javascript
async function getCourses() {
  // or
  // and

  const courses = await Course.find()
    .or([{ author: "Hosein Bahmany" }, { isPublished: true }])
    // .and([{ author: "Hosein Bahmany" }, { isPublished: true }])
    .limit(10)
    .sort({ name: 1 }) // 1 meaning ascending and -1 meaning descending order
    .select({ name: 1, tags: 1 });
  console.log(courses);
}

getCourses();
```

Regular expression example:

```javascript
async function getCourses() {
  const courses = await Course.find()
    // starts with hosein or ends with Bahmany
    .or([{ author: /^Hosein/ }, { author: /Bahmany$/i }])
    .limit(10)
    .sort({ name: 1 }) // 1 meaning ascending and -1 meaning descending order
    .select({ name: 1, tags: 1 });
  console.log(courses);
}

getCourses();
```

By using a combination of skip and limit we can support pagination too:

```javascript
async function getCourses() {
  const pageNumber = 2;
  const pageSize = 10;

  const courses = await Course.find()
    // starts with hosein or ends with Bahmany
    .or([{ author: /^Hosein/ }, { author: /Bahmany$/i }])
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ name: 1 }) // 1 meaning ascending and -1 meaning descending order
    .select({ name: 1, tags: 1 });
  console.log(courses);
}

getCourses();
```

## Importing json file to MongoDb

from the command line you can import a json file into mongo like this:

```
mongoimport --db [db name] --collection [collection name] --file [file name] --jsonArray
```

## Updating documents in the MongoDB

There are two general approach:

- Find the document, update it and then save it
- Directly find and update the document in the database

Here's and example:

```javascript
async function updateCourse() {
  const id = "5fd7c7768157251ddcf2f20d";

  // Approach 1: Query first
  const course = await Course.findById(id);
  if (course) {
    course.set({
      isPublished: true,
      author: "Another Author",
    });
    const result = await course.save();
    console.log(result);
  }

  // Approach 2: Update first
  const result = await Course.update(
    { _id: id },
    {
      $set: {
        author: "Hosein",
        isPublished: false,
      },
    }
  );
  console.log(result);
}
```

## Deleting Documents

```javascript
async function removeCourse(id) {
  const result = await Course.deleteOne({ _id: id });
  // const result = await Course.deleteMany({ _id: id });
  console.log(result);
}
```

## Validation

Previously we wrote a function like this for creating courses:

```javascript
async function createCourse() {
  const course = new Course({
    name: "Node.js Course",
    author: "Hosein Bahmany",
    tags: ["node", "backend"],
    isPublished: true,
  });

  const result = await course.save();
  console.log(result);
}
```

Note that even if we remove these properties from the course, MongoDB still wouldn't care:

```javascript
async function createCourse() {
  const course = new Course({
    // name: "Node.js Course",
    // author: "Hosein Bahmany",
    // tags: ["node", "backend"],
    // isPublished: true,
  });

  const result = await course.save();
  console.log(result);
}
```

This behavior is usually not desired. We need validation to make sure our data stays consistent.

For that we can update the schema like this:

```javascript
const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
});
```

Now if we try to save a course that doesn't have a name we would get this error:

```
UnhandledPromiseRejectionWarning: ValidationError: Course validation failed: name: Path `name` is required.
```

Mongoose offers a more convenient approach for validating the data instead of calling the `save` method.

```javascript
async function createCourse() {
  const course = new Course({
    // name: "Angular Course",
    author: "Hosein Bahmany",
    tags: ["angular", "frontend"],
    isPublished: true,
  });

  try {
    await course.validate();
    const result = await course.save();
    console.log(result);
  } catch (error) {
    console.log("Could not save the course.", error);
  }
}
```

Notice that this validations are only meaningful from the Mongoose point of view and MongoDB doesn't care about the these validations.

### Other Validation

So far we only seen the `required: true` validator.

But we can have more complex validators. The required value can either be a condition or a function that resolves to a condition.

- For example a course should have a `price` if it is published:
  ```javascript
  const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
      type: Number,
      required: function () {
        return this.isPublished;
      },
    },
  });
  ```

* `minLength`, `maxLength`, `match`, `enum` validators for strings:
  ```javascript
  const courseSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      match: /pattern/,
    },
    category: {
      type: String,
      required: true,
      enum: ["web", "mobile", "network"],
    },
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
      type: Number,
      require: function () {
        return this.isPublished;
      },
    },
  });
  ```
* `min` and `max` validators for date and length

### Custom Validators:

For example suppose we have each course to have at least one tag. There is not build in validators available for that.

```javascript
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    match: /pattern/,
  },
  category: {
    type: String,
    required: true,
    enum: ["web", "mobile", "network"],
  },
  author: String,
  tags: {
    type: [String],
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: "A course should have at least one tag",
    },
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    require: function () {
      return this.isPublished;
    },
  },
});
```

The custom validator can be async as well:

```javascript
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    match: /pattern/,
  },
  category: {
    type: String,
    required: true,
    enum: ["web", "mobile", "network"],
  },
  author: String,
  tags: {
    type: [String],
    validate: {
      validator: function (v) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(v && v.length > 0);
          }, 2000);
        });
      },
      message: "A course should have at least one tag",
    },
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    require: function () {
      return this.isPublished;
    },
  },
});
```
