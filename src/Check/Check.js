import React, { useEffect,useState } from 'react';
import './Check.css';
import Modal from "react-bootstrap/Modal";
import Common_filter from'../Common_filter/Common_filter';
import { columns, data } from "./Check_columns";
import Popup from "../Context_menu/Check_popup";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import Add_new_check from '../Add_new_check/Add_new_check';
import Select from 'react-select';
import axios from 'axios';
import Swal from 'sweetalert2';
import $ from 'jquery';
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "antd/dist/antd.css";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { Table } from "antd";
import 'react-notifications/lib/notifications.css';
import Global_services from '../Global_services/Global_services';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
function Check (){
    const [table_action_loader,set_table_action_loader] = useState(false);
    const [all_stores,set_all_stores]= useState([]);
    const [supplier_list,set_supplier_list] = useState([]);
    const [is_open_edit_check_modal,set_is_open_edit_check_modal] = useState(false);
    const [button_action_loader,set_button_action_loader] = useState(false);
    const close_edit_check_modal = () => {
        set_is_open_edit_check_modal(false);
        set_edit_check_date(new Date())
    }

    useEffect(()=>{
        get_all_stores();
        get_suppliers();
        get_checks();
    },[]);
    const [show_main_loader,set_show_main_loader] = useState(false);
    /* Assign response to invoice list */
    const assign_response_to_list = (response) => {
        if(response.data=='EMPTY_RESULT'){
            set_check_list([])
        }else{

            let checks=response.data;
            checks.map(el => {
                let date = moment(new Date(el.check_date));
                el.check_date = date.format("DD/MM/YYYY");
                el.is_for_sup == 1 ? el.is_for_sup='Supplier':el.is_for_sup==0? el.is_for_sup='Expense':el.is_for_sup='Not specified'
            })
            set_check_list(response.data);
        }
    }
    const get_all_stores= () => {
        axios.get(Global_services.get_stores).then(
            response => {
                var temp_all_stores=[];
                for(var i =0;i<response.data.length;i++){
                    temp_all_stores.push({
                        'value':response.data[i].store_name,
                        'label':response.data[i].store_name,
                        'store_id':response.data[i].store_id,
                        'store_amount':response.data[i].amount,
                    })
                }
                set_all_stores(temp_all_stores);
            },error =>{
                console.log(error);
            }
        )
    };
    /* Get suppliers */
    const get_suppliers= () => {
        axios.get(Global_services.get_suppliers).then(
            response => {
                set_supplier_list(response.data);
            },error =>{
                console.log(error);
            }
        )
    };
    /* Get Checks */
    const [check_list, set_check_list] = useState([]);
    const get_checks = () => {
        set_show_main_loader(true);
        axios.get(Global_services.get_checks).then(
            response => {
                assign_response_to_list(response);
                set_show_main_loader(false);
            },error =>{
                set_show_main_loader(false);
                Swal.fire({
                    title: 'Error!',
                    text: 'Please Contact your software developer',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
                console.log(error);
            }
        )
    }
    /* Slide Notification */
    function createNotification(type,message){
        switch (type) {
            case 'info':
            NotificationManager.info('Info', message,1500);
            break;
            case 'success':
            NotificationManager.success('Success', message, 1500);
            break;
            case 'warning':
            NotificationManager.warning('Warning', message, 1500);
            break;
            case 'error':
            NotificationManager.error('Error', message, 1500, () => {
                alert('Please Contact your software developer!');
            });
            break;
        }
        
    };
    const [selected_row,set_selected_row] = useState({
        rowId:''
    });
    /* Popup Menu functionalities */
    const [popup_menu, set_popup_menu] = useState({
        popup: {
            visible: false,
            x: 0,
            y: 0
        }
    });
    var setRowClassName = (record) => {
        return record.bank_check_id === selected_row.rowId && record.check_order == 1 && record.is_paid == 1 ? 'selected-important-row':record.bank_check_id === selected_row.rowId && record.is_paid == 1 && record.check_order == 0 ? 'is_paid-selected' : record.bank_check_id === selected_row.rowId && record.check_order=='0'? 'selected-row' :record.check_order=='1' ? 'important-row': record.is_paid == 1? 'is_paid':'';
    };
    const onRow = record => ({
        onClick: () => {
            set_popup_menu({ popup: { visible: false } });
            set_selected_row({rowId:record.bank_check_id});
        },
        onContextMenu: event => {
            event.preventDefault();
            set_selected_row({rowId:record.bank_check_id});

            set_popup_menu({
                popup: {
                    record,
                    pin_check,
                    un_pin_check,
                    delete_check,
                    open_edit_check_modal,
                    set_check_paid,
                    set_check_unpaid,
                    open_check_description,
                    visible: true,
                    x: event.clientX,
                    y: event.clientY
                }
            });

        }
    });
    const set_check_paid = (record) => {
        set_table_action_loader(true);
        axios.post(Global_services.set_check_paid,record).then(
            response => {
                set_table_action_loader(false);
                createNotification('success','le statut du chèque est passé à payér');
                get_checks();
                set_popup_menu({ popup: { visible: false } });
            },error =>{
                set_table_action_loader(false);
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
    const set_check_unpaid = (record) => {
        set_table_action_loader(true);
        axios.post(Global_services.set_check_unpaid,record).then(
            response => {
                set_table_action_loader(false);
                createNotification('success','le statut du chèque est passé à payér');
                get_checks();
                set_popup_menu({ popup: { visible: false } });
            },error =>{
                set_table_action_loader(false);
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
    const open_check_description = (record) => {
        Swal.fire({
          title: record.check_description,
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        })
    }
    const [edit_check_data,set_edit_check_data]= useState({
        check_id:'',
        check_number:'',
        check_amount:'',
        check_date:'',
        check_description:'',
        supplier_name:'',
        store_name:'',
    });
    var [edit_check_date,set_edit_check_date] = useState(moment(new Date(), 'DD-MM-YYYY'));
    const open_edit_check_modal = (record) => {
        set_popup_menu({ popup: { visible: false } });
        record.is_for_sup == 'Expense' ? edit_check_data.check_type='exp' : edit_check_data.check_type='sup';
        // edit_check_data.check_date=record.check_date;
        edit_check_data.check_id=record.bank_check_id;
        edit_check_data.check_description=record.check_description;
        edit_check_data.check_amount=record.check_amount;
        edit_check_data.supplier_name=record.supplier_name;
        edit_check_data.store_name=record.store_name;
        edit_check_data.store_amount=record.amount;
        edit_check_data.check_number=record.check_number;
        
        let date = record.check_date;
        let new_edit_date_format = new Date(date.split("/").reverse().join("-"));
        set_edit_check_date(new_edit_date_format);

        set_edit_check_data(edit_check_data);
        set_is_open_edit_check_modal(true);
    }
    const handle_edit_check_data = (e) => {
        set_edit_check_data({ ...edit_check_data, [e.target.name]: e.target.value });
    }
    const update_check_data = () => {
        set_button_action_loader(true);
        var temp_check_date=moment(new Date(edit_check_date));
        temp_check_date=temp_check_date.format("YYYY-MM-DD");
        edit_check_data.check_date=temp_check_date;
        set_edit_check_data(edit_check_data);
        axios.post(Global_services.update_check,edit_check_data).then(
            response => {
                set_button_action_loader(false);
                createNotification('success','Updated');
                get_checks();
                close_edit_check_modal();
            },error =>{
                set_button_action_loader(false);
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
    const pin_check = (pin_check) => {
        set_table_action_loader(true);
        axios.post(Global_services.pin_check,pin_check).then(
            response => {
                set_table_action_loader(false);
                createNotification('success','Pinned');
                get_checks();
                set_popup_menu({ popup: { visible: false } });
            },error =>{
                set_table_action_loader(false);
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
    const un_pin_check = (un_pin_check) =>{
        set_table_action_loader(true);
        axios.post(Global_services.un_pin_check,un_pin_check).then(
            response => {
                createNotification('success','Unpinned');
                get_checks();
                set_popup_menu({ popup: { visible: false } });
                set_table_action_loader(false);
            },error =>{
                set_table_action_loader(false);
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
    const delete_check = (check_data) =>{
        Swal.fire({
            title: 'Supprimer le chèque',
            text: "Voulez-vous vraiment supprimer le chèque?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                set_table_action_loader(true);
                axios.post(Global_services.delete_check,check_data).then(
                    response => {
                        set_table_action_loader(false);
                        if(response.data !=='CANT_DELETE_PAID_CHECK'){
                            createNotification('success','Effacé');
                            get_checks();
                            set_popup_menu({ popup: { visible: false } });
                        }else{
                            Swal.fire({
                                title: 'Info!',
                                text: 'Impossible de supprimer un chèque payé',
                                icon: 'error',
                                confirmButtonText: 'OK'
                            })
                        }
                    },error =>{
                        set_table_action_loader(false);
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
        })
    }
    const [search_check_number,set_search_check_number] = useState({
        check_number:''
    });
    const handle_search_check= (e) => {
        let value= e.target.value;
        let name= e.target.name;
        search_check_number[name]=value;
        set_search_check_number(search_check_number);
    }
    const submit_search_check = () =>{
        set_show_main_loader(true);
        axios.post(Global_services.search_check_number,search_check_number).then(
            response => {
                // if(response.data.length > 0){
                    assign_response_to_list(response);
                // }else{
                    set_show_main_loader(false);
                // }
            },error =>{
                set_show_main_loader(false);
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
    return (
        <div className='check-view'>
            {
                table_action_loader?
                <div class='table-col-loader'>
                    {Global_services.show_spinner('border',8,'primary')}
                </div>
                :''
            }
            <div>
                <Common_filter view='bank_check' show_loader={set_show_main_loader} response_data={assign_response_to_list} all_stores={all_stores} supplier_list={supplier_list}/>
            </div>
            <Row>
                <Col>
                    <Add_new_check get_checks={get_checks} all_stores={all_stores} supplier_list={supplier_list} check_type='sup'/>
                </Col>
                <Col className='search-invoice'>
                    <Row>
                        <Col>
                            <input type='text' onChange={handle_search_check} name='check_number' className='form-control' placeholder='Numéro du chèque'/>
                        </Col>
                        <Col>
                            <input type='submit' value='Chercher' onClick={submit_search_check} className='form-control btn btn-primary' />
                        </Col>
                    </Row>
                </Col>
            </Row>
            {
               show_main_loader != true ?
                <div>
                    <Table bordered
                        columns={columns}
                        dataSource={check_list}
                        onRow={onRow}
                        rowClassName={setRowClassName} />
                    <Popup {...popup_menu.popup} />
                </div>
                :
                Global_services.show_spinner('border',5,'primary')
            }

                            
            {/* START - Edit Check MODAL */}
            <Modal show={is_open_edit_check_modal} onHide={close_edit_check_modal }>
                <ModalHeader>
                    <ModalTitle>Edit Check</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <div className='check-form'>
                        <div className='form-group row' >
                            <div className="col-md-12">
                                <label className='input-label'>Store Name</label>
                                <input type="text" onChange={handle_edit_check_data} className="form-control" value={edit_check_data.store_name} disabled/>
                            </div>
                            <div Style={edit_check_data.check_type == 'sup' ? 'display:block' : 'display:none'} className="col-md-12">
                                <label className='input-label'>Supplier Name</label>
                                <input type="text" onChange={handle_edit_check_data} className="form-control" value={edit_check_data.supplier_name} disabled/>
                            </div>
                            <div Style={edit_check_data.check_type == 'exp' ? 'display:block' : 'display:none'} className="col-md-12">
                                <label className='input-label'>Details</label>
                                <textarea onChange={handle_edit_check_data} name='check_description' value={edit_check_data.check_description} id="check-description" className="form-control" placeholder="Write Text Here..." />
                            </div>
                            <div className="col-md-12">
                                <label className='input-label'>Check Amount</label>
                                <input onChange={handle_edit_check_data} type="text" name='check_amount' value={edit_check_data.check_amount} className="form-control" placeholder="Check Amount" />
                            </div>
                            <div className="col-md-12">
                                <label className='input-label'>Check Number</label>
                                <input onChange={handle_edit_check_data} type="text" name='check_number' value={edit_check_data.check_number} className="form-control" placeholder="Check Number" />
                            </div>
                            <div className="col-md-6">
                                <label className='input-label'>Check Date</label>
                                {/* <input onChange={handle_edit_check_data} type="text" name='check_date' value={edit_check_data.check_date} className="form-control" placeholder="Check date" /> */}
                                <DatePicker dateFormat="dd/MM/yyyy" className='form-control' selected={edit_check_date} onChange={date => set_edit_check_date(date)}/>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                {
                        button_action_loader? 
                        Global_services.show_spinner('grow',3,'success')
                        : 
                        <button type="submit" onClick={update_check_data} className="btn btn-success">Soumettre</button>
                    }
                    
                    <button type="button" className="btn btn-danger">Annuler</button>
                </ModalFooter>
            </Modal>
            {/* ********************** END - MODALS ******************************************** */}
            <NotificationContainer/>
        </div>
    )
}

export default Check;