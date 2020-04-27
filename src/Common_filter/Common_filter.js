import React, { useEffect,useState } from 'react';
import './Common_filter.css';
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import Select from 'react-select';
import axios from 'axios';
import Swal from 'sweetalert2';
import $ from 'jquery';
import moment from 'moment';
import DatePicker from "react-datepicker";

function Common_filter (){
    return (
        <div>
            <div className='main-filter-box'>
                <span>FILTER_BOX</span>
            </div>
        </div>
    )
}

export default Common_filter;