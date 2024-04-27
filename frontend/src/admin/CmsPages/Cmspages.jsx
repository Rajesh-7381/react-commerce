import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Cmspages = () => {
    const [cmspagedata,setcmspagedata]=useState([]);

    useEffect(()=>{
        cmspagetabledata();
    },[]);

    const cmspagetabledata=async()=>{
        const response=await axios.get("http://localhost:8081/cmspagedata");
        setcmspagedata(response.data);
    }
    const handladdeditcmspage=()=>{

    }
    const searchfunction=(event)=>{
        const search_cms_pagedata=event.target.value.toLowerCase().trim();
        alert(search_cms_pagedata)
    }

    // edit
    const handlecmspageedit=async(id)=>{
        alert(id)
    }
    // delete
    const handlecmspagedelete=async(id)=>{
        alert(id)
    }
    // status change
    const handlecmspagetoggle=async(id,status)=>{
        alert(id)
        alert(status)
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
                                        <button className='btn btn-primary ' onClick={() => handladdeditcmspage()}>Add</button>
                                    </div>
                                </div>
                            </form>

                            <div className="table-responsive">
                                <table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th className='bg-dark text-light'>SL NO.</th>
                                            <th className='bg-dark text-light'>TITLE</th>
                                            <th className='bg-dark text-light'>DESCRIPTION</th>
                                            <th className='bg-dark text-light'>URL</th>
                                            <th className='bg-dark text-light'>META TITLE</th>
                                            <th className='bg-dark text-light'>META DESCRIPTION</th>
                                            <th className='bg-dark text-light'>META KEYWORD </th>
                                            <th className='bg-dark text-light'>STATUS</th>
                                            <th className='bg-dark text-light'>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            cmspagedata.map((item,index)=>(
                                                <tr className={item.status === 1 ? 'bg-primary' : 'bg-info'} key={item.id}>
                                                    <td className={item.status === 1 ? 'bg-primary' : 'bg-info'}> {index+1}</td>
                                                    <td className={item.status === 1 ? 'bg-primary' : 'bg-info'}> {item.title}</td>
                                                    <td className={item.status === 1 ? 'bg-primary' : 'bg-info'}> {item.description}</td>
                                                    <td className={item.status === 1 ? 'bg-primary' : 'bg-info'}> {item.url}</td>
                                                    <td className={item.status === 1 ? 'bg-primary' : 'bg-info'}> {item.meta_title}</td>
                                                    <td className={item.status === 1 ? 'bg-primary' : 'bg-info'}> {item.meta_description}</td>
                                                    <td className={item.status === 1 ? 'bg-primary' : 'bg-info'}> {item.meta_keywords}</td>
                                                    <td className={item.status === 1 ? 'bg-primary' : 'bg-info'}> {item.status}</td>
                                                    <td className={item.status === 1 ? 'bg-primary' : 'bg-info'}>
                                                        <button className='btn btn-sm btn-success mr-1' title='edit' onClick={()=>handlecmspageedit(item.id)}><i className='fas fa-pencil-alt'></i></button>
                                                        <button className='btn btn-sm btn-danger mr-1' title='delete' onClick={()=>handlecmspagedelete(item.id)}><i className='fas fa-trash'></i></button>
                                                        <button className='btn btn-sm btn-dark' title='toggle off/on' onClick={()=>handlecmspagetoggle(item.id,item.status)}><i className={item.status === 1 ? 'fas fa-toggle-on' : 'fas fa-toggle-off'}></i></button>
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
    </div>
  )
}

export default Cmspages