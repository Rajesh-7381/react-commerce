import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { NotificationContainer,NotificationManager } from 'react-notifications';
import { CSVLink } from 'react-csv';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Swal from 'sweetalert2';

const Subadmin = (args) => {
    const navigate=useNavigate();
    const [data, setData] = useState([]);
    const [filterData, setFilterData] = useState([]);

    const [modal, setModal] = useState(false);

  // inside modal data shown(eye)
    const [modaldata, setmodaldata] = useState({});

  

    useEffect(() => {
        handleData();
    }, []);

    // Fetch data
    const handleData = async () => {
        try {
            const response = await axios.get("http://localhost:8081/subadmindata");
            setData(response.data);
            setFilterData(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    // CSV headers
    const headers = [
        { label: 'Name', key: 'name' },
        { label: 'Mobile', key: 'mobile' },
        { label: 'Email', key: 'email' },
        { label: 'Role', key: 'role' },
    ]

    // Searching function
    const searchFunction = (event) => {
        const searchData = event.target.value.toLowerCase().trim();
        if (searchData === '') {
            setFilterData(data);
        } else {
            const filtered = data.filter(item =>
                item.name.toLowerCase().includes(searchData) ||
                item.email.toLowerCase().includes(searchData) ||
                item.mobile.toLowerCase().includes(searchData) ||
                item.role.toLowerCase().includes(searchData)
            );
            setFilterData(filtered);
        }
    };
    // single data using modal 
    const toggle = async (id) => {
        try {
          const response = await axios.get(`http://localhost:8081/singledata/${id}`);
          setmodaldata(response.data.data);
          setModal(!modal);
        } catch (error) {
          console.error("error fetching data", error);
          setModal(!modal);
        }
      };

    //   update functionality
    const handleupdate = async (id) => {
        navigate("/subadminaddedit",{state:{id:id}});
    }

    // delete functionality
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
            await axios.delete(`http://localhost:8081/deletesingledata/${id}`);
            NotificationManager.success("successfully!  deleted data");
            // Fetch the updated data from the server and update the local state
            const response = await axios.get("http://localhost:8081/alldata");
            setData(response.data);
            setFilterData(response.data);
          } else {
            // Do nothing
            NotificationManager.error("Data not deletd  successfully!");
          }
        } catch (error) {
          console.error(error);
        }
      };
      

    //   status change or role change
    const handleStatusChange=async(id)=>{
        
    }

    return (
        <div>
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h1 className="card-title" style={{ margin: "auto", width: "100%", fontWeight: "bold" }}>
                                        <span className='badge badge-pill badge-warning'>Subadmin/</span> <span className='badge badge-pill badge-info'>Registered User Data</span>
                                    </h1>
                                </div>
                                <div className="card-body">
                                    <form className='d-flex align-items-center justify-content-end'>
                                        <div className="input-group">
                                            <input className="mr-2" type="search" placeholder="Search" aria-label="Search" onKeyUp={searchFunction} />
                                            <div className="input-group-append">
                                                <button className="btn btn-outline-success mr-5" type="button" >Search</button>
                                                <NotificationContainer />
                                                 <CSVLink data={filterData} headers={headers} filename='Static_users.csv' target='_blank' className='btn btn-dark mr-5 '>Export CSV <i className="fas fa-solid fa-download"></i> </CSVLink>
                                                <button className='btn btn-outline-danger text-dark  ' style={{ right: "10px", position: "absolute" }}><Link to={"/admindashboard1"}><i className="fas fa fa-arrow-circle-left">Back</i></Link></button>
                                            </div>
                                        </div>
                                    </form>
                                    <table id="example1" className="table table-bordered table-striped">
                                        <thead>
                                            <tr>
                                                <th className='bg-dark text-light'>ID</th>
                                                <th className='bg-dark text-light'>NAME</th>
                                                <th className='bg-dark text-light'>MOBILE</th>
                                                <th className='bg-dark text-light'>EMAIL</th>
                                                <th className='bg-dark text-light'>ROLE</th>
                                                <th className='bg-dark text-light'>ACTIONS</th>
                                                <th className='bg-dark text-light'>Type</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filterData.map((item, index) => (
                                                <tr key={item.id} className={item.role === 'subadmin' ? 'bg-info' : 'bg-primary'}>
                                                    <td className={item.role === 'subadmin' ? 'bg-info' : 'bg-primary'}>{index + 1}</td>
                                                    <td className={item.role === 'subadmin' ? 'bg-info' : 'bg-primary'}>{item.name}</td>
                                                    <td className={item.role === 'subadmin' ? 'bg-info' : 'bg-primary'}>{item.mobile}</td>
                                                    <td className={item.role === 'subadmin' ? 'bg-info' : 'bg-primary'}>{item.email}</td>
                                                    <td className={item.role === 'subadmin' ? 'bg-info' : 'bg-primary'}>{item.role}</td>
                                                    <td className={item.role === 'subadmin' ? 'bg-info' : 'bg-primary'}>
                                                        <button className='btn btn-dark btn-sm mr-2' onClick={()=> toggle(item.id)}><i className='fas fa-eye'></i></button>
                                                        <button className='btn btn-success btn-sm mr-2' onClick={()=> handleupdate(item.id)}><i className='fas fa-pencil-alt'></i></button>
                                                        <button className='btn btn-danger btn-sm' onClick={()=>handledelete(item.id)}><i className='fas fa-trash'></i></button>
                                                    </td>
                                                    <td className={item.role === 'subadmin' ? 'bg-info' : 'bg-primary'}> <i className={item.role === 'subadmin' ? 'fas fa-toggle-on' : 'fas fa-toggle-off'} style={{ color: item.role === 'subadmin' ? 'black' : '' }} onClick={() => handleStatusChange(item.id)} ></i></td>               
                                               </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* for show singledata modal*/}
      


    <Modal isOpen={modal} toggle={toggle} {...args}>
        <ModalHeader toggle={toggle}>Hi <span className='bg-warning '>{modaldata.name}</span>This is Your Personal Information</ModalHeader>
        <ModalBody>
        <p style={{ fontWeight: "bolder" }}> ID: <span style={{ color: "blue", fontWeight: "bold" }}>{modaldata.id}</span></p>
        <hr />
        <p style={{ fontWeight: "bolder" }}> Name: <span style={{ color: "blue", fontWeight: "bold" }}>{modaldata.name}</span></p>
        <p style={{ fontWeight: "bolder" }}> Mobile: <span style={{ color: "blue", fontWeight: "bold" }}>{modaldata.mobile}</span></p>
        <hr />
        <p style={{ fontWeight: "bolder" }}> Email: <span style={{ color: "blue", fontWeight: "bold" }}>{modaldata.email}</span></p>
        <hr />
        <p style={{ fontWeight: "bolder" }}> Role: <span style={{ color: "blue", fontWeight: "bold" }}>{modaldata.role}</span></p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>
            Ok
          </Button>{' '}
          <Button color="danger" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
        </div>
    );
}

export default Subadmin;
