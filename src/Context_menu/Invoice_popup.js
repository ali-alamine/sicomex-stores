import React from "react";
// import {Icon} from "antd"
import './Popup.css';
import DeleteIcon from '@material-ui/icons/Delete';
import Sup_dialog from '../Dialog/Sup_dialog';
import EditIcon from '@material-ui/icons/Edit';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import axios from 'axios';
import Swal from 'sweetalert2';

const inv_popup = ({record, pin_invoice,un_pin_invoice,delete_invoice,open_invoice_details,open_edit_inv_modal, visible, x, y}) => visible &&
  <ul className="popup"  id='popupMenu' style={{left: `${x}px`, top: `${y}px`}}>
    <li onClick={() =>open_invoice_details(record)}> <EditIcon />Ouverte</li>
    <li onClick={() =>open_edit_inv_modal(record)}> <EditIcon />Éditer</li>
    { record.invoice_order==0 ? <li onClick={() => pin_invoice(record)} ><BookmarkIcon/> Épingle</li>: <li onClick={() => un_pin_invoice(record)} ><BookmarkBorderIcon/> détacher</li> }
    <li onClick={() => delete_invoice(record)}> <DeleteIcon />Supprimer</li>
  </ul>


export default inv_popup;