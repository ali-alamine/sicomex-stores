import React, { useEffect,useState } from 'react';
import './Store_expenses.css';
import { Select } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';
import DatePicker from "react-datepicker";
import moment from 'moment';
import Global_services from '../Global_services/Global_services';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
function Report_entries(){

    useEffect(()=>{
        get_all_stores();
    },[]);

    const { Option } = Select;
    const [show_main_loader,set_show_main_loader] = useState(false);
    const [res_store_expense_report_data,set_res_store_expense_report_data] = useState([]);
    const [display_total_store_expenses,set_display_total_store_expenses] = useState(0);
    const [all_stores,set_all_stores] = useState([]);

    const [date_from,set_date_from] = useState('');
    const [date_to,set_date_to] = useState('');
    const [store_expense_report_filter,set_store_expense_report_filter] = useState({
        'store_id':'',
        'date_from':'',
        'date_to':'',
    });


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
    const handle_select_store = (store_id,store_amount) => {
        store_expense_report_filter.store_id=store_id;
        set_store_expense_report_filter(store_expense_report_filter);
        set_res_store_expense_report_data([]);

    }
    const get_store_expense_details = () =>{
        set_show_main_loader(true);
        var temp_date_from=moment(new Date(date_from));
        temp_date_from=temp_date_from.format("YYYY-MM-DD");
        store_expense_report_filter.date_from=temp_date_from;
        /* ------------------------------------------------------------------ */
        var temp_date_to=moment(new Date(date_to));
        temp_date_to=temp_date_to.format("YYYY-MM-DD");
        store_expense_report_filter.date_to=temp_date_to;
        axios.post(Global_services.get_store_expenses,store_expense_report_filter).then(
            response => {
                set_show_main_loader(false);
                if(response.data.length > 0){
                    let res=response.data;
                    res.map(el => {
                        let date = moment(new Date(el.date));
                        el.date = date.format("DD/MM/YYYY");
                    })
                    set_res_store_expense_report_data(res);
                    console.log(res)
                }else{
                    res_store_expense_report_data([]);
                }
            },error =>{
                set_show_main_loader(false);
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
        <div className='store-bank-expenses'>
            <Row>
                <Col className='select-store-name'>
                    <Select
                        showSearch
                        style={{ width: '100%',borderRadius:20}}
                        placeholder="Sélectionnez un magasin"
                        optionFilterProp="children"
                        onChange={handle_select_store}
                        filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        >
                        {
                            all_stores.map((el,index) => {
                                return <Option key={el.store_amount} value={el.store_id}>{el.label}</Option>
                            })
                        }
                    </Select>
                </Col>
                <Col><DatePicker placeholderText="partir de la date" dateFormat="dd/MM/yyyy" className='form-control date-filter' selected={date_from} onChange={date => set_date_from(date)}/></Col>
                <Col><DatePicker placeholderText="à ce jour"  dateFormat="dd/MM/yyyy" className='form-control date-filter' selected={date_to} onChange={date => set_date_to(date)}/></Col>
                <Col><input type='submit' value='Recherche' className='btn btn-success submit-search' onClick={get_store_expense_details}/></Col>
            </Row>
            <hr />
            {
                show_main_loader != true ?
            <Row>
                <div className='total-store-expenses'>
                    <label>{display_total_store_expenses.toLocaleString()}</label>
                </div>
                <table className='table table-bordered table-striped table-hover text-center'>
                    <thead>
                        <tr>
                            <th>Store Name</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {
                            store_bank_report_data.map((el,index) => {
                                return <tr key={index}>
                                    {el.type=='check' ? <td>Cheque / {el.check_number}</td> :<td>Dépôt bancaire</td>}
                                    <td Style={el.type=='check' ? 'color:red;font-weight:bold':'color:blue;font-weight:bold'}>{el.sign}</td>
                                    <td Style={el.type=='check' ?'color:#973939;font-weight:bold':'color:blue;font-weight:bold'}>{el.amount}</td>
                                    <td>{el.date}</td>
                                </tr>
                            })
                        } */}
                    </tbody>
                  </table>
            </Row>
            :Global_services.show_spinner('border',5,'primary')
            }  
        </div>
    )
}

export default Report_entries