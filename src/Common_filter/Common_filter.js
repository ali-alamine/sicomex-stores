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
// import DatePicker from "react-datepicker";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Collapse } from 'antd';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { DatePicker } from 'antd';
function Common_filter (props){
    
    const [search_data,set_search_data] = React.useState({
        supplier_id:'',
        store_id:'',
        amount_from:'',
        amount_to:'',
        date_from:'',
        date_to:'',
        is_paid:'',
        order_by_date:'',
        order_by_amount:'',
    });

    const handle_select_store = (store_id,store_amount) => {
        search_data.store_id=store_id;
    }
    const handle_select_supplier = (supplier_id,supplier_amount) =>{
        search_data.supplier_id=supplier_id;
    }
    const { Panel } = Collapse;
    const { Option } = Select;
    const { RangePicker } = DatePicker;

    const [date_from,set_date_from] = useState(new Date());
    const [date_to,set_date_to] = useState(new Date());
    const submit_filter = () => {
        var temp_date_from=moment(new Date(date_from));
        temp_date_from=temp_date_from.format("YYYY-MM-DD");
        search_data.date_from=temp_date_from;
        /* ------------------------------------------------------- */
        var temp_date_to=moment(new Date(date_from));
        temp_date_to=temp_date_to.format("YYYY-MM-DD");
        search_data.date_to=temp_date_to;
    }

    const supplier_filter = () =>{
        return (
            <div>
                <Row>
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
                                    return <Option key={el.supplier_amount} value={el.supplier_id}>{el.supplier_name}</Option>
                                })
                            }
                        </Select>
                    </Col>
                    <Col>
                        <input type='number' className='form-control' placeholder='Amount Greater Than'/>
                    </Col>
                    <Col>
                        <input type='number' className='form-control' placeholder='Amount less Than'/>
                    </Col>
                    <Col>
                        <input type='checkbox' className='form-control' placeholder='Amount less Than'/>
                    </Col>
                    <Col>
                        <input type='submit' value='Chercher' className='form-control btn btn-primary'/>
                    </Col>
                    <Col>
                        <input type='submit' value='Chercher' className='form-control btn btn-primary'/>
                    </Col>
                    
                </Row>
            </div>
        )
    };
    useEffect(()=>{

    },props.view);
    var testD=[];
    const test = () => {
        console.log('test')
        console.log(testD)
    }
    const invoice_filter = () =>{
        console.log('supplier_list')
        console.log(props.supplier_list)
        console.log(props.view)
        return (
            <div>
                <Row>
                    <Col><RangePicker format='DD-MM-YYYY' className='range-date' onChange={test}/></Col>
                </Row>
                <Row>
                    <Col>
                        <Select
                            showSearch
                            style={{ width: '100%',borderRadius:20}}
                            placeholder="Select Store"
                            optionFilterProp="children"
                            onChange={handle_select_store}
                            filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {
                                props.all_stores.map((el,index) => {
                                    return <Option key={el.store_amount} value={el.store_id}>{el.label}</Option>
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
                                    return <Option key={el.supplier_amount} value={el.supplier_id}>{el.supplier_name}</Option>
                                })
                            }
                        </Select>
                    </Col>
                    <Col>
                        <input type='text' className='form-control' placeholder='Invoice Number'/>
                    </Col>
                    <Col>
                        <input type='number' className='form-control' placeholder='Amount Greater Than'/>
                    </Col>
                    <Col>
                        <input type='number' className='form-control' placeholder='Amount less Than'/>
                    </Col>
                    <Col>
                        <input type='submit' className='form-control btn btn-primary'/>
                    </Col>
                </Row>
            </div>
        )
    };

    const switch_filter_view = () =>{
        switch(props.view){
            case 'sup':return supplier_filter();
            break;
            case 'invoice':return invoice_filter();
            break;
        }
    }

    return (
        <div>
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