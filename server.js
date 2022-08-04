const cookieParser = require("cookie-parser");
const express = require("express");
const csurf = require("csurf")
const session = require("express-session");
const app = express();
const port = 3000;
const path = require("path");
const jwt = require('jsonwebtoken');

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser("cookie"));

// /////////////cookie ///////////////////
app.use(express.static(__dirname + '/public'));
// app.get("/", (req, res) => {
//   res.cookie("role","user")
//   // res.sendFile(path.join(__dirname, "/index.html"));

// });

app.get('/cookie',(req,res,next)=>{
  if (req.cookies.role !== "admin") {
    res.status(401).send("no admin cookie !!")
  }
  res.sendFile(path.join(__dirname, "/cookie.html"));
})
// /////////////cookie ///////////////////










///session///////////////////////////////
app.use(session({
  secret:"superSecretString",
  cookie:{},
  resave:false,
  saveUninitialized:false
}))


// app.use(csurf())

app.get("/session", (req, res) => {
  let name = "Guest"

  if (req.session.user) name = req.session.user

  res.send(`
  <h1>Welcome, ${name}</h1>
  <form action="/choose-name" method="POST">
    <input type="text" name="name" placeholder="Your name" autocomplete="off">
    <input type="hidden" name="_csrf" value="${req.csrfToken()}">
    <button>Submit</button>
  </form>
  <form action="/logout" method="POST">
    <input type="hidden" name="_csrf" value="${req.csrfToken()}">
    <button>Logout</button>
  </form>
  `)
})

app.post("/choose-name",(req,res)=>{
  req.session.user=req.body.name.trim()
  req.session.custom="custom value"
  res.send(`<p>thnk u <p> <a href="/">back home </a>`)
})


app.post("/logout",(req,res)=>{
  req.session.destroy(err=>{
    {
      res.redirect('/')
    }
  })
})

///session///////////////////////////////




////JWT ////////////////////////////////

app.use(express.static("public"))
app.use(express.json())


const secertJWT = "sup secret"
app.post("/jwt-login", (req, res) => {
  if (req.body.username === "zzz" && req.body.password === "123") {
    res.json({ status: "success", token: jwt.sign({ name: "John Doe", favColor: "green" }, secertJWT) })
  } else {
    res.json({ status: "failure" })
  }
})


app.post("/jwt-secret",(req,res)=>{
  jwt.verify(req.body.token,secertJWT,(err,decode)=>{
    if(err){
      res.json({status:"fali"})
    }else{
      res.json({status:"success",message:`hello ${decode.name} your color ${decode.favColor}`})
    }
  })
})






////JWT ////////////////////////////////







// base authentication //////////////////

app.use((req, res, next) => {

  const auth = { login: "zzz", password: "123" };

  const b64auth = (req.headers.authorization || "").split(" ")[1] || "";
  const [login, password] = Buffer.from(b64auth, "base64")
    .toString()
    .split(":");

  if (login && password && login === auth.login && password == auth.password) {
    res.cookie("role", "admin");
    console.log("access success");
    return next();
  }

  res.set("WWW-Authenticate", 'Basic realm="401"'); // change this
  res.status(401).send("Authentication required."); // custom message
});
app.get("/secret", (req, res) => {

  res.sendFile(path.join(__dirname, "/secret.html"));
});


// base authentication //////////////////

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


