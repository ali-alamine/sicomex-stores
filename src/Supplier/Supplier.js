import React, { useEffect,useState } from 'react';
import './Supplier.css';
import Modal from "react-bootstrap/Modal";
import Common_filter from'../Common_filter/Common_filter';
import Dynamic_table from'../Dynamic_table/Dynamic_table';
import Context_menu from'../Context_menu/Context_menu';

import supplier_schema from'../Dynamic_table/supplier_schema.json';
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import Select from 'react-select';
import axios from 'axios';
import Swal from 'sweetalert2';
import $ from 'jquery';
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
function Supplier(){

    useEffect(()=>{
        setTimeout(() => {
            get_suppliers();
        }, 500)
        
    },[]);

    const [is_open_sup_modal,set_is_open_sup_modal] = useState(false);
    const open_sup_modal = () => {set_is_open_sup_modal(true);}
    const close_sup_modal = () => {set_is_open_sup_modal(false);}
    const [new_sup_data,set_new_sup_data] = useState({
        supplier_name:'',
        supplier_amount:''
    })
    const handle_new_sup_data = (e) => {
        set_new_sup_data({ ...new_sup_data, [e.target.name]: e.target.value });
    }
    const [supplier_list,set_supplier_list] = useState(null);
    const get_suppliers= () => {
        axios.get('http://localhost:4000/supplier').then(
            response => {
                set_supplier_list(response.data);
            },error =>{
                console.log(error);
            }
        )
    };
    const add_new_supplier = () => {
        axios.post('http://localhost:4000/supplier',new_sup_data).then(
            response => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    showConfirmButton: false,
                    timer: 1000
                });
            },error =>{
                console.log(error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Please Contact your software developer',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        )
    }

    const reset_sup_state = () => {
        set_new_sup_data({
            supplier_name:'',
            supplier_amount:''
        })
        
        console.log(new_sup_data)
    }
    return(
        <div>
            <div>
                <Common_filter />
            </div>
            <div>
                <input type='submit' onClick={open_sup_modal} value='Add Supplier' className='btn btn-primary add-supp-btn' />
            </div>
            <div className="container p-2">
                <div className="row">
                    <div className="col">
                    <Dynamic_table headers={Object.keys(supplier_schema)} rows={supplier_list} table_for={'sup'}/>
                    </div>
                </div>
            </div>

            {/* *****************  START - MODALS *********************************  */}
            <Modal show={is_open_sup_modal} onHide={close_sup_modal}>
                <ModalHeader>
                    <ModalTitle>Add New Supplier</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <div className='store-form'>
                        <div className="form-group">
                            <label className='input-label'>Supplier Name</label>
                            <input onChange={handle_new_sup_data} value={new_sup_data.supplier_name} name='supplier_name' type="text" className="form-control" placeholder="Name"/>
                        </div>
                        <div className="form-group">
                            <label className='input-label'>Initial Amount</label>
                            <input onChange={handle_new_sup_data} value={new_sup_data.supplier_amount} name='supplier_amount' type="text" className="form-control" placeholder="Amount"/>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button onClick={add_new_supplier} className="btn btn-success">Soumettre</button>
                    <button onClick={close_sup_modal} className="btn btn-danger">Annuler</button>
                </ModalFooter>
            </Modal>
            {/* *****************  END - MODALS *********************************  */}
        </div>
    )
}

export default Supplier;