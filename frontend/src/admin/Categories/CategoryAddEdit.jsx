import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { NotificationManager,NotificationContainer } from 'react-notifications';

const CategoryAddEdit = () => {
    const  location  = useLocation();
    const { register, handleSubmit, setValue } = useForm();
    const [data, setData] = useState({});
    const id = location.state ? location.state.id : null;
    const navigate=useNavigate();

    useEffect(() => {
        if (id) {
            handleCategoryUpdate(id);
        }
    }, [id])

    const handleCategoryUpdate = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8081/categoryeditdata/${id}`);
            const categoryData = response.data.data;
            setData(categoryData);
            setValue('category_name', categoryData.category_name);
            setValue('category_discount', categoryData.category_discount);
            setValue('description', categoryData.description);
            setValue('url', categoryData.url);
            setValue('meta_title', categoryData.meta_title);
            setValue('meta_description', categoryData.meta_description);
            setValue('meta_keyword', categoryData.meta_keyword);
        } catch (error) {
            console.log(error);
        }
    }

    const onSubmit = async (formData) => {
        try {
            const form = new FormData();
            // Append form data
            form.append('category_name', formData.category_name);
            form.append('category_discount', formData.category_discount);
            form.append('description', formData.description);
            form.append('url', formData.url);
            form.append('meta_title', formData.meta_title);
            form.append('meta_description', formData.meta_description);
            form.append('meta_keyword', formData.meta_keyword);
            // Append image file
            form.append('category_image', formData.category_image[0]);
            
            if (id) {
                const response = await axios.put(`http://localhost:8081/updatecategory/${id}`, form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                // alert(response.data.message);
                NotificationManager.success("updated successfully!")
                setTimeout(()=>{
                    navigate("/categories");
                },2000);
            } else {
                const response = await axios.post('http://localhost:8081/addcategory', form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                // alert(response.data.message);
                NotificationManager.success("form submited successfully!")
                setTimeout(()=>{
                    navigate("/categories");
                },2000);
            }
        } catch (error) {
            console.log(error);
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
                                        <li className="breadcrumb-item"><Link to={"/categories"}>Back</Link></li>
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
                                            {id ? "Update Form" : "Category Adding Form"}
                                        </h3>
                                    </div>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="card-body">
                                                    <div className="form-group text-start">
                                                        <label htmlFor="exampleInputCategoryName">Category Name <span className='text-danger'>*</span></label>
                                                        <input type="text" className="form-control" id="exampleInputCategoryName" name='category_name' {...register("category_name", { "required": true })} defaultValue={data.category_name} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="card-body">
                                                    <div className="form-group text-start">
                                                        <label htmlFor="exampleInputCategoryfile">Category Image<span className='text-danger'>*</span></label>
                                                        <input type="file" className="form-control" id="exampleInputCategoryfile" name='category_image' {...register("category_image", { "required": !id })} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="card-body">
                                                    <div className="form-group text-start">
                                                        <label htmlFor="exampleInputCategoryDiscount">Category Discount <span className='text-danger'>*</span></label>
                                                        <input type="text" className="form-control" id="exampleInputCategoryDiscount" name='category_discount' {...register("category_discount", { "required": true })} defaultValue={data.category_discount} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="card-body">
                                                    <div className="form-group text-start">
                                                        <label htmlFor="exampleInputCategoryDescription">Description <span className='text-danger'>*</span></label>
                                                        <input type="text" className="form-control" id="exampleInputCategoryDescription" name='description' {...register("description", { "required": true })} defaultValue={data.description} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="card-body">
                                                    <div className="form-group text-start">
                                                        <label htmlFor="exampleInputCategoryURL">Category URL <span className='text-danger'>*</span></label>
                                                        <input type="text" className="form-control" id="exampleInputCategoryURL" name='url' {...register("url", { "required": true })} defaultValue={data.url} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="card-body">
                                                    <div className="form-group text-start">
                                                        <label htmlFor="exampleInputCategoryTitle">Meta Title <span className='text-danger'>*</span></label>
                                                        <input type="text" className="form-control" id="exampleInputCategoryTitle" name='meta_title' {...register("meta_title", { "required": true })} defaultValue={data.meta_title} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="card-body">
                                                    <div className="form-group text-start">
                                                        <label htmlFor="exampleInputCategoryDescription">Meta Description <span className='text-danger'>*</span></label>
                                                        <input type="text" className="form-control" id="exampleInputCategoryDescription" name='meta_description' {...register("meta_description", { "required": true })} defaultValue={data.meta_description} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="card-body">
                                                    <div className="form-group text-start">
                                                        <label htmlFor="exampleInputCategoryKeyword">Meta Keyword <span className='text-danger'>*</span></label>
                                                        <input type="text" className="form-control" id="exampleInputCategoryKeyword" name='meta_keyword' {...register("meta_keyword", { "required": true })} defaultValue={data.meta_keyword} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='text-start'>
                                            <button type="submit" className='btn btn-primary'>{id ? "Update" : "Submit"}</button>
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

export default CategoryAddEdit;
