import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {  useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';

const Login = () => {
  const navigate=useNavigate();
  const [pass,setpass]=useState(false);
    const formik=useFormik({
        initialValues:{
            email:'',
            password:'',
            check:false
        },
        validationSchema:Yup.object({
          email:Yup.string().required("please enter your email!"),
          password:Yup.string().required("please enter your password!")
        }),
        onSubmit: async (values, action) => {
          // console.log("Form values:", values);
          try {
            const response = await axios.post("http://localhost:8081/login", values);
            console.log("Response Status:", response.status);
            const data = response.data;
            // console.log(data);
            if (data.status === 1) {
              switch(data.role) {
                case 'admin':
                  navigate("/admindashboard1"); // Redirect to user dashboard
                  break;
                case 'user':
                  navigate("/userdashboard2"); // Redirect to admin dashboard
                  break;
                default:
                  navigate("/"); // Default redirection if no role matched
              }
            } else {
              // handle login error, show message to user
              console.log(data.message);
            }
          } catch (error) {
            console.error("Login error:", error);
            // handle error, perhaps show a message to the user
          }
        }
        
      
        
    });

    
  return (
    <div>
        {/*====== App Content ======*/}
<div className="app-content">
{/*====== Section 1 ======*/}
<div className="u-s-p-y-10">
  {/*====== Section Content ======*/}
  <div className="section__content">
    <div className="container">
      <div className="breadcrumb">
        <div className="breadcrumb__wrap">
          <ul className="breadcrumb__list">
            <li className="has-separator">
              <a href="index.html">Home</a></li>
            <li className="is-marked">
              <Link to={"/"}>Signin</Link></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
{/*====== End - Section 1 ======*/}
{/*====== Section 2 ======*/}
<div className="u-s-p-b-60">
  {/*====== Section Intro ======*/}
  <div className="section__intro u-s-m-b-30">
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="section__text-wrap">
            <h1 className="section__heading u-c-secondary">ALREADY REGISTERED?</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/*====== End - Section Intro ======*/}
  {/*====== Section Content ======*/}
  <div className="section__content">
    <div className="container">
      <div className="row row--center">
        <div className="col-lg-6 col-md-8 u-s-m-b-30">
          <div className="l-f-o">
            <div className="l-f-o__pad-box">
              <h1 className="gl-h1">I'M NEW CUSTOMER</h1>
              <span className="gl-text u-s-m-b-30">If you don't have an account with us, please create one.</span>
              <div className="u-s-m-b-15">
                <Link className="l-f-o__create-link btn--e-transparent-brand-b-2" to={"register"}>CREATE AN ACCOUNT</Link></div>
              <h1 className="gl-h1">SIGNIN</h1>
              <span className="gl-text u-s-m-b-30">If you have an account with us, please log in.</span>
              <p id="login-error" />
              <form className="l-f-o__form" id="loginform"  onSubmit={formik.handleSubmit}>
                
                <div className="u-s-m-b-30">
                  <label className="gl-label text-start" htmlFor="login-email">E-MAIL <span className='text-danger'>*</span></label>
                  <input className="input-text input-text--primary-style" name="email" type="email" id="login-email" placeholder="Enter E-mail"  autoComplete="username" onChange={formik.handleChange}/>
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-danger">{formik.errors.email}</div>
                ) : null}
                  <p className="login-email" />
                </div>
                <div className="u-s-m-b-30">
                  <label className="gl-label text-start" htmlFor="login-password">PASSWORD <span className='text-danger'>*</span></label>
                  <input className="input-text input-text--primary-style" name="password" type={pass ? 'text' : 'password'} id="login-password" placeholder="Enter Password" autoComplete="current-password" onChange={formik.handleChange} />
                  <p style={{position: "absolute", top: "68%", right: "39px", transform: "translateY(-40%)", cursor: "pointer"}} onClick={()=>setpass(!pass)}>{(pass) ? <i className='fas fa-solid fa-eye-slash'></i> : <i className='fas fa-eye'></i>}</p>
                  {formik.touched.password && formik.errors.password ? (
                    <div className="text-danger">{formik.errors.password}</div>
                ) : null}
                  <p className="login-password" /></div>
                  <div className="u-s-m-b-30">
                  {/*====== Check Box ======*/}
                  <div className="check-box float-start">
                    <input type="checkbox" name='check'  id="remember-me"  onChange={formik.handleChange} checked={formik.values.check}/>
                    <div className="check-box__state check-box__state--primary ">
                      <label className="check-box__label "  htmlFor="remember-me">Remember Me</label></div>
                  </div>
                  {/*====== End - Check Box ======*/}
                </div>
                <br></br>
                <div className="gl-inline " >
                  <div className="u-s-m-b-30">
                    <button className="btn btn--e-transparent-brand-b-2 btn-outline-primary w-75" type="submit">LOGIN</button>
                  </div>
                  <div className="u-s-m-b-30">
                    <Link className="gl-link" >Lost Your Password?</Link>
                  </div>
                </div>
                
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/*====== End - Section Content ======*/}
</div>
{/*====== End - Section 2 ======*/}
</div>
{/*====== End - App Content ======*/}


    </div>
  )
}

export default Login
