const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/mongo-exercises", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to the mongo database");
  })
  .catch((error) => {
    console.log("Failed to successfully connect to mongo database", error);
  });

const coursesSchema = new mongoose.Schema({
  tags: [String],
  date: Date,
  name: String,
  author: String,
  isPublished: Boolean,
  price: Number,
});

const course = mongoose.model("Course", coursesSchema);

async function queryCourses() {
  const courses = await course
    .find({ isPublished: true })
    .or([{ name: /.*by.*/i }, { price: { $gte: 15 } }])
    .sort({ price: -1 })
    .select({ name: 1, author: 1, price: 1 });
  console.log(courses);
}

queryCourses();
