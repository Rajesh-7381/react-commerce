import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const AddEditRegisterUser = (args) => {
   
  const [pass,setpass]=useState(false);
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);

  // inside modal data shown(eye)
  const [modaldata, setmodaldata] = useState({});

  const [id, setId] = useState(""); // Define id state

  const toggle = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8081/singledata/${id}`);
      setmodaldata(response.data.data);
      setModal(!modal);
    } catch (error) {
      console.error("error fetching data", error);
    }
  };

  const toggle2 = async (id) => {
    setModal2(!modal2);
    await onSubmitForm(id);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8081/alldata");
        setData(response.data);
        setFilterData(response.data);  // Initialize filterData as well
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const searchFunction = (event) => {
    const searchTerm = event.target.value.toLowerCase().trim();
    if (searchTerm === "") {
      setFilterData(data);
    } else {
      const filtered = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.email.toLowerCase().includes(searchTerm) ||
        item.role.toLowerCase().includes(searchTerm)
      );
      setFilterData(filtered);
    }
  };

  // csv download
  const headers = [
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Role', key: 'role' },
    
  ]

  // pdf download
  const DownloadPDFFormatDocument = () => {
    const doc = new jsPDF();

    // define column and data
    const tablecolumn = ["SL No", "NAME", "EMAIL", "ROLE"];
    const tablerows = [];

    // data from state
    data.forEach((item, index) => {
      const rowdata = [
        index + 1,
        item.name,
        item.email,
        item.role.toUpperCase()
      ];
      tablerows.push(rowdata);
    });
    doc.autoTable(tablecolumn, tablerows, { startY: 20 }); //sets the vertical position (the Y-coordinate) on the PDF document where the table should start being drawn. The value 20 means that the table starts 20 units down from the top of the page
    doc.text("RegisteredUsers", 14, 15); //specific cordinates
    doc.save("RegisteredUsers.pdf");
    NotificationManager.success("Form Download PDF Format Document successfully!");
  }

  // for print data
  const printdata = () => {
    window.print();
    // NotificationManager.success("Form submitted successfully!");
  }

  // for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filterData.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filterData.length / recordsPerPage);
  const numbers = [...Array(totalPages + 1).keys()].slice(1);

  const prePage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const pageChange = (page) => {
    setCurrentPage(page);
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().max(100).min(3).required("please enter your name!"),
    email: Yup.string().max(100).min(2).required("please enter your email!"),
    password: Yup.string().max(100).min(6).required("please enter your password!"),
    role: Yup.string().required("please enter your name!")
  });

  const onSubmitForm = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8081/editdata/${id}`);
      const { data } = response.data;
      formik.setValues({
        name: data.name,
        mobile: data.mobile,
        email: data.email,
        password: data.password,
        role: data.role
      });
      setId(data.id); // Set id state
    } catch (error) {

    }
  };


  const handleSubmit = async (values) => {
    try {
      await axios.put(`http://localhost:8081/update/${id}`, values);
      NotificationManager.success("Form updated successfully!");
      // Fetch the updated data from the server and update the local state
      const response = await axios.get("http://localhost:8081/alldata");
      setData(response.data);
      setFilterData(response.data);
      setModal2(false); // Close the modal after successful submission
    } catch (error) {
        NotificationManager.error("Form  not updated successfully!");
      console.error("Error updating data", error);
    }
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: ""
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit
  });

//   delete functionality
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
  

  return (
    <div>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header ">
                  <h1 className="card-title " style={{margin:"auto",width:"100%" ,fontWeight:"bold"}}><span className='badge badge-pill badge-info'>Registered User Data</span></h1>
                </div>
                <div className="card-body">
                  <form className='d-flex align-items-center justify-content-end'>
                    <div className="input-group">
                      <input className="mr-2" type="search" placeholder="Search" aria-label="Search" onKeyUp={searchFunction} />
                      <div className="input-group-append">
                        <button className="btn btn-outline-success mr-5" type="button" >Search</button>
                        <NotificationContainer />
                        <CSVLink data={filterData} headers={headers} filename='Static_users.csv' target='_blank' className='btn btn-dark mr-5 '>Export CSV <i className="fas fa-solid fa-download"></i> </CSVLink>
                        <NotificationContainer />
                        <button className='btn btn-dark mr-5' onClick={DownloadPDFFormatDocument}>PDF Format <i className="fas fa-solid fa-download"></i></button>
                        <NotificationContainer />
                        <button className='btn btn-dark mr-5' onClick={printdata}>Print <i className="fas fa-solid fa-print"></i></button>
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
                      </tr>
                    </thead>
                    <tbody>
                      {filterData.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage).map((dt, index) => (

                        <tr key={dt.id} className={dt.role === 'admin' ? 'bg-warning' : dt.role === 'subadmin' ? 'bg-info' : 'bg-primary'}>

                          <td className={dt.role === 'admin' ? 'bg-warning' : dt.role === 'subadmin' ? 'bg-info' : 'bg-primary'}>{(currentPage - 1) * recordsPerPage + index + 1}</td>
                          <td className={dt.role === 'admin' ? 'bg-warning' : dt.role === 'subadmin' ? 'bg-info' : 'bg-primary'}>{dt.name}</td>
                          <td className={dt.role === 'admin' ? 'bg-warning' : dt.role === 'subadmin' ? 'bg-info' : 'bg-primary'}>{dt.mobile}</td>
                          <td className={dt.role === 'admin' ? 'bg-warning' : dt.role === 'subadmin' ? 'bg-info' : 'bg-primary'}>{dt.email}</td>
                          <td className={dt.role === 'admin' ? 'bg-warning' : dt.role === 'subadmin' ? 'bg-info' : 'bg-primary'}>
                            {dt.role === 'admin' ? 'ADMIN' : dt.role === 'subadmin' ? 'SUBADMIN' : 'USER'}
                          </td>
                          <td className={dt.role === 'admin' ? 'bg-warning' : dt.role === 'subadmin' ? 'bg-info' : 'bg-primary'}>
                            <button className='btn btn-dark btn-sm mr-2' onClick={() => toggle(dt.id)}><i className='fas fa-eye'></i></button>
                            <NotificationContainer />
                            <button className='btn btn-success btn-sm mr-2' onClick={() => toggle2(dt.id)}><i className='fas fa-pencil-alt'></i></button>
                            <NotificationContainer />
                            <button className='btn btn-danger btn-sm' onClick={() => handledelete(dt.id)}><i className='fas fa-trash'></i></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <br></br>
                  <nav className='float-right'>
                    <ul className='pagination'>
                      <li className='page-item'>
                        <button onClick={prePage} className='page-link'>Prev</button>
                      </li>
                      {numbers.map((n, i) => (
                        <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={i}>
                          <button onClick={() => pageChange(n)} className='page-link'>{n}</button>
                        </li>
                      ))}
                      <li className='page-item'>
                        <button onClick={nextPage} className='page-link'>Next</button>
                      </li>
                    </ul>
                  </nav>
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


      {/* for update modal*/}
      <Modal isOpen={modal2} toggle={toggle2} {...args}>
        <ModalHeader toggle={toggle2}>Hi This is Your Personal Information</ModalHeader>
        <ModalBody>
          <section className="content">
            <div className="container-fluid">
              <div className="row">
                {/* left column */}
                <div className="col-md-12">
                  {/* general form elements */}
                  <div className="card card-primary">
                    <div className="card-header">
                      <h3 className="card-title">Update Form</h3>
                    </div>
                    {/* /.card-header */}
                    {/* form start */}
                    <form onSubmit={formik.handleSubmit}>

                      <div className="card-body">
                        <div className="form-group">
                          <label htmlFor="exampleInputName"><i className='fas fa-user'></i> Enter Your Name</label>
                          <input type="text" className="form-control" id="exampleInputName" placeholder="Enter email" name='name' value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} autoComplete='username' />
                          {formik.touched.name && formik.errors.name ? <div className="text-danger">{formik.errors.name}</div> : null}
                        </div>

                        <div className="form-group">
                          <label htmlFor="email"><i class="fas fa-envelope"></i> Email address</label>
                          <input type="email" className="form-control" id="email" placeholder="Enter email" name='email' value={formik.values.email} onChange={formik.handleChange} autoComplete='username' />
                          {formik.touched.email && formik.errors.email ? <div className="text-danger">{formik.errors.email}</div> : null}
                        </div>
                        <div className="form-group">
                          <label htmlFor="exampleInputMobile"><i class="fas fa-solid fa-phone"></i> Email Mobile</label>
                          <input type="text" className="form-control" id="exampleInputMobile" placeholder="Enter Mobile" name='mobile' value={formik.values.mobile} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        </div>

                        <div className="form-group">
                          <label htmlFor="exampleInputPassword1"><i className='fas fa-lock'></i> Password</label>
                          <input type={pass ? 'text' : 'password'} className="form-control" id="exampleInputPassword1" placeholder="Password" name='password' value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} autoComplete='current-password' />
                          <p style={{position: "absolute", top: "66%", right: "23px", transform: "translateY(-40%)", cursor: "pointer"}} onClick={()=>setpass(!pass)}>{(pass) ? <i className='fas fa-solid fa-eye-slash'></i> : <i className='fas fa-eye'></i>}</p>
                          {formik.touched.password && formik.errors.password ? <div className="text-danger">{formik.errors.password}</div> : null}
                        </div>
                        <div className="form-group">
                          <label><i className='fas fa-user'></i> Role<span className='text-danger'>*</span></label>
                          <select className="form-control select2 select2-danger" data-dropdown-css-class="select2-danger" name='role' style={{ width: '100%' }} value={formik.values.role} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                            <option>Select Role</option>
                            <option value="admin" selected={formik.values.role === 'admin'}>Admin</option>
                            <option value="subadmin" selected={formik.values.role === 'subadmin'}>SubAdmin</option>
                            <option value="user" selected={formik.values.role === 'user'}>User</option>
                          </select>
                          {formik.touched.role && formik.errors.role ? <div className="text-danger">{formik.errors.role}</div> : null}
                        </div>
                      </div>
                      {/* /.card-body */}
                      <div className="card-footer">
                        <button type="submit" className="btn btn-success">Submit</button>
                      </div>
                    </form>
                  </div>
                  {/* /.card */}
                </div>
                {/*/.col (left) */}
                {/* right column */}
              </div>
              {/* /.row */}
            </div>{/* /.container-fluid */}
          </section>

        </ModalBody>
        <ModalFooter>
        <Button color="primary" onClick={toggle}>
            Ok
        </Button>{' '}
        <Button color="danger" onClick={toggle2}>Cancel</Button>{' '}
        </ModalFooter>
      </Modal>

    </div>
  );
}

export default AddEditRegisterUser;
