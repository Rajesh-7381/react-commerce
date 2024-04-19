const express=require("express");
const cors=require("cors");
const mysql2=require("mysql2");


const app=express();
app.use(cors());
app.use(express.json());

const db=mysql2.createPool({
    host:"localhost",
    user:"root",
    password:"1234",
    database:"ReactCommerce",
    port:"3307"
});


app.post("/register", (req, res) => {
    // console.log(req.body); // Log the incoming request body to check data
    const values = [req.body.name, req.body.mobile, req.body.email, req.body.password];
    const query = "INSERT INTO AdminUser (name, mobile, email, password) VALUES (?, ?, ?, ?)";
    db.query(query, values, (err, data) => {
        if (err) {
            console.error("Error submitting form", err);
            return res.status(500).json({ message: "Internal server error" });
        } else {
            res.json({ message: "User created successfully!" });
        }
    });
});

app.post("/login", (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body; // Assume the request includes email and password
  const query = "SELECT * FROM AdminUser WHERE email = ? AND password = ?";

  db.query(query, [email, password], (err, data) => {
    if (err) {
      console.error("Login unsuccessful:", err);
      return res.status(500).json({ message: "Internal server error" });
    } else if (data.length > 0) {
      const user = data[0];
      console.log(user);
      // If user exists with provided email and password
      res.json({
        status: 1, 
        message: "Login successful",
        role: user.role // Send the role to the frontend
      });
    } else {
      // If no user found with provided credentials
      res.json({ status: 0, message: "Invalid email or password" });
    }
  });
});

// count user
app.get('/countuser', (req, res) => {
  const query = "SELECT COUNT(id) AS total FROM AdminUser"; // Alias 'count(id)' as 'total'
  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({message: "Internal server error"});
    } else {
      const count = data[0].total; // Access using the alias 'total'
      // const count2 = data[0].email; // Access using the alias 'total'
      // console.log("Total Users:", count);
      res.json({
        count: count
        
      });
    }
  });
});



app.get('/alldata',(req,res)=>{
    const sql="select * from AdminUser";
    db.query(sql,(err,data)=>{
      if(err){
        return res.json({message:"internal server error"});
      }
    //   console.log(data)
      return res.json(data);
      
    })
  })

app.listen(8081,()=>{
    console.log("server listening at port 8081");
})