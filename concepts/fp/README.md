# Functional Programming

Gonna start this study with the **Professor Frisby's Mostly Adequate Guide to Functional Programming** Book.

- Book: https://mostly-adequate.gitbooks.io/mostly-adequate-guide/content/
- Code: https://github.com/MostlyAdequate/mostly-adequate-guide/tree/master/exercises

## Function as First Class Citizens

We can treat functions like any other data type and there is nothing particularly special about them - they may be stored in arrays, passed around as function parameters, assigned to variables, and what have you.

Here are some examples:

- It's bad practice to surround a function with another function merely to delay evaluation

  ```javascript
  const hi = (name) => `Hi ${name}`;
  const greeting = (name) => hi(name); // bad
  const greeting = hi; // good
  ```

  Since `hi` is already a function that expects one argument, we don't need place another function around it that simply calls `hi` with the same argument.
  Here's another example:

  ```javascript
  const getServerStuff = (callback) => ajaxCall((json) => callback(json)); // bad

  // this line
  ajaxCall((json) => callback(json));

  // is the same as this line
  ajaxCall(callback);

  // so refactor getServerStuff
  const getServerStuff = (callback) => ajaxCall(callback);

  // ...which is equivalent to this
  const getServerStuff = ajaxCall; // good
  ```

  And one more example:

  ```javascript
  // bad
  const BlogController = {
    index(posts) {
      return Views.index(posts);
    },
    show(post) {
      return Views.show(post);
    },
    create(attrs) {
      return Db.create(attrs);
    },
    update(post, attrs) {
      return Db.update(post, attrs);
    },
    destroy(post) {
      return Db.destroy(post);
    },
  };

  // better
  const BlogController = {
    index: Views.index,
    show: Views.show,
    create: Db.create,
    update: Db.update,
    destroy: Db.destroy,
  };
  ```

- In the above code the added layers of indirection provide no added value and only increase the amount of redundant code to maintain and search through
- Besides the removal of unnecessary functions, we must name and reference arguments. Names are a bit of an issue. Having multiple names for the same concept is a common source of confusion in projects. There is also the issue of generic code. For instance, these two functions do exactly the same thing, but one feels infinitely more general and reusable:

  ```javascript
  // specific to our current blog
  const validArticles = articles =>
  articles.filter(article => article !== null && article !== undefined),

  // vastly more relevant for future projects
  const compact = xs => xs.filter(x => x !== null && x !== undefined);
  ```

## Pure Functions

A pure function is a function that, given the same input, will always return the same output and does not have any observable side effect.

Take `slice` and `splice`. They are two functions that do the exact same thing - in a vastly different way, mind you, but the same thing nonetheless. We say `slice` is pure because it returns the same output per input every time, guaranteed. `splice`, however, will chew up its array and spit it back out forever changed which is an observable effect.

```javascript
const xs = [1, 2, 3, 4, 5];

// pure
xs.slice(0, 3); // [1,2,3]
xs.slice(0, 3); // [1,2,3]
xs.slice(0, 3); // [1,2,3]

// impure
xs.splice(0, 3); // [1,2,3]
xs.splice(0, 3); // [4,5]
xs.splice(0, 3); // []
```

In functional programming we always favor the pure function because they do not mutate data and are easier to reason about.

Another types of impure functions, are functions that depend on the state of the app (implicitly):

```javascript
// impure
let minimum = 21;
const checkAge = (age) => age >= minimum;

// pure
const checkAge = (age) => {
  const minimum = 21;
  return age >= minimum;
};
```

In the impure portion, `checkAge` depends on the mutable variable `minimum` to determine the result. In other words, it depends on system state which is disappointing because it increases the cognitive load by introducing an external environment.

A side effect is a change of system state or observable interaction with the outside world that occurs during the calculation of a result.

Side effects may include, but are not limited to

- changing the file system
- inserting a record into a database
- making an http call
- mutations
- printing to the screen / logging
- obtaining user input
- querying the DOM
- accessing system state
- etc.

Any interaction with the world outside of a function is a side effect, which is a fact that may prompt you to suspect the practicality of programming without them. The philosophy of functional programming postulates that side effects are a primary cause of incorrect behavior.

It is not that we're forbidden to use them, rather we want to contain them and run them in a controlled way.

Side effects disqualify a function from being pure. And it makes sense: pure functions, by definition, must always return the same output given the same input, which is not possible to guarantee when dealing with matters outside our local function.

From mathematics we define a function as:

> A function is a special relationship between values: Each of its input values gives back exactly one output value.

It essentially means that several inputs can map the same output but never the same input can be mapped to several outputs.

Pure functions are mathematical functions and they're what functional programming is all about.

Let's look at some reasons why we're willing to go to great lengths to preserve purity.

### Cacheable

Pure functions can always be cached by input. This is typically done using a technique called memoization:

```javascript
const memoize = (f) => {
  const cache = {};

  return (...args) => {
    const argStr = JSON.stringify(args);
    cache[argStr] = cache[argStr] || f(...args);
    return cache[argStr];
  };
};

const squareNumber = memoize((x) => x * x);

squareNumber(4); // 16
squareNumber(4); // 16, returns cache for input 4

squareNumber(5); // 25
squareNumber(5); // 25, returns cache for input 5
```

Something to note is that you can transform some impure functions into pure ones by delaying evaluation:

```javascript
const pureHttpCall = memoize((url, params) => () => $.getJSON(url, params));
```

The interesting thing here is that we don't actually make the http call - we instead return a function that will do so when called. This function is pure because it will always return the same output given the same input: the function that will make the particular http call given the `url` and `params`.

Our `memoize` function works just fine, though it doesn't cache the results of the http call, rather it caches the generated function.

### Portable

