import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { NotificationManager, NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const Categories = () => {
    const navigate = useNavigate();
    const [categorydata, setcategorydata] = useState([]);
    const [filterData, setFilterData] = useState([]);

    useEffect(() => {
        document.title='Categories';
        handlecategorydata();
    }, []);

    const handlecategorydata = async () => {
        const response = await axios.get("http://localhost:8081/categories")
        setcategorydata(response.data);
        setFilterData(response.data);
    }

    // search function
    const searchfunction = (event) => {
        const searchData = event.target.value.toLowerCase().trim();
        if (searchData === '') {
            setFilterData(categorydata)
        } else {
            const filtered = categorydata.filter(item =>
                (item && item.category_name && item.category_name.toLowerCase().includes(searchData)) ||
                (item && item.url && item.url.toLowerCase().includes(searchData)) ||
                (item && item.meta_title && item.meta_title.toLowerCase().includes(searchData)) ||
                (item && item.meta_description && item.meta_description.toLowerCase().includes(searchData)) ||
                (item && item.meta_keyword && item.meta_keyword.toLowerCase().includes(searchData))
            );
            setFilterData(filtered);
        }
    }

    // edit form
    const handladdedit = (id = null) => {
        navigate("/categoriesaddedit", { state: { id: id } });
    }
    // delete data
    const handledelete = async (id) => {
        try {
            const confirmed = await Swal.fire({
                title: 'Are you sure?',
                text: 'This action cannot be undone.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
            });

            if (confirmed.isConfirmed) {
                // Delete the item
                await axios.delete(`http://localhost:8081/categorydelete/${id}`);
                NotificationManager.success("successfully!  deleted data");
                // Fetch the updated data from the server and update the local state
                const response = await axios.get("http://localhost:8081/categories");

                setcategorydata(response.data);
                setFilterData(response.data);
            } else {
                // Do nothing
                NotificationManager.error("Data not deletd  successfully!");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const toggleclick = async (id, status) => {
        try {
            // Determine the new status based on the current status
            const newstatus = status === 1 ? 0 : 1;

            // Send a PUT request to update the category status
            await axios.put(`http://localhost:8081/updatecategorystatus/${id}`, { status: newstatus });

            // Update the local state with the new status
            const updatedata = filterData.map(item => {
                if (item.id === id) {
                    return { ...item, status: newstatus };
                }
                return item;
            })
            setFilterData(updatedata);
        } catch (error) {
            // Handle error if the request fails
            console.error(error);
            NotificationManager.error("Failed to update status!");
        }
    }

    return (
        <div>
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header ">
                                    <h1 className="card-title " style={{ margin: "auto", width: "100%", fontWeight: "bold" }}>
                                        <span className='badge badge-pill badge-warning'>Categories/</span>
                                        <span className='badge badge-pill badge-info'>Categories Data</span>
                                    </h1>
                                </div>

                                <div className="card-body">
                                    <section className="content-header">
                                        <div className="container-fluid">
                                            <div className="row mb-2">
                                                <div className="col-sm-6"></div>
                                                <div className="col-sm-6">
                                                    <ol className="breadcrumb float-sm-right">
                                                        <li className="breadcrumb-item "><Link to={"/admindashboard1"}>Home</Link></li>
                                                        <li className="breadcrumb-item"><Link to={"/categories"}>Back</Link></li>
                                                    </ol>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <form className='d-flex align-items-center justify-content-end'>
                                        <div className="input-group">
                                            <input className="form-control mr-2" type="search" placeholder="Search using name, url, title etc..." aria-label="Search" onKeyUp={searchfunction} />
                                            <div className="input-group-append">
                                                <button className="btn btn-outline-success mr-2" type="button">Search</button>
                                                <button className='btn btn-primary ' onClick={() => handladdedit()}>Add</button>
                                            </div>
                                        </div>
                                    </form>

                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped">
                                            <thead>
                                                <tr>
                                                    <th className='bg-dark text-light'>SL NO.</th>
                                                    <th className='bg-dark text-light'>CATEGORY NAME</th>
                                                    <th className='bg-dark text-light'>PARENT CATEGORY </th>
                                                    <th className='bg-dark text-light'>CATEGORY IMAGE</th>
                                                    <th className='bg-dark text-light'>CATEGORY DISCOUNT</th>
                                                    <th className='bg-dark text-light'>DESCRIPTION</th>
                                                    <th className='bg-dark text-light'>URL</th>
                                                    <th className='bg-dark text-light'>META TITLE</th>
                                                    <th className='bg-dark text-light'>META KEYWORD </th>
                                                    <th className='bg-dark text-light'>STATUS</th>
                                                    <th className='bg-dark text-light'>ACTIONS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    filterData.map((item, index) => (
                                                        <tr key={item.id} className={item.status === 1 ? 'bg-primary' : ''}>
                                                            <td className={item.status === 1 ? 'bg-primary' : 'bg-warning'} style={{ width: "1px" }}>{index + 1}</td>
                                                            <td className={item.status === 1 ? 'bg-primary' : 'bg-warning'}>{item.category_name}</td>
                                                            <td className={item.status === 1 ? 'bg-primary' : 'bg-warning'}>
                                                                {/* Check if the category has a parent */}
                                                                {item.parent_id ? 
                                                                    // If the category has a parent, find the parent category in the categorydata array
                                                                    categorydata.find(cat => cat.id === item.parent_id).category_name 
                                                                    // If the category does not have a parent, display "No Parent"
                                                                    : <span className="badge badge-pill badge-secondary">No Parent</span>
                                                                }
                                                            </td>
                                                                                                                    <td className={item.status === 1 ? 'bg-primary' : 'bg-warning'}><img src={item.category_image} alt={item.category_name} className="img-fluid" style={{ maxWidth: "100px" }} /></td>
                                                            <td className={item.status === 1 ? 'bg-primary' : 'bg-warning'}>{item.category_discount}</td>
                                                            <td className={item.status === 1 ? 'bg-primary' : 'bg-warning'}>{item.description}</td>
                                                            <td className={item.status === 1 ? 'bg-primary' : 'bg-warning'}>{item.url}</td>
                                                            <td className={item.status === 1 ? 'bg-primary' : 'bg-warning'}>{item.meta_title}</td>
                                                            <td className={item.status === 1 ? 'bg-primary' : 'bg-warning'}>{item.meta_keyword}</td>
                                                            <td className={item.status === 1 ? 'bg-primary' : 'bg-warning'}><span className={`badge badge-${item.status === 1 ? 'success' : 'danger'}`}>{item.status === 1 ? 'Active' : 'Inactive'}</span></td>
                                                            <td className={item.status === 1 ? 'bg-primary' : 'bg-warning'}>
                                                                <button className='btn btn-success btn-sm ' onClick={() => handladdedit(item.id)}><i className='fas fa-pencil-alt'></i></button>
                                                                <button className='btn btn-danger btn-sm' onClick={() => handledelete(item.id)}><i className='fas fa-trash'></i></button>
                                                                <button className='btn btn-dark btn-sm' onClick={() => toggleclick(item.id, item.status)}><i className={item.status === 1 ? 'fas fa-toggle-on' : 'fas fa-toggle-off'}></i></button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <NotificationContainer />
        </div>
    )
}

export default Categories;
