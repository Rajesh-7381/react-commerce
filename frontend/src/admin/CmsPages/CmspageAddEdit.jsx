import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { NotificationManager } from 'react-notifications';

const CmspageAddEdit = () => {
    const location = useLocation();
    const navigate=useNavigate();
    const { register, handleSubmit, setValue } = useForm();
    const id = location.state ? location.state.id : null;
    const [cmspagedata, setcmspagedata] = useState([]);

    useEffect(() => {
        document.title='AddEditCmsPages';
        if (id) {
            handleupdatecmspage(id);
        }
    }, [id])

    const handleupdatecmspage = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8081/cmspageeditdata/${id}`);
            const cmsdata = response.data.data;

            setcmspagedata(cmsdata);
            setValue("title", cmsdata.title);
            setValue("description", cmsdata.description);
            setValue("url", cmsdata.url);
            setValue("meta_title", cmsdata.meta_title);
            setValue("meta_description", cmsdata.meta_description);
            setValue("meta_keywords", cmsdata.meta_keywords);
        } catch (error) {
            console.error(error)
        }
    }

    const onsubmit = async (formData) => {
        try {
            if (id) {
                const response = await axios.put(`http://localhost:8081/cmsupdatepage/${id}`, formData);
                if (response.status === 200) {
                    NotificationManager.success("Form updated successfully!");
                }
                navigate("/cmspages");
            } else {
                const response = await axios.post("http://localhost:8081/cmsaddpage", formData);
                if (response.status === 200) {
                    NotificationManager.success("Form submitted successfully!");
                }
                navigate("/cmspages");
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <div className="wrapper">
                <div className="content-wrapper">
                    <section className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6"></div>
                                <div className="col-sm-6">
                                    <ol className="breadcrumb float-sm-right">
                                        <li className="breadcrumb-item"><Link to={"/admindashboard1"}>Home</Link></li>
                                        <li className="breadcrumb-item"><Link to={"/cmspages"}>Back</Link></li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="card card-primary">
                                    <div className="card-header">
                                        <h3 className="card-title" style={{ width: "100%", fontWeight: "bold" }}>
                                            {id ? 'Update Form' : 'Add Form'}
                                        </h3>
                                    </div>
                                    <form onSubmit={handleSubmit(onsubmit)}>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="card-body">
                                                    <div className="form-group text-start">
                                                        <label htmlFor="exampleInputcmspageTitle">Title<span className='text-danger'>*</span></label>
                                                        <input type="text" className="form-control" id="exampleInputcmspageTitle" name='title' {...register("title", { "required": true })} defaultValue={cmspagedata.title} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="card-body">
                                                    <div className="form-group text-start">
                                                        <label htmlFor="exampleInputcmspageDescription">Description<span className='text-danger'>*</span></label>
                                                        <input type="text" className="form-control" id="exampleInputcmspageDescription" name='description'  {...register("description", { "required": true })} defaultValue={cmspagedata.description} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="card-body">
                                                    <div className="form-group text-start">
                                                        <label htmlFor="exampleInputcmspageURL">URL <span className='text-danger'>*</span></label>
                                                        <input type="text" className="form-control" id="exampleInputcmspageURL" name='url' {...register("url", { "required": true })} defaultValue={cmspagedata.url} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="card-body">
                                                    <div className="form-group text-start">
                                                        <label htmlFor="exampleInputcmspagemeta_title">Meta Title <span className='text-danger'>*</span></label>
                                                        <input type="text" className="form-control" id="exampleInputcmspagemeta_title" name='meta_title'  {...register("meta_title", { "required": true })} defaultValue={cmspagedata.meta_title} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="card-body">
                                                    <div className="form-group text-start">
                                                        <label htmlFor="exampleInputcmspagemeta_description">Meta Description <span className='text-danger'>*</span></label>
                                                        <input type="text" className="form-control" id="exampleInputcmspageexampleInputcmspagemeta_description" name='meta_description'  {...register("meta_description", { "required": true })} defaultValue={cmspagedata.meta_description} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="card-body">
                                                    <div className="form-group text-start">
                                                        <label htmlFor="exampleInputcmspagemeta_keywords">Meta Keyword <span className='text-danger'>*</span></label>
                                                        <input type="text" className="form-control" id="exampleInputcmspagemeta_keywords" name='meta_keywords'  {...register("meta_keywords", { "required": true })} defaultValue={cmspagedata.meta_keywords} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='text-start'>
                                            <button type="submit" className='btn btn-primary'>{id ? 'Update' : 'Submit'}</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default CmspageAddEdit;
