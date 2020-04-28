import React, { useEffect,useState } from 'react';
import './Add_new_check.css';
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import Select from 'react-select';
import axios from 'axios';
import Swal from 'sweetalert2';
import DatePicker from "react-datepicker";
import moment from 'moment';

function Add_new_check(props){

    var [is_open_exp_check,set_is_open_exp_check] = useState(false);
    const open_exp_check = () => {set_is_open_exp_check(true)};
    const close_exp_check = () => {set_is_open_exp_check(false)};
    const [all_stores,set_all_stores] = useState([]);
    useEffect(()=>{
        set_all_stores(props.all_stores);
    },[is_open_exp_check]);
    const [selected_store,set_selected_store]= useState({});
    const handle_select_store = (_selectedOption) => {
        set_selected_store(_selectedOption)
        exp_new_check_data.store_id=_selectedOption.store_id;
    }
    const [is_paid_exp_check,set_is_paid_exp_check]= useState(false);
    const toggle_payment = () => {
        set_is_paid_exp_check(!is_paid_exp_check);
        set_exp_new_check_data(prevState => ({
            ...prevState,
            is_paid_exp_check:is_paid_exp_check
        }));
    }
    const [exp_new_check_data,set_exp_new_check_data] =  useState({
        store_id:'',
        check_description:'',
        check_amount:'',
        check_date:'',
        is_paid_exp_check:'',
        is_for_sup:false,
    });
    const handle_exp_check_data = (e) => {
        let name= e.target.name;
        let value= e.target.value;
        exp_new_check_data[name] = value;
        set_exp_new_check_data(exp_new_check_data);

    }
    const [check_exp_date,set_check_exp_date] = useState(new Date());
    const submit_new_exp_check = () => {
        if(exp_new_check_data.store_id != '' && exp_new_check_data.check_amount != '' && exp_new_check_data.check_amount != ' ' && exp_new_check_data.check_description != ''){
            exp_new_check_data.is_paid_exp_check=is_paid_exp_check;
        
            var temp_check_date=moment(new Date(check_exp_date));
            temp_check_date=temp_check_date.format("YYYY-MM-DD")
            exp_new_check_data.check_date=temp_check_date;
    
            set_exp_new_check_data(exp_new_check_data);
    
            axios.post('http://localhost:4000/add_new_exp_check',exp_new_check_data).then(
                response => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        showConfirmButton: false,
                        timer: 1000
                    });
                    
                    close_exp_check();
                },error =>{
                    Swal.fire({
                        title: 'Error!',
                        text: 'Please Contact your software developer',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })
                }
            )
        }else{
            Swal.fire({
                title: 'Required fields',
                text: 'Please make sure to fill all fields',
                icon: 'info',
                confirmButtonText: 'OK'
            })
        }

    }
    return (
        <div className='col-md-8' >
            <div className='bank-check'>
                <div className='add-check bordered' onClick={open_exp_check}>
                <span className='add-check-label'>Add New CHECK</span>
                    <svg width="170" height="170">
                    <circle cx="120" cy="120" r="40" stroke="green" strokeWidth="4" fill="white" />
                    <text fill="#000000" fontSize="50"
                        x="104" y="135">+</text>
                    </svg>
                </div>
            </div>

            {/* ********************** START - MODALS ****************************************** */}
                <Modal className='exp-modal' show={is_open_exp_check} onHide={close_exp_check }>
                    <ModalHeader>
                        <ModalTitle>Create New Check</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                            <div className='check-form'>
                                <div className="form-group">
                                    <label className='input-label'>Store Name</label>
                                    <Select
                                        placeholder='Select Store'
                                        value={selected_store}
                                        onChange={handle_select_store}
                                        options={all_stores}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className='input-label'>Details</label>
                                    <textarea name='check_description' onChange={handle_exp_check_data} id="check-description" className="form-control" placeholder="Write Text Here..." />
                                </div>
                                <div className='form-group row'>
                                    <div className="col-md-6">
                                        <label className='input-label'>Check Amount</label>
                                        <input name='check_amount' onChange={handle_exp_check_data} type="text" className="form-control" placeholder="Check Amount" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className='input-label'>Check Date</label>
                                        <DatePicker dateFormat="dd/MM/yyyy" className='form-control' selected={check_exp_date} onChange={date => set_check_exp_date(date)}/>
                                    </div>
                                </div>
                                <div className="form-group check-status">
                                    <label className='input-label'>Paid</label>
                                    <input checked={is_paid_exp_check}  onChange={toggle_payment} type="checkbox" className="form-control"/>
                                </div>
                            </div>
                    </ModalBody>
                    <ModalFooter>
                        <button onClick={submit_new_exp_check} className="btn btn-success">Soumettre</button>
                        <button onClick={close_exp_check} className="btn btn-danger">Annuler</button>
                    </ModalFooter>
                </Modal>
                
                {/* START - Supplier Check MODAL */}
                <Modal>
                    <ModalHeader>
                        <ModalTitle>Create New Check</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                            <div className='check-form'>
                                <div className='form-group row' >
                                    <div className="col-md-6">
                                    <label className='input-label'>Store Name</label>
                                        <Select
                                            placeholder='Select Store'
                                        />
                                    </div>
                                    <div className="col-md-6">
                                    <label className='input-label'>Supplier Name</label>
                                        <Select
                                            placeholder='Select Supplier'
                                        />
                                    </div>
                                </div>
                                <div className='form-group row'>
                                    <div className="col-md-6">
                                        <label className='input-label'>Check Amount</label>
                                        <input type="text" name='checkAmount' className="form-control" placeholder="Check Amount" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className='input-label'>Check Date</label>
                                        <input type="date" name='checkDate' className="form-control" placeholder="Check Date" />
                                    </div>
                                </div>
                                <div className="form-group check-status">
                                    <label className='input-label'>Paid</label>
                                    <input checked={false} type="checkbox" className="form-control"/>
                                </div>
                            </div>
                    </ModalBody>
                    <ModalFooter>
                        <button type="submit" className="btn btn-success">Soumettre</button>
                        <button type="button" className="btn btn-danger">Annuler</button>
                    </ModalFooter>
                </Modal>
            {/* ********************** END - MODALS ******************************************** */}
        </div>
    )
}

export default Add_new_check;
