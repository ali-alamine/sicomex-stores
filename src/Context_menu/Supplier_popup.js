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
import CreditScoreIcon from '@mui/icons-material/CreditScore';

const Popup = ({record, pin_supplier,un_pin_supplier,delete_supplier,open_edit_sup_modal,pay_partial_invoice, visible, x, y}) => visible &&
  <ul className="popup"  id='popupMenu' style={{left: `${x}px`, top: `${y}px`}}>
    <li><Sup_dialog supplier_data={record} /></li>
    <li onClick={() =>open_edit_sup_modal(record)}> <EditIcon /> Éditer</li>
    { record.sup_order==0 ? <li onClick={() => pin_supplier(record)} ><BookmarkIcon/> Épingle</li>: <li onClick={() => un_pin_supplier(record)} ><BookmarkBorderIcon/> Détacher</li> }
    <li onClick={() =>pay_partial_invoice(record)}> <CreditScoreIcon /> Paiement partiel</li>
    <li onClick={() => delete_supplier(record)}> <DeleteIcon />Supprimer</li>
  </ul>

export default Popup;