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

function Add_new_check(){
    return (
        <div className='col-md-8'>
            <div className='bank-check'>
                <div className='add-check bordered largeGaps'>
                <span className='add-check-label'>Add New CHECK</span>
                    <svg width="170" height="170">
                    <circle cx="120" cy="120" r="40" stroke="green" strokeWidth="4" fill="white" />
                    <text fill="#000000" fontSize="50"
                        x="104" y="135">+</text>
                    </svg>
                </div>
            </div>

            {/* ********************** START - MODALS ****************************************** */}
                <Modal>
                    <ModalHeader>
                        <ModalTitle>Create New Check</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                            <div className='store-form'>
                                <label className='input-label'>Store Name</label>
                                <div className="form-group">
                                    <Select
                                        placeholder='Select Store'
                                    />
                                </div>
                                </div>
                                <div className="form-group">
                                    <label className='input-label'>Check ID</label>
                                    <input type="text" className="form-control" placeholder="Check Number"/>
                                </div>
                                <div className="form-group">
                                <label className='input-label'>Supplier Name</label>
                                    <Select
                                        placeholder='Select Supplier'
                                    />
                                </div>
                                <div className="form-group">
                                <div className="form-group">
                                    <label className='input-label'>Check Amount</label>
                                    <input type="text" name='checkAmount' className="form-control" placeholder="Check Amount" />
                                </div>
                                <div className="form-group">
                                    <label className='input-label'>Check Date</label>
                                    <input type="date" name='checkDate' className="form-control" placeholder="Check Date" />
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
