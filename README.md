# react-commerce
1.    <create-react-app foldername>
create a new project in react ->npx create-react-app foldername create new file->echo. > file name create new folder->mkdir folder name open vs code using cmd -> code .

2.   <npm i bootstrap>
to install bottstarp in react -> npm i bootstrap add in index.js -> import "bootstrap/dist/css/bootstrap.css"; import "bootstrap/dist/js/bootstrap.bundle";

3.   <npm install bootstrap-icons>
install bootstarp icons ->npm install bootstrap-icons add in index.js-> import "bootstrap-icons/font/bootstrap-icons.css"

4.     <npm i formik->form validtion >
5.     <npm i yup->for data validation>
6.     <npm i react-notifications>
7.     <add in app.js  (import 'react-notifications/lib/notifications.css';)
8.     <npm install react-helmet>

-> npm install react-helmet ->import React, { useEffect } from "react"; ->useEffect(() => { // Set document title when the component mounts document.title = "Register"; }, []);

->When the component mounts, the useEffect hook runs the function to update the document title.
->At the same time, the Helmet component renders the <title> tag with the specified title.
->React Helmet then manages updating the document head with the content of the <Helmet> component.
->This approach ensures that the document title is dynamically updated based on the component being rendered,       
>providing a seamless user experience.

->use of react useffct hook ::In React, useEffect is a hook that can be used to run side effects or manage state changes after 

abstraction
==========
->1st we configure both frontend and and backend
=>





->create a backend folder
    ->inside package.json to write("start":"nodemon server.js")
    ->inside backend to run comand(npm init -y)->to install package.json
    ->inside backend to run command(npm i mysql express nodemon cors)
    ->if mysql not worked to expicitly instal(npm install mysql2)
