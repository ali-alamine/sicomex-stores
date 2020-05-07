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
import MultiSelect from "react-multi-select-component";
// import Multiselect from 'react-widgets/lib/Multiselect';
// import { Multiselect } from 'react-widgets'
function Add_new_check(props){

    var [is_open_new_check,set_is_open_new_check] = useState(false);
    const open_new_check = () => {set_is_open_new_check(true)};
    const close_check = () => {
        set_is_open_new_check(false);
        reset_check_form();
    };

    /* Get all Suppliers*/
    const [supplier_list,set_supplier_list] = useState(null);
    const get_suppliers= () => {
        axios.get('http://localhost:4000/supplier').then(
            response => {
                var temp_all_stores=[];
                for(var i =0;i<response.data.length;i++){
                    temp_all_stores.push({
                        'value':response.data[i].supplier_name,
                        'label':response.data[i].supplier_name,
                        'supplier_id':response.data[i].supplier_id
                    })
                }
                set_supplier_list(temp_all_stores);
            },error =>{
                console.log(error);
            }
        )
    };

    /* Supplier SELECT */
    const [selected_supplier_check,set_selected_supplier_check] = useState('');
    const handle_select_supplier = (_selectedOption) =>{
        set_selected_supplier_check(_selectedOption);
    }
    const [all_stores,set_all_stores] = useState([]);
    useEffect(()=>{
        set_all_stores(props.all_stores);
    },[is_open_new_check]);

    const [selected_store,set_selected_store]= useState({});
    const handle_select_store = (_selectedOption) => {
        set_selected_store(_selectedOption)
        new_check_data.store_id=_selectedOption.store_id;
    }

    const [is_paid_check,set_is_paid_check]= useState(false);
    const toggle_payment = () => {
        set_is_paid_check(!is_paid_check);
        set_new_check_data(prevState => ({
            ...prevState,
            is_paid_check:is_paid_check
        }));
    }

    const [new_check_data,set_new_check_data] =  useState({
        store_id:'',
        supplier_id:'',
        check_description:'',
        check_amount:'',
        check_number:'',
        check_date:'',
        is_paid_check:'',
        is_for_sup:false,
    });
    const handle_new_check_data = (e) => {
        let name= e.target.name;
        let value= e.target.value;
        new_check_data[name] = value;
        set_new_check_data(new_check_data);

    }

    const reset_check_form = () => {
        set_is_paid_check(false);
        set_selected_store({})
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

    const [check_new_date,set_check_new_date] = useState(new Date());

    const submit_new_check = () => {
        if(new_check_data.store_id != '' && new_check_data.check_amount != '' && new_check_data.check_amount != ' ' && new_check_data.check_description != '' && new_check_data.check_number != ''){
            new_check_data.is_paid_check=is_paid_check;
        
            var temp_check_date=moment(new Date(check_new_date));
            temp_check_date=temp_check_date.format("YYYY-MM-DD")
            new_check_data.check_date=temp_check_date;
    
            set_new_check_data(new_check_data);
    
            axios.post('http://localhost:4000/add_new_exp_check',new_check_data).then(
                response => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        showConfirmButton: false,
                        timer: 1000
                    });
 
                    close_check();
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

    /* Get Invoices */
    function search_invoices_by_number() {
        console.log('Here we go');
    }

    // const options = [
    //     { label: "Grapes 🍇", value: "grapes" },
    //     { label: "Mango 🥭", value: "mango" },
    //     { label: "Strawberry 🍓", value: "strawberry" },
    // ];

    const [invoices,set_invoices] = useState([]);
    function test(options, filter) {
        if (!filter) {
            return options;
        }else{

            var data={'invoice_number':'22'}
            axios.post('http://localhost:4000/get_invoice_by_number',data).then(
                response => {
                    var temp_invoices=[];
                    for(var i =0;i<response.data.length;i++){
                        temp_invoices.push({
                            label:response.data[i].invoice_number,
                            value:response.data[i].invoice_number
                        })
                    }
                    // JSON.stringify(temp_invoices)
                    set_invoices(temp_invoices);
                    console.log('FIRED')
                    
                },error =>{
                    Swal.fire({
                        title: 'Error!',
                        text: 'Please Contact your software developer',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })
                }
            )
            return options;
        }
    }

    const [selected, setSelected] = useState([]);
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
                                        placeholder='Select Store'
                                        value={selected_store}
                                        onChange={handle_select_store}
                                        options={all_stores}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className='input-label'>Check Number</label>
                                    <input name='check_number' onChange={handle_new_check_data} type="number" className="form-control" placeholder="Check Number" />
                                </div>
                                <div Style={props.check_type == 'exp' ? 'display:block' : 'display:none'} className="form-group">
                                    <label className='input-label'>Details</label>
                                    <textarea name='check_description' onChange={handle_new_check_data} id="check-description" className="form-control" placeholder="Write Text Here..." />
                                </div>

                                <div Style={props.check_type == 'exp' ? 'display:none' : 'display:block'} className="form-group">
                                    <label className='input-label'>Supplier Name</label>  
                                    <Select
                                        placeholder='Select Supplier'
                                        value={selected_supplier_check}
                                        options={supplier_list}
                                        name='store_data'
                                    />
                                </div>
                                <div>
                                <div>
                                    <pre>{JSON.stringify(selected)}</pre>
                                    <MultiSelect
                                        options={invoices}
                                        value={selected}
                                        labelledBy={"Select"}
                                        onChange={setSelected}
                                        filterOptions={test}
                                    />
                                </div>
                                </div>

                                <div className='form-group row'>
                                    <div className="col-md-6">
                                        <label className='input-label'>Check Amount</label>
                                        <input name='check_amount' onChange={handle_new_check_data} type="text" className="form-control" placeholder="Check Amount" />
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
