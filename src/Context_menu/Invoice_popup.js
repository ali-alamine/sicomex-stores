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

const inv_popup = ({record, pin_invoice,un_pin_invoice,delete_invoice,open_edit_inv_modal, visible, x, y}) => visible &&
  <ul className="popup"  id='popupMenu' style={{left: `${x}px`, top: `${y}px`}}>
    <li onClick={() =>open_edit_inv_modal(record)}> <EditIcon />Open</li>
    <li onClick={() =>open_edit_inv_modal(record)}> <EditIcon />Edit</li>
    { record.invoice_order==0 ? <li onClick={() => pin_invoice(record)} ><BookmarkIcon/> Pin</li>: <li onClick={() => un_pin_invoice(record)} ><BookmarkBorderIcon/> unpin</li> }
    <li onClick={() => delete_invoice(record)}> <DeleteIcon />Delete</li>
  </ul>


const open_sup_dialo = () => {
  
}
const delete_sup = (supplier_data) => {

}
const update_sup = () => {
  alert('3')
}
// const [pin_supplier,set_pin_supplier] = useState({});


export default inv_popup;