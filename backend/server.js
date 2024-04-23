const express=require("express");
const cors=require("cors");
const mysql2=require("mysql2");

// for hashing password
const bcrypt=require("bcrypt");

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


// register user data
app.post("/register", async (req, res) => {
  // console.log(req.body); // Log the incoming request body to check data
  const { name, mobile, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);

  db.query(
      "INSERT INTO AdminUser (name, mobile, email, password) VALUES (?, ?, ?, ?)",
      [name, mobile, email, hashedpassword],
      (err, data) => {
          if (err) {
              console.error("Error submitting form", err);
              return res.status(500).json({ message: "Internal server error" });
          } else {
              res.json({ message: "User created successfully!" });
          }
      }
  );
});


// login user data
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


// show all user data
app.get('/alldata', (req, res) => {
  const sql = "SELECT * FROM AdminUser";
  db.query(sql, (err, data) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: "Internal server error" });
      }
      return res.json(data);
  });
});


// show single data
app.get("/singledata/:id",(req,res)=>{
  const id=req.params.id;
  
  const query="select * from AdminUser where id=?";
  db.query(query,id,(err,result)=>{
    if(err){
      console.error("error fetching data",err);
      return res.status(500).json({message:"internal server error"});
    }
    if(result.length===0){
      return res.status(404).json({message:"data not found!"});
    }
    return res.status(200).json({message:"data fetched successfully!",data:result[0]});

    }
  )
})

// editdata
app.get("/editdata/:id", (req, res) => {
  const id = req.params.id;
  // console.log(id);
  const query = "select * from AdminUser where id=?";
  db.query(query, [id], (err, result) => {
      if (err) {
          console.error("error fetching data", err);
          return res.status(500).json({ message: "internal server error" });
      }
      if (result.length === 0) {
          return res.status(404).json({ message: "data not found!" });
      }
      return res.status(200).json({ message: "data fetched successfully!", data: result[0] });
  });
});

// Add update user endpoint
app.put("/update/:id", (req, res) => {
  const id = req.params.id;
  console.log(id)
  const { name, mobile, email, password, role } = req.body;
  const query = "UPDATE AdminUser SET name=?, mobile=?, email=?, password=?, role=? WHERE id=?";

  db.query(query, [name, mobile, email, password, role, id], (err, result) => {
    if (err) {
      console.error("Error updating data", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    return res.status(200).json({ message: "Data updated successfully!" });
  });
});

// delete functionality
app.delete("/deletesingledata/:id",(req,res)=>{
  const id=req.params.id;
  const query="DELETE FROM AdminUser WHERE id=?";
  db.query(query,id,(err,result)=>{
    if(err){
      console.error(err);
      return res.status(500).json({message:"internal server error"})
    }
    return res.status(200).json({message:"deleted sucessfully!"})
  })
})


// subadmins see all subadmins and user data
app.get("/subadmindata",(req,res)=>{
  const query ="select * from  AdminUser where role in('subadmin' ,'user')";
  db.query(query,(err,result)=>{
    if(err){
      console.error(err);
      return res.status(500).json({message:"internal server error"});
    }
    // return res.status(200).json({message:"data get successfully!"})
    return res.json(result);
  })
})

app.listen(8081,()=>{
    console.log("server listening at port 8081");
})