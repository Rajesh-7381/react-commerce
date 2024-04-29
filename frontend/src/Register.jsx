import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import zxcvbn from 'zxcvbn';
import ReCAPTCHA from 'react-google-recaptcha';

const Register = () => {
    const navigate = useNavigate();
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [cap,setcap]=useState(null);

    const initialValues = {
        name: "",
        mobile: "",
        email: "",
        password: "",
        image: null,
    };

    const validationSchema = Yup.object({
        name: Yup.string().max(100).min(3).required("Please enter your name!"),
        mobile: Yup.string().max(10).min(10).required("Mobile number required!"),
        email: Yup.string().max(100).min(2).required("Please enter your email!"),
        password: Yup.string().max(30).min(6).required("Please enter your password!"),
        image: Yup.mixed().test("fileFormat","supported file format is png,webp,jpeg and jpg",(value)=>{
            if(value){
                const supportedfileformat =["image/png", "image/webp", "image/jpeg", "image/jpg"];
                return supportedfileformat.includes(value.type);
            }
            return true;
        }).required("Please upload your image!"),
    });

    const onSubmitForm = async (values, action) => {
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('mobile', values.mobile);
            formData.append('email', values.email);
            formData.append('password', values.password);
            formData.append('image', values.image);

            const response = await axios.post("http://localhost:8081/register", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            NotificationManager.success("Form submitted successfully!");
            setTimeout(() => {
                action.resetForm();
                navigate("/");
            }, 3000);
        } catch (error) {
            console.log("Error submitting form", error);
            NotificationManager.error("Form submission was not successful!");
        }
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: onSubmitForm
    });

    const togglePasswordVisibility = () => {
        setPasswordVisibility(!passwordVisibility);
    };

    const calculatePasswordStrength = (password) => {
        const result = zxcvbn(password);
        setPasswordStrength(result.score);
    };

    const recaptchaRef = React.createRef();

    return (
        <div>
            <div className="u-s-p-b-60">
                <div className="section__intro u-s-m-b-60">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="section__text-wrap">
                                    <h1 className="section__heading u-c-secondary">CREATE AN ACCOUNT</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section__content">
                    <div className="container">
                        <div className="row row--center ">
                            <div className="col-lg-6 col-md-8 u-s-m-b-30">
                                <div className="l-f-o">
                                    <div className="l-f-o__pad-box" style={{ boxShadow: "10px 10px 5px 12px lightblue" }}>
                                        <h1 className="gl-h1">PERSONAL INFORMATION</h1>
                                        <form className="l-f-o__form" onSubmit={formik.handleSubmit}>
                                            <div className="u-s-m-b-30">
                                                <label className="gl-label text-start" htmlFor="reg-name">NAME <span className='text-danger'>*</span></label>
                                                <input className="input-text input-text--primary-style" type="text" id="reg-name" placeholder="Name" name='name' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name} />
                                                {formik.touched.name && formik.errors.name ? (
                                                    <div className="text-danger">{formik.errors.name}</div>
                                                ) : null}
                                            </div>
                                            <div className="u-s-m-b-30">
                                                <label className="gl-label text-start" htmlFor="reg-image">IMAGE <span className='text-danger'>*</span></label>
                                                <input className="form-control" type="file" id="reg-image" name='image' onChange={(event) => {
                                                    formik.setFieldValue('image', event.currentTarget.files[0]);
                                                }} />
                                                {formik.touched.image && formik.errors.image ? (
                                                    <div className="text-danger">{formik.errors.image}</div>
                                                ) : null}
                                            </div>
                                            <div className="u-s-m-b-30">
                                                <label className="gl-label text-start" htmlFor="reg-mobile">MOBILE <span className='text-danger'>*</span></label>
                                                <input className="input-text input-text--primary-style" type="text" id="reg-mobile" placeholder="MOBILE" name='mobile' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.mobile} />
                                                {formik.touched.mobile && formik.errors.mobile ? (
                                                    <div className="text-danger">{formik.errors.mobile}</div>
                                                ) : null}
                                            </div>
                                            <div className="u-s-m-b-30">
                                                <label className="gl-label text-start" htmlFor="reg-email">E-MAIL <span className='text-danger'>*</span></label>
                                                <input className="input-text input-text--primary-style" type="text" id="reg-email" placeholder="Enter E-mail" name='email' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
                                                {formik.touched.email && formik.errors.email ? (
                                                    <div className="text-danger">{formik.errors.email}</div>
                                                ) : null}
                                            </div>
                                            <div className="u-s-m-b-30">
                                                <label className="gl-label text-start" htmlFor="reg-password">PASSWORD <span className='text-danger'>*</span></label>
                                                <div className="position-relative">
                                                    <input className="input-text input-text--primary-style" type={passwordVisibility ? 'text' : 'password'} id="reg-password" placeholder="Enter Password" name='password' autoComplete='current-password' onChange={(e) => {
                                                        formik.handleChange(e);
                                                        calculatePasswordStrength(e.target.value);
                                                    }} onBlur={formik.handleBlur} value={formik.values.password} />
                                                    <p style={{ position: "absolute", top: "50%", right: "9px", transform: "translateY(-40%)", cursor: "pointer" }} onClick={togglePasswordVisibility}>
                                                        {passwordVisibility ? <i className='fas fa-solid fa-eye-slash'></i> : <i className='fas fa-eye'></i>}
                                                    </p>
                                                </div>
                                                {formik.touched.password && formik.errors.password ? (
                                                    <div className="text-danger">{formik.errors.password}</div>
                                                ) : null}
                                                <div className="progress mt-2">
                                                    <div
                                                        className={`progress-bar ${passwordStrength === 0 ? 'bg-danger' : passwordStrength === 1 ? 'bg-warning' : passwordStrength === 2 ? 'bg-info' : passwordStrength === 3 ? 'bg-primary' : 'bg-success'}`}
                                                        role="progressbar"
                                                        style={{ width: `${(passwordStrength + 1) * 25}%` }}
                                                        aria-valuenow={(passwordStrength + 1) * 25}
                                                        aria-valuemin="0"
                                                        aria-valuemax="100">
                                                        {passwordStrength === 0 && "0%"}
                                                        {passwordStrength === 1 && "25%"}
                                                        {passwordStrength === 2 && "50%"}
                                                        {passwordStrength === 3 && "75%"}
                                                        {passwordStrength === 4 && "100%"}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="u-s-m-b-15">
                                                <ReCAPTCHA
                                                    ref={recaptchaRef}
                                                    sitekey="6Lf0AcopAAAAABiOyhyphLfETW8tsx8KW9Xxs5ah" //r........2@gm....com
                                                    onChange={(val)=>setcap(val)}
                                                />
                                                <NotificationContainer />
                                                <button className="btn btn--e-transparent-brand-b-2 btn-outline-primary w-75" disabled={!cap} type="submit">CREATE</button>
                                            </div>
                                            <Link className="gl-link"  to={'/'}>Already have an Account? Login Now</Link>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
