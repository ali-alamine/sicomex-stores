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

function Check (){
    const [all_stores,set_all_stores]= useState([]);
    
    const [supplier_list,set_supplier_list] = useState([]);
    useEffect(()=>{
        get_all_stores();
        get_suppliers();
        get_checks();
    },[]);
    const get_all_stores= () => {
        axios.get('http://localhost:4000/store').then(
            response => {
                var temp_all_stores=[];
                for(var i =0;i<response.data.length;i++){
                    temp_all_stores.push({
                        'value':response.data[i].store_name,
                        'label':response.data[i].store_name,
                        'store_id':response.data[i].store_id
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
        axios.get('http://localhost:4000/supplier').then(
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
        axios.get('http://localhost:4000/get_checks').then(
            response => {
                console.log(response.data)
                let checks=response.data
                checks.map(el => {
                    let date = moment(new Date(el.check_date));
                    el.check_date = date.format("DD/MM/YYYY");
                    el.is_for_sup == 1 ? el.is_for_sup='Supplier':el.is_for_sup==0? el.is_for_sup='Expense':el.is_for_sup='Not specified'
                })
                set_check_list(response.data);
            },error =>{
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
        return record.bank_check_id === selected_row.rowId && record.check_order==1 && record.is_paid==1 ? 'selected-important-row':record.bank_check_id === selected_row.rowId && record.is_paid == 1 && record.check_order == 0? 'is_paid-selected' : record.bank_check_id === selected_row.rowId && record.check_order=='0'? 'selected-row' :record.check_order=='1' ? 'important-row': record.is_paid == 1? 'is_paid':'';
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
                    // delete_invoice,
                    // open_edit_inv_modal,
                    // open_invoice_details,
                    open_check_description,   
                    visible: true,
                    x: event.clientX,
                    y: event.clientY
                }
            });

        }
    });

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
    const pin_check = (pin_check) => {
        axios.post('http://localhost:4000/pin_check',pin_check).then(
            response => {
                createNotification('success','Pinned');
                get_checks();
                set_popup_menu({ popup: { visible: false } });
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
    const un_pin_check = (un_pin_check) =>{
        axios.post('http://localhost:4000/un_pin_check',un_pin_check).then(
            response => {
                createNotification('success','Unpinned');
                get_checks();
                set_popup_menu({ popup: { visible: false } });
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
    
    return (
        <div className='check-view'>
            <div>
                <Common_filter />
            </div>
            <div>
                <div>
                    <Add_new_check get_checks={get_checks} all_stores={all_stores} supplier_list={supplier_list} check_type='sup'/>
                </div>
            </div>
            <div>
                <Table bordered
                    columns={columns}
                    dataSource={check_list}
                    onRow={onRow}
                    rowClassName={setRowClassName} />
                <Popup {...popup_menu.popup} />
            </div>
            <NotificationContainer/>
        </div>
    )
}

export default Check;