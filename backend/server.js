const express=require("express");
const cors=require("cors");
const mysql2=require("mysql2");
// for hashing password
const bcrypt=require("bcrypt");
// for file uploading
const multer=require("multer");
// for file date
const moment=require("moment");
const path=require("path");

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

// for category image inserting
// Multer configuration for file upload
const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    if(file.fieldname==='image'){
    cb(null,"uploads/profile/");
    }else if(file.fieldname === 'category_image'){
      cb(null,"uploads/categories/");
    }
  },
  filename:(req,file,cb)=>{
    const ext=path.extname(file.originalname);
    cb(null,Date.now()+ext);
  },
})
const upload=multer({storage:storage});
// register user data
app.post("/register",upload.single("image"), async (req, res) => {
  // console.log(req.body); // Log the incoming request body to check data
  const { name, mobile, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);

  db.query(
      "INSERT INTO AdminUser (name, mobile, email, password,image) VALUES (?, ?, ?, ?,?)",
      [name, mobile, email, hashedpassword,req.file.filename],
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
  const { email, password } = req.body;

  const query = "SELECT * FROM AdminUser WHERE email = ?";
  db.query(query, [email], async (err, data) => {
    if (err) {
      console.error("Login unsuccessful:", err);
      return res.status(500).json({ message: "Internal server error" });
    } else if (data.length > 0) {
      const user = data[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        res.json({
          status: 1, 
          message: "Login successful",
          role: user.role,
          id: user.id
        });
      } else {
        res.json({ status: 0, message: "Invalid email or password" });
      }
    } else {
      res.json({ status: 0, message: "Invalid email or password" });
    }
  });
});


// count user
app.get('/countuser', (req, res) => {
  const query = "SELECT COUNT(id) AS total FROM AdminUser where role='user'"; // Alias 'count(id)' as 'total'
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
// count admin
app.get('/countadmin', (req, res) => {
  const query = "SELECT COUNT(id) AS total FROM AdminUser where role='admin'"; // Alias 'count(id)' as 'total'
  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({message: "Internal server error"});
    } else {
      const Admincount = data[0].total; // Access using the alias 'total'
      // const count2 = data[0].email; // Access using the alias 'total'
      // console.log("Total Users:", count);
      res.json({
        Admincount: Admincount
        
      });
    }
  });
});
// subadmin count
app.get('/countsubadmin', (req, res) => {
  const query = "SELECT COUNT(id) AS total FROM AdminUser where role='subadmin'"; // Alias 'count(id)' as 'total'
  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({message: "Internal server error"});
    } else {
      const subaAdmincount = data[0].total; // Access using the alias 'total'
      // const count2 = data[0].email; // Access using the alias 'total'
      // console.log("Total Users:", count);
      res.json({
        subaAdmincount: subaAdmincount
        
      });
    }
  });
});


// show all user data
app.get('/alldata', (req, res) => {
  const sql = "SELECT * FROM AdminUser where deleted_at is null";
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
  // console.log(id)
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
  const query="UPDATE AdminUser SET deleted_at = CURRENT_TIMESTAMP WHERE id=?";
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
});

// cms page data
app.get("/cmspagedata",(req,res)=>{
  const query="select * from cmspages where deleted_at is null";
  db.query(query,(err,data)=>{
    if(err){
      console.error(err);

    }
    return res.json(data)
  })
})

// FOR CATEGORIES
app.get("/categories", (req, res) => {
  const query = "SELECT * FROM categories WHERE deleted_at IS NULL";
  db.query(query, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
    return res.json(data);
  });
});


// add category
app.post("/addcategory",upload.single("category_image"), (req, res) => {
  const { category_name, category_discount, description, url, meta_title, meta_description, meta_keyword } = req.body;
  const category_image=req.file.filename;
  const query = "INSERT INTO categories (category_name,category_image, category_discount, description, url, meta_title, meta_description, meta_keyword) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(query, [category_name,category_image, category_discount, description, url, meta_title, meta_description, meta_keyword], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.status(200).json({ message: "Data inserted successfully!" });
  });
});

// category single data
app.get("/categoryeditdata/:id",(req,res)=>{
  id=req.params.id;
  const query="select * from categories where id=?";
  db.query(query,id,(err,result)=>{
    if(err){
      console.error(err);
      return res.status(500).json({message:"internal server error"});
    }
    if(result.length===0){
      return res.status(404).json({ message: "data not found!" });
    }
    const data={...result[0],category_image:`http://localhost:8081/uploads/categories/${result[0].category_image}`}
    // console.log(data)
    return res.status(200).json({message:"data fetched!",data});
  })
})


// update categories
app.put("/updatecategory/:id",upload.single("category_image"), (req, res) => {
  const id = req.params.id;
  const category_image=req.file.filename;
  const { category_name, category_discount, description, url, meta_title, meta_description, meta_keyword } = req.body;
  const query = "UPDATE categories SET category_name=?, category_image=?, category_discount=?, description=?, url=?, meta_title=?, meta_description=?, meta_keyword=? WHERE id=?";
  db.query(query, [category_name, category_image, category_discount, description, url, meta_title, meta_description, meta_keyword, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
    return res.status(200).json({ message: "Update successful!" });
  });
});


// delete category
app.delete("/categorydelete/:id", (req, res) => {
  const id = req.params.id;
  const query = "UPDATE categories SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?";
  db.query(query, id, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
    return res.status(200).json({ message: "Data deleted successfully!" });
  });
});

// update category status
app.put("/updatecategorystatus/:id", (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const query = "UPDATE categories SET status = ? WHERE id = ?";
  db.query(query, [status, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
    return res.status(200).json({ message: "Status updated successfully!" });
  });
});


app.listen(8081,()=>{
    console.log("server listening at port 8081");
})