import express from "express";
import passport from "passport";
import "dotenv/config";

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use((req, res) => {
  res.status(404).render("404", { title: "Page not Found" });
});

app.listen(3000);

export default app;