# react-commerce

it have 3 parts i,e 
    ->frontend
    ->backend
    ->bug

                        frontend::
                        =========
1.    <create-react-app foldername>
create a new project in react ->npx create-react-app foldername create new file->echo. > file name create new folder->mkdir folder name open vs code using cmd -> code .

2.   <npm i bootstrap>
to install bottstarp in react -> npm i bootstrap add in index.js -> import "bootstrap/dist/css/bootstrap.css"; import "bootstrap/dist/js/bootstrap.bundle";

3.   <npm install bootstrap-icons>
install bootstarp icons ->npm install bootstrap-icons add in index.js-> import "bootstrap-icons/font/bootstrap-icons.css"

4.  <npm i formik->form validtion >
5.  <npm i yup->for data validation>
6.  <npm i react-notifications>
7.  <add in app.js  (import 'react-notifications/lib/notifications.css';)
8.  <npm install react-helmet>
9.  <to install fontawesome library>

-> npm install react-helmet ->import React, { useEffect } from "react"; ->useEffect(() => { // Set document title when the component mounts document.title = "Register"; }, []);

->When the component mounts, the useEffect hook runs the function to update the document title.
->At the same time, the Helmet component renders the <title> tag with the specified title.
->React Helmet then manages updating the document head with the content of the <Helmet> component.
->This approach ensures that the document title is dynamically updated based on the component being rendered,       
>providing a seamless user experience.

->use of react useffct hook ::In React, useEffect is a hook that can be used to run side effects or manage state changes after 
10. <npm i react-csv> to download csv format in table data
11. <npm install jspdf jspdf-autotable> to download in pdf format
    ->import {jsPDF} from "jspdf";
    ->import 'jspdf-autotable'; import these file otheerwise not downloadable
12. -><npm i reactstrap>
12. -><npm install sweetalert2>
12. -><npm i zxcvbn> (for progress bar(strong password))
13. ->npm install react-hook-form(for form validation and update purpose)

abstract::
=========
->1st we configure both frontend and and backend.
=>user registered 1st and after that 1st of all we define manually one user have admin thats why they acess admin page .
->and register page validate using formik and yup also registered user shown after successfully submitng form i,e react notifications
->after that we configure how manny user registered shown that shown by admin dynamically
day-4::(addeditregister.jsx)
======
->to show data in tabular format
->export csv download
->pdf format data download
->print data
->searching functionality
->modal data fuctionality and update button inside data shown modal inside form (using react-strap)
->add pagination

day-5::(addeditregister.jsx)
======
->add and show single data using eye icon 
->edit functionality using formik(when click on toggle2 it is open for modal and inside this call onsubmit() function it set values    and   after that  handle submit able to edit the data)
->deleted functionality using sweetalert2
->show all types of notification
->add subadmin
->show password icon functionality
->in registering time data goes to database (password) in hashing format

day-6::
======
->show data in table format
->eye functionality
->csv download
->searching functionality
day-7::
=======
->update functionalty (using react-form-hook)
->delete functionality
->type column role data shown
->add tracker functionality like if user or admin or subadmin without login they can not acess dashboard or any other page

                             backend::
                             =========

->create a backend folder
    ->inside package.json to write("start":"nodemon server.js")
    ->inside backend to run comand(npm init -y)->to install package.json
    ->inside backend to run command(npm i mysql express nodemon cors)
    ->if mysql not worked to expicitly install(npm install mysql2)
    ->npm i bcrypt (for hashing password using sal and gensalt)




                                            bug::
                                            ====
->validation not worked in addeditregister.jsx(update form)
->show user data like(ok,cancel,cross icon) not worked.   (bug fixed successfully!)
->show user data like(ok,cancel,cross icon) not worked.(subadmin.jsx)  (bug fixed successfully!)