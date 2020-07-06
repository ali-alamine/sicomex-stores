import React, { useEffect,useState } from 'react';
import './Common_filter.css';
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import { Select } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';
import $ from 'jquery';
import moment from 'moment';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Collapse } from 'antd';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import Global_services from '../Global_services/Global_services';
function Common_filter (props){

    const { Panel } = Collapse;
    const { Option } = Select;
    const [date_from,set_date_from] = useState('');
    const [date_to,set_date_to] = useState('');
    const [search_data,set_search_data] = React.useState({
        supplier_id:'',
        store_id:'',
        amount_from:'',
        amount_to:'',
        date_from:date_from,
        date_to:date_to,
        is_paid:'',
        order_by_date:'',
        order_by_amount:'',
        invoice_number:'',
        check_number:'',
        supplier_ids:''
    });
    const handle_select_store = (store_id,store_amount) => {
        search_data.store_id=store_id;
    };
    const handle_select_supplier = (supplier_id,supplier_amount) =>{
        search_data.supplier_id=supplier_id;
    };
    var [is_paid,set_is_paid]= useState('Any');
    const handle_select_payment_type = (value) =>{
        set_is_paid(value);
    };
    const common_fields = () => {
        return (
            <div className='date-range-filter'>
                <Row>
                    <Col><DatePicker placeholderText="partir de la date" dateFormat="dd/MM/yyyy" className='form-control date-filter' selected={date_from} onChange={date => set_date_from(date)}/></Col>
                    <Col><DatePicker placeholderText="à ce jour"  dateFormat="dd/MM/yyyy" className='form-control date-filter' selected={date_to} onChange={date => set_date_to(date)}/></Col>
                    <Col>
                        <Select
                            showSearch
                            style={{ width: '100%',borderRadius:20}}
                            placeholder="Statut de paiement"
                            className='payment-filter'
                            optionFilterProp="children"
                            onChange={handle_select_payment_type}
                            filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }>

                            <Option value='any'>Toute</Option>
                            <Option value='paid'>Payé</Option>
                            <Option value='unpaid'>Non payé</Option>

                        </Select>
                    </Col>
                    <Col><span className='filer-order'>Ordonner par montant</span><input type="checkbox" onChange={toggle_order_by_amount} checked={order_by_amount} className='form-control' /></Col>
                    <Col><span className='filer-order'>Trier par date</span><input type="checkbox" onChange={toggle_order_date} checked={order_by_date} className='form-control' /></Col>
                </Row>
                <hr />
                <Row>
             
                    <Col></Col>
                    <Col></Col>
                    <Col>
                        <input type='submit' value='Recherche Avancée' onClick={submit_filter} className='form-control btn btn-default submit-filter-btn'/>
                    </Col>
                    <Col></Col>
                    <Col></Col>
                </Row>
            </div>
        )
    };
    const supplier_store_selection = () => {
        return(
            <Row>
                <Col>
                    <Select
                        showSearch
                        style={{ width: '100%',borderRadius:20}}
                        placeholder="Sélectionner un Magasin"
                        optionFilterProp="children"
                        onChange={handle_select_store}
                        filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        {
                            props.all_stores.map((el,index) => {
                                return <Option key={el.index} value={el.store_id}>{el.label}</Option>
                            })
                        }
                    </Select>
                </Col>
                <Col>
                    <Select
                        showSearch
                        style={{ width: '100%',borderRadius:20}}
                        placeholder="Sélectionnez un fournisseur"
                        optionFilterProp="children"
                        onChange={handle_select_supplier}
                        filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                        {
                            props.supplier_list.map((el,index) => {
                                return <Option key={el.index} value={el.supplier_id}>{el.supplier_name}</Option>
                            })
                        }
                    </Select>
                </Col>
            </Row>
        )
    }
    const handle_data_filter = (e) =>{
        let name= e.target.name;
        let value= e.target.value;
        search_data[name]=value;
        set_search_data(search_data);
    };
    var [suppliers_ids,set_suppliers_ids] = useState([]);
    function handle_supplier_on_select (value,key){
         /* Push invoice ids to temp array */
         suppliers_ids.push(key.key);
         set_suppliers_ids(suppliers_ids);
    }
    
    function handle_supplier_on_deselect (value,key){
         /* Pop invoice ids to temp array */
         const index = suppliers_ids.indexOf(key.key);
         suppliers_ids.splice(index,1);
    }
    const [loader,set_loader] = useState(false);
    var [suppliers,set_suppliers] = useState([]);
    function search_supplier_by_name(value) {
        set_loader(true);
        var data={'supplier_name':value};
        axios.post(Global_services.search_supplier_by_name,data).then(
            response => {
                console.log(response.data)
                if(response.data.length > 0){
                    set_suppliers(response.data);
                }else{
                    set_suppliers([]);
                }
                
                set_loader(false);
            },error =>{
                set_loader(false);
                Swal.fire({
                    title: 'Error!',
                    text: 'Please Contact your software developer',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        )
    }
    const supplier_filter = () =>{
        return (
            <div>
                <Row className='multi-select-supplier-filter'>
                    <Col>
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Sélectionner Fournisseuses"
                            optionLabelProp="label"
                            onSearch={search_supplier_by_name}
                            onSelect={handle_supplier_on_select}
                            onDeselect={handle_supplier_on_deselect}
                            loading={loader}
                        >
                            {
                                suppliers.map((el,index) => {
                                    
                                    return <Option key={el.supplier_id} value={el.supplier_name} />
                                })
                            }
                        </Select>           
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {common_amount_fields()}
                    </Col>
                    <Col>
                        <Select
                            showSearch
                            style={{ width: '100%',borderRadius:20}}
                            placeholder="Statut de paiement"
                            className=''
                            optionFilterProp="children"
                            onChange={handle_select_payment_type}
                            filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }>

                            <Option value='any'>Toute</Option>
                            <Option value='paid'>Payé</Option>
                            <Option value='unpaid'>Non payé</Option>

                        </Select>
                    </Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col></Col>
                    <Col>
                        <input type='submit' value='Recherche Avancée' onClick={submit_filter} className='form-control btn btn-default submit-supplier-filter-btn'/>
                    </Col>
                    <Col></Col>
                    <Col></Col>
                </Row>
            </div>
        )
    };
    const [order_by_date,set_order_by_date]= useState(false);
    const toggle_order_date = () => {
        set_order_by_date(!order_by_date);
        set_search_data(prevState => ({
            ...prevState,
            order_by_date:order_by_date
        }));
    };
    const [order_by_amount,set_order_by_amount]= useState(false);
    const toggle_order_by_amount = () => {
        set_order_by_amount(!order_by_amount);
        set_search_data(prevState => ({
            ...prevState,
            order_by_amount:order_by_amount
        }));
    };
    const submit_filter = () => {
        props.show_loader(true);
        search_data.order_by_amount=order_by_amount;
        search_data.order_by_date=order_by_date;
        search_data.is_paid=is_paid;
        search_data.supplier_ids=suppliers_ids;
        var temp_date_from=moment(new Date(date_from));
        temp_date_from=temp_date_from.format("YYYY-MM-DD");
        search_data.date_from=temp_date_from;
        /* ------------------------------------------------------------------ */
        var temp_date_to=moment(new Date(date_to));
        temp_date_to=temp_date_to.format("YYYY-MM-DD");
        search_data.date_to=temp_date_to;

        set_search_data(search_data);
        console.log(' --------------------- search_data --------------------- ')
        console.log(search_data);
        var filter_api='';
        if(props.view=='invoice') filter_api=Global_services.advanced_search_invoice;
        if(props.view=='bank_check') filter_api=Global_services.advanced_search_bank_check;
        if(props.view=='sup') filter_api=Global_services.advanced_search_suppliers;
        axios.post(filter_api,search_data).then(
            response => {
                props.show_loader(true);
                console.log(response.data);
                if(response.data == 'EMPTY_RESULT'){
                    alert('No result')
                }else{
                    props.response_data(response)
                }
            },error =>{
                console.log(error);
            }
        )
    };
    const common_amount_fields = () => {
        return(
            <Row>
                <Col>
                    <input type='number' onChange={handle_data_filter} name='amount_from' className='form-control' placeholder='Montant supérieur à'/>
                </Col>
                <Col>
                    <input type='number' onChange={handle_data_filter} name='amount_to' className='form-control' placeholder='Montant inférieure à'/>
                </Col>
            </Row>
        )
    }
    const invoice_filter = () =>{
        return (
            <div className='common-filter'>
                <Row>
                    <Col>
                        {supplier_store_selection()}
                    </Col>
                    <Col>
                        {common_amount_fields()}
                    </Col>
                </Row>
                {common_fields()}

            </div>
        )
    };
    const bank_check_filter = () => {
        return (
            <div className='common-filter'>
                <Row>
                    <Col>
                        {supplier_store_selection()}
                    </Col>
                    <Col>
                        {common_amount_fields()}
                    </Col>
                </Row>
                {common_fields()}
            </div>
        )
    }
    const switch_filter_view = () =>{
        switch(props.view){
            case 'sup':return supplier_filter();
            break;
            case 'invoice':return invoice_filter();
            break;
            case 'bank_check':return bank_check_filter();
            break;
        }
    };

    return (
        <div className='common-filter-container'>
            <Row>
                <Col>
                    <div className='main-filter-box'>
                        <Collapse
                            bordered={true}
                            defaultActiveKey={['0']}
                            className="site-collapse-custom-collapse"
                        >
                            <Panel header='Filtre de recherche' key="1" className="site-collapse-custom-panel">
                            {switch_filter_view()}
                            </Panel>
                        </Collapse>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default Common_filter;