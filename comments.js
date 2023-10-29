// Create web server
// 1. Load express
const express = require("express");
const app = express();
// 2. Load body-parser
const bodyParser = require("body-parser");
// 3. Load mongoose
const mongoose = require("mongoose");
// 4. Load express-session
const session = require("express-session");
// 5. Load connect-mongo
const MongoStore = require("connect-mongo")(session);
// 6. Load express-handlebars
const handlebars = require("express-handlebars");
// 7. Load method-override
const methodOverride = require("method-override");
// 8. Load express-validator
const validator = require("express-validator");
// 9. Load passport
const passport = require("passport");
// 10. Load connect-flash
const flash = require("connect-flash");

// 11. Load environment variables
require("dotenv").config({ path: "./config/keys.env" });

// 12. Load helpers
const { select, formatDate, paginate } = require("./helpers/handlebars-helpers");

// 13. Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 14. Use method-override middleware
app.use(methodOverride("_method"));

// 15. Use express-validator middleware
app.use(validator());

// 16. Configure express-session middleware
app.use(
  session({
    secret: "anysecret",
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// 17. Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());

// 18. Use flash middleware
app.use(flash());

// 19. Set global variables using middleware
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success_message = req.flash("success_message");
  res.locals.error_message = req.flash("error_message");
  res.locals.form_errors = req.flash("form_errors");
  res.locals.error = req.flash("error");
  next();
});

// 20. Set view engine using middleware
app.engine(
  "handlebars",
  handlebars({
    defaultLayout: "default",
    helpers: { select: select, formatDate: formatDate, paginate: paginate },
  })
);
app.set("view engine", "handlebars");

// 21. Load routes