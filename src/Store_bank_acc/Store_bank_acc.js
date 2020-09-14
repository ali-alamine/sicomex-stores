import React, { useEffect,useState } from 'react';
import './Store_bank_acc.css';
import Global_services from '../Global_services/Global_services';
import { Select } from 'antd';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import Swal from 'sweetalert2';
import DatePicker from "react-datepicker";
import moment from 'moment';

function Store_bank_acc (){
    useEffect(()=>{
        get_all_stores();
    },[]);
    const [date_from,set_date_from] = useState('');
    const [date_to,set_date_to] = useState('');
    const [show_main_loader,set_show_main_loader] = useState(false);

    const [store_bank_report_data,set_store_bank_report_data] = useState([]);

    const { Option } = Select;
    /* Handle Stores */
    const [all_stores,set_all_stores] = useState([]);
    const [sotre_bank_acc_data,set_sotre_bank_acc_data] = useState({
        'store_id':'',
        'date_from':'',
        'date_to':'',
    });
    const handle_select_store = (store_id,store_amount) => {
        sotre_bank_acc_data.store_id=store_id;
        console.log(store_amount.key)
        set_selected_store_amount(store_amount.key);
        set_sotre_bank_acc_data(sotre_bank_acc_data);
        set_store_bank_report_data([]);

    }
    const [selected_store_amount,set_selected_store_amount] = useState(0);
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
    const get_store_bank_acc = () =>{
        set_show_main_loader(true);
        var temp_date_from=moment(new Date(date_from));
        temp_date_from=temp_date_from.format("YYYY-MM-DD");
        sotre_bank_acc_data.date_from=temp_date_from;
        /* ------------------------------------------------------------------ */
        var temp_date_to=moment(new Date(date_to));
        temp_date_to=temp_date_to.format("YYYY-MM-DD");
        sotre_bank_acc_data.date_to=temp_date_to;

        axios.post(Global_services.get_bank_account,sotre_bank_acc_data).then(
            response => {
                set_show_main_loader(false);
                console.log('******************************response.data');
                console.log(response.data);
                if(response.data.length > 0){
                    let res=response.data;
                    res.map(el => {
                        let date = moment(new Date(el.date));
                        el.date = date.format("DD/MM/YYYY");
                    })
                    set_store_bank_report_data(res);
                }else{
                    set_store_bank_report_data([]);
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
        <div className='store-bank-acc-container'>
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
                <Col><input type='submit' value='Recherche' className='btn btn-success submit-search' onClick={get_store_bank_acc}/></Col>
            </Row>
            <hr />
            {
                show_main_loader != true ?
            <Row>
                <div className='total-store-bank-account'>
                    <label>{selected_store_amount.toLocaleString()}</label>
                </div>
                <table className='table table-bordered table-striped table-hover text-center'>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Sign</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            store_bank_report_data.map((el,index) => {
                                return <tr key={index}>
                                    {el.type=='check' ? <td>Cheque / {el.check_number}</td> :<td>Dépôt bancaire</td>}
                                    <td Style={el.type=='check' ? 'color:red;font-weight:bold':'color:blue;font-weight:bold'}>{el.sign}</td>
                                    <td Style={el.type=='check' ?'color:#973939;font-weight:bold':'color:blue;font-weight:bold'}>{el.amount}</td>
                                    <td>{el.date}</td>
                                </tr>
                            })
                        }
                    </tbody>
                  </table>
            </Row>
                :Global_services.show_spinner('border',5,'primary')
                }         

        </div>
    )
}
export default Store_bank_acc;