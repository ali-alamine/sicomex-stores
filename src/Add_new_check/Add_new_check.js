/* Old  */

import React, { useEffect,useState } from 'react';
import './Add_new_check.css';
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
// import Select from 'react-select';
import axios from 'axios';
import Swal from 'sweetalert2';
import DatePicker from "react-datepicker";
import moment from 'moment';
import MultiSelect from "react-multi-select-component";
import { Select } from 'antd';
function Add_new_check(props){

    /* Handle Open check Modal */
    var [is_open_new_check,set_is_open_new_check] = useState(false);
    const open_new_check = () => {set_is_open_new_check(true)};
    const close_check = () => {
        set_is_open_new_check(false);
        reset_check_form();
    };
    /* Handle Suppliers*/
    const [supplier_list,set_supplier_list] = useState([]);
    const handle_select_supplier = (supplier_id,supplier_amount) =>{
        new_check_data.supplier_id=supplier_id;
        new_check_data.supplier_amount=supplier_amount.key;
    }
    /* Handle Stores */
    const [all_stores,set_all_stores] = useState([]);
    const handle_select_store = (store_id) => {
        new_check_data.store_id=store_id;
    }
    /* Handle supplier and store data  */
    useEffect(()=>{
        set_all_stores(props.all_stores);
        if(props.check_type=='sup'){
            set_supplier_list(props.supplier_list);
        }else{
            set_supplier_list([{label:'',value:''}]);
        }
    },[is_open_new_check]);
    /* Handle check payment */
    const [is_paid_check,set_is_paid_check]= useState(false);
    const toggle_payment = () => {
        set_is_paid_check(!is_paid_check);
        set_new_check_data(prevState => ({
            ...prevState,
            is_paid_check:is_paid_check
        }));
    }
    /*Handle new check data */
    const [new_check_data,set_new_check_data] =  useState({
        store_id:'',
        supplier_id:'',
        supplier_amount:'',
        invoice_ids:[],
        check_description:'',
        check_amount:'',
        check_number:'',
        check_date:'',
        is_paid_check:'',
        is_for_sup:'',
    });
    const handle_new_check_data = (e) => {
        let name= e.target.name;
        let value= e.target.value;
        new_check_data[name] = value;
        set_new_check_data(new_check_data);

    }
    /* Rest check from */
    const reset_check_form = () => {
        set_is_paid_check(false);
        set_check_amount(0);
        set_new_check_data({
            store_id:'',
            check_description:'',
            check_amount:'',
            check_number:'',
            check_date:'',
            is_paid_check:'',
            is_for_sup:false,
        })
    }
    /* Handle check date */
    const [check_new_date,set_check_new_date] = useState(new Date());

    /* Multi Select - Invoice */
    const { Option } = Select;
    var [invoices,set_invoices] = useState([]);
    var [check_amount,set_check_amount] = useState(0);
    var [invoice_ids,set_invoice_ids] = useState([]);

    function handle_invoice_on_select (value,key){
        /* Sum check total amount */
        var amount= invoices.find(item => {
            return item.invoice_id == key.key;
         })
         check_amount+=amount.invoice_amount;
         set_check_amount(check_amount);

         /* Push invoice ids to temp array */
         invoice_ids.push(key.key);
         set_invoice_ids(invoice_ids);
    }

    function handle_invoice_on_deselect (value,key){
        /* Subtract removed invoice amount from total check amount */
        var amount= invoices.find(item => {
            return item.invoice_id == key.key;
         })
         check_amount-=amount.invoice_amount;
         set_check_amount(check_amount);

         /* Pop invoice ids to temp array */
         const index = invoice_ids.indexOf(key.key);
         invoice_ids.splice(index,1);
    }

    function search_invoice_by_number(value) {
        var data={'invoice_number':value};
        axios.post('http://localhost:4000/get_invoice_by_number',data).then(
            response => {

                if(response.data.length > 0){
                    set_invoices(response.data);
                }else{
                    set_invoices([]);
                }
            },error =>{
                Swal.fire({
                    title: 'Error!',
                    text: 'Please Contact your software developer',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        )
    }

    /* Submit new check */
    const submit_new_check = () => {
        new_check_data.invoice_ids=invoice_ids;
        var temp_check_date=moment(new Date(check_new_date));
        temp_check_date=temp_check_date.format("YYYY-MM-DD");
        new_check_data.is_paid_check=is_paid_check;
        new_check_data.check_date=temp_check_date;
        set_new_check_data(new_check_data);
        if(props.check_type=='sup'){
            new_check_data.is_for_sup=true;
            new_check_data.check_amount=check_amount;
        }else{
            new_check_data.is_for_sup=false;
        }
        set_new_check_data(new_check_data);
        if(new_check_data.store_id != '' && new_check_data.check_amount != '' && new_check_data.check_number != ' ' && new_check_data.check_date != ''){
            
            axios.post('http://localhost:4000/add_new_check',new_check_data).then(
                response => {
                    if(response.data=='DUPLICATE_CHECK_NUM'){
                        Swal.fire({
                            icon: 'info',
                            title: 'Check with same number already exist',
                            showConfirmButton: true
                        });
                    }else{
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            showConfirmButton: false,
                            timer: 1000
                        });
                        if(props.check_type=='sup'){
                            props.get_checks();
                        }
                        close_check();
                    }

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
            <div Style={props.check_type=='sup' ? 'display:block':'display:none'}>
                <input onClick={open_new_check} type='submit' value='New Check' className='btn btn-primary add-check-sup-btn' />
            </div>
            <div Style={props.check_type=='exp' ? 'display:block':'display:none'} className='bank-check'>
                <div className='add-check bordered' onClick={open_new_check}>
                <span className='add-check-label'>Add New CHECK</span>
                    <svg width="170" height="170">
                    <circle cx="120" cy="120" r="40" stroke="green" strokeWidth="4" fill="white" />
                    <text fill="#000000" fontSize="50"
                        x="104" y="135">+</text>
                    </svg>
                </div>
            </div>

            {/* ********************** START - MODALS ****************************************** */}
                <Modal className='new-check-modal' show={is_open_new_check} onHide={close_check }>
                    <ModalHeader>
                        <ModalTitle>Create New Check</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                            <div className='check-form'>
                                <div className="form-group">
                                    <label className='input-label'>Store Name</label>
                                      <Select
                                        showSearch
                                        style={{ width: '100%',borderRadius:20}}
                                        placeholder="Select Store"
                                        optionFilterProp="children"
                                        onChange={handle_select_store}
                                        filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        >
                                        {
                                            all_stores.map((el,index) => {
                                                return <Option key={index} value={el.store_id}>{el.label}</Option>
                                            })
                                        }
                                        </Select>
                                </div>
                                <div className="form-group">
                                    <label className='input-label'>Check Number</label>
                                    <input name='check_number' onChange={handle_new_check_data} type="number" className="form-control" placeholder="Check Number" />
                                </div>
                                <div Style={props.check_type == 'exp' ? 'display:block' : 'display:none'} className="form-group">
                                    <label className='input-label'>Details</label>
                                    <textarea name='check_description' onChange={handle_new_check_data} id="check-description" className="form-control" placeholder="Write Text Here..." />
                                </div>

                                <div Style={props.check_type == 'sup' ? 'display:block' : 'display:none'} className="form-group">
                                    <label className='input-label'>Supplier Name</label> 
                                      <Select
                                        showSearch
                                        style={{ width: '100%',borderRadius:20}}
                                        placeholder="Select supplier"
                                        optionFilterProp="children"
                                        onChange={handle_select_supplier}
                                        filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        >
                                            {
                                                supplier_list.map((el,index) => {
                                                   return <Option key={el.supplier_amount} value={el.supplier_id}>{el.supplier_name}</Option>
                                                })
                                            }
                                        </Select>
                                </div>
                                <div>
                                    <div Style={props.check_type == 'sup' ? 'display:block' : 'display:none'}>
                                        <label className='input-label'>Select Invoices</label>  
                                        <Select
                                            mode="multiple"
                                            style={{ width: '100%' }}
                                            placeholder="Select Invoices"
                                            // onChange={handle_select_invoices}
                                            optionLabelProp="label"
                                            onSearch={search_invoice_by_number}
                                            onSelect={handle_invoice_on_select}
                                            onDeselect={handle_invoice_on_deselect}
                                            loading='true'
                                        >
                                        {
                                            invoices.map((el,index) => {
                                                return <Option key={el.invoice_id} value={el.invoice_number} />
                                            })
                                        }
                                        </Select>                               
                                    </div>
                                </div>

                                <div className='form-group row'>
                                    <div className="col-md-6">
                                        <label className='input-label'>Check Amount</label>
                                        <input Style={props.check_type=='sup'? 'display:block':'display:none'} name='check_amount' value={check_amount} onChange={handle_new_check_data} type="text" className="form-control" placeholder="Check Amount" disabled/>
                                        <input Style={props.check_type=='exp'? 'display:block':'display:none'} name='check_amount' onChange={handle_new_check_data} type="text" className="form-control" placeholder="Check Amount"/>
                                    </div>
                                    <div className="col-md-6">
                                        <label className='input-label'>Check Date</label>
                                        <DatePicker dateFormat="dd/MM/yyyy" className='form-control' selected={check_new_date} onChange={date => set_check_new_date(date)}/>
                                    </div>
                                </div>
                                <div className="form-group check-status">
                                    <label className='input-label'>Paid</label>
                                    <input checked={is_paid_check}  onChange={toggle_payment} type="checkbox" className="form-control"/>
                                </div>
                            </div>
                    </ModalBody>
                    <ModalFooter>
                        <button onClick={submit_new_check} className="btn btn-success">Soumettre</button>
                        <button onClick={close_check} className="btn btn-danger">Annuler</button>
                    </ModalFooter>
                </Modal>
        </div>
    )
}

export default Add_new_check;
