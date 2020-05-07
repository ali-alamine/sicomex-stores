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
    
    useEffect(()=>{
        get_all_stores();
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

    /* Get Checks */
    const [check_list, set_check_list] = useState([]);
    const get_checks = () => {
        // axios.get('http://localhost:4000/check').then(
        //     response => {
        //         var temp_all_stores=[];
        //         for(var i =0;i<response.data.length;i++){
        //             temp_all_stores.push({
        //                 'value':response.data[i].store_name,
        //                 'label':response.data[i].store_name,
        //                 'store_id':response.data[i].store_id
        //             })
        //         }
        //         set_check_list(temp_all_stores);
        //     },error =>{
        //         console.log(error);
        //     }
        // )
    }
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
        return record.bank_check_id === selected_row.rowId && record.check_order=='0'? 'selected-row' : record.supplier_id === selected_row.rowId && record.check_order=='1' ? 'selected-important-row' :record.check_order=='1' ? 'important-row':'';
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
                    // pin_invoice,
                    // un_pin_invoice,
                    // delete_invoice,
                    // open_edit_inv_modal,
                    // open_invoice_details,
                    visible: true,
                    x: event.clientX,
                    y: event.clientY
                }
            });
        }
    });
    
    return (
        <div className='check-view'>
            <div>
                <Common_filter />
            </div>
            <div>
                <div>
                    <Add_new_check all_stores={all_stores} check_type='sup'/>
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
           
        </div>
    )
}

export default Check;