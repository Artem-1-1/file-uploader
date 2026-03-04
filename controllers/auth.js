function LogIn(req, res) {
  res.render("login", { errors: [], username: "", password: "", title: "Log In" })
}

function getSignUp(req, res) {
  res.render("register", { errors: [], username: "", password: "", confirmPassword: "", title: "Register" });
}

export default { LogIn, getSignUp };