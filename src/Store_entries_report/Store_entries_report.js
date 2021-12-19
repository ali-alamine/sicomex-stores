import React, { useEffect, useState } from 'react';
import './Store_entries_report.css';
import { Select } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';
import DatePicker from "react-datepicker";
import moment from 'moment';
import Global_services from '../Global_services/Global_services';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
function Store_entries_report() {

    useEffect(() => {
        get_all_stores();
    }, []);

    const { Option } = Select;
    const [show_main_loader, set_show_main_loader] = useState(false);
    const [res_store_entries_report_data, set_res_store_entries_report_data] = useState([]);
    const [store_drawer_amount, set_store_drawer_amount] = useState([]);
    const [all_stores, set_all_stores] = useState([]);

    const [date_from, set_date_from] = useState('');
    const [date_to, set_date_to] = useState('');
    const [store_expense_report_filter, set_store_expense_report_filter] = useState({
        'store_id': '',
        'date_from': '',
        'date_to': '',
    });


    const get_all_stores = () => {

        axios.get(Global_services.get_stores).then(
            response => {
                var temp_all_stores = [];
                for (var i = 0; i < response.data.length; i++) {
                    temp_all_stores.push({
                        'value': response.data[i].store_name,
                        'label': response.data[i].store_name,
                        'store_id': response.data[i].store_id,
                        'store_drawer_amount': response.data[i].drawer_amount,
                    })
                }
                set_all_stores(temp_all_stores);
            }, error => {
                console.log(error);
            }
        )
    };
    const handle_select_store = (store_id, store_amount) => {
        store_expense_report_filter.store_id = store_id;
        set_store_expense_report_filter(store_expense_report_filter);
        set_res_store_entries_report_data([]);
        set_store_drawer_amount(0);

    }

    const get_entry_reports = () => {
        set_show_main_loader(true);
        var temp_date_from = moment(new Date(date_from));
        temp_date_from = temp_date_from.format("YYYY-MM-DD");
        store_expense_report_filter.date_from = temp_date_from;
        /* ------------------------------------------------------------------ */
        var temp_date_to = moment(new Date(date_to));
        temp_date_to = temp_date_to.format("YYYY-MM-DD");
        store_expense_report_filter.date_to = temp_date_to;
        axios.post(Global_services.get_entry_reports, store_expense_report_filter).then(
            response => {
                set_show_main_loader(false);
                if (response.data.length > 0) {
                    let res = response.data;
                    res.map(el => {
                        let date = moment(new Date(el.entry_report_date));
                        el.entry_report_date = date.format("DD/MM/YYYY");
                    })
                    set_res_store_entries_report_data(res);
                    let total_store_exp_res = 0;//response.data[1];
                    // set_store_drawer_amount(total_store_exp_res[0].total_store_expense)
                    // console.log(response.data[1])
                } else {
                    set_res_store_entries_report_data([]);
                    set_store_drawer_amount(0);
                }
            }, error => {
                set_show_main_loader(false);
                Swal.fire({
                    title: 'Error!',
                    text: 'Veuillez contacter votre développeur de logiciel',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        )
    }

    return (
        <div className='store-bank-expenses'>
            <Row className='page-title'>
                <Col></Col>
                <Col className='col2'><h3>Rapport d'entrée</h3></Col>
                <Col></Col>
            </Row>
            <Row>
                <Col className='select-store-name'>
                    <Select
                        showSearch
                        style={{ width: '100%', borderRadius: 20 }}
                        placeholder="Sélectionnez un magasin"
                        optionFilterProp="children"
                        onChange={handle_select_store}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {
                            all_stores.map((el, index) => {
                                return <Option key={el.store_id} value={el.store_id}>{el.label}</Option>
                            })
                        }
                    </Select>
                </Col>
                {/* <Col><DatePicker placeholderText="partir de la date" dateFormat="dd/MM/yyyy" className='form-control date-filter' selected={date_from} onChange={date => set_date_from(date)} /></Col> */}
                {/* <Col><DatePicker placeholderText="à ce jour" dateFormat="dd/MM/yyyy" className='form-control date-filter' selected={date_to} onChange={date => set_date_to(date)} /></Col> */}
                <Col><input type='submit' value='Recherche' className='btn btn-success submit-search' onClick={get_entry_reports} /></Col>
            </Row>

            <hr />
            {
                show_main_loader != true ?
                    <Row>
                        <div className='total-store-expenses'>
                            {/* <label>{store_drawer_amount.toLocaleString()}</label> */}
                        </div>
                        <table className='table table-bordered table-striped table-hover text-center'>
                            <thead>
                                <tr>
                                    <th>Date d'entrée</th>
                                    <th>Montant du tiroir</th>
                                    <th>Ventes</th>
                                    <th>Forniussure Cash</th>
                                    <th>Dépenses espèces</th>
                                    <th>Dépôt bancaire</th>
                                    <th>Rester</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    res_store_entries_report_data.map((el, index) => {
                                        return <tr key={index}>
                                                <td>{el.entry_report_date}</td>
                                                <td>{(el.starting_amount).toLocaleString()}</td>
                                                <td>{(el.sales_amount).toLocaleString()}</td>
                                                <td>{(el.cash_supply_amount).toLocaleString()}</td>
                                                <td>{(el.cash_expense_amount).toLocaleString()}</td>
                                                <td>{(el.bank_deposit).toLocaleString()}</td>
                                                <td>{(el.remain_amount).toLocaleString()}</td>
                                            </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </Row>
                    : Global_services.show_spinner('border', 5, 'primary')
            }
        </div>
    )
}

export default Store_entries_report