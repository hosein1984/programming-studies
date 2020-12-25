const express = require("express");
const Joi = require("joi");

const router = express.Router();

const courses = [
  { id: 1, name: "Course 1" },
  { id: 2, name: "Course 2" },
  { id: 3, name: "Course 3" },
  { id: 4, name: "Course 4" },
];

const coursesSchema = Joi.object({
  name: Joi.string().min(3).required(),
});

function validateCourse(course) {
  return coursesSchema.validate(course);
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
