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

const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
  const course = new Course({
    // name: "Angular Course",
    author: "Hosein Bahmany",
    tags: [],
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

async function updateCourse(id) {
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

async function removeCourse(id) {
  const result = await Course.deleteOne({ _id: id });
  // const result = await Course.deleteMany({ _id: id });
  console.log(result);
}

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

const courseId = "5fd7c7768157251ddcf2f20d";

createCourse();
// updateCourse(courseId);
// removeCourse(courseId);
