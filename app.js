import express from "express";
import sessionConfig from "./middleware/sessionConfig.js";
import { initializePassport } from "./middleware/passport.js";
import setUserLocals from "./middleware/setUserLocals.js";
import authRouter from "./routes/authRoute.js";

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const passportInstance = initializePassport();

app.use(sessionConfig());
app.use(passportInstance.initialize());
app.use(passportInstance.session());
app.use(setUserLocals);

app.use("/", authRouter);

app.use((req, res) => {
  res.status(404).render("404", { title: "Page not Found" });
});

app.listen(3000);

export default app;