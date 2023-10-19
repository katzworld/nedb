// init project
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
// Data is stored in the file `database` in the folder `db`.
// Note that if you leave your app public, this database file will be copied if
// someone forks your app. So don't use it to store sensitive information.
var Datastore = require("nedb"),
  db = new Datastore({ filename: "/src/db/database", autoload: true });

// Using `public` for static files: http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// Initial set of users to populate the database with
var defaultUsers = [];
var users = defaultUsers.slice();
setup();

// Use bodyParser to parse application/x-www-form-urlencoded form data
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// populate database with default users
function setup() {
  var dbUsers = [];

  db.remove({}, { multi: true }, function(err, numRemoved) {
    for (var i = 0; i < users.length; i++) {
      // loop through all users
      dbUsers.push({ name: users[i] });
    }
    db.insert(dbUsers, function(err, newDocs) {
      // add initial users to the database
    });
  });
}

// Send user data - used by client.js
app.get("/users", function(request, response) {
  db.find({ name: { $exists: true } }, function(err, docs) {
    // finds all users in the database
    response.send(docs); // sends users back to the page
  });
});

// create a new users entry
app.post("/new", urlencodedParser, function(request, response) {
  db.insert({ name: request.body.user }, function(err, numReplaced, upsert) {
    response.redirect("/");
  });
});

// removes existing users and creates new entries with just the default users
app.get("/reset", function(request, response) {
  users = defaultUsers.slice();
  setup();
  response.redirect("/");
});

// Serve the root url: http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile("/views/index.html");
});

// Listen on port 8080
var listener = app.listen(8080, function() {
  console.log("Listening on port " + listener.address().port);
});
