import React from "react";
// import {Icon} from "antd"
import './Popup.css';
import DeleteIcon from '@material-ui/icons/Delete';
// import check_dialog from '../Dialog/check_dialog';
import EditIcon from '@material-ui/icons/Edit';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import LaunchIcon from '@material-ui/icons/Launch';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import axios from 'axios';
import Swal from 'sweetalert2';

const Popup = ({record, pin_check,un_pin_check,delete_check,open_edit_check_modal,set_check_paid,set_check_unpaid,open_check_description,visible, x, y}) => visible &&
  <ul className="popup"  id='popupMenu' style={{left: `${x}px`, top: `${y}px`}}>
    <li Style={record.is_for_sup =='Expense' ? 'display:block':'display:none' } onClick={() =>open_check_description(record)}> <LaunchIcon /> Check Details</li>
    {record.is_paid==0? <li onClick={() =>open_edit_check_modal(record)}> <EditIcon /> Éditer</li>:''}
    { record.check_order==0 ? <li onClick={() => pin_check(record)} ><BookmarkIcon/> Épingle</li>: <li onClick={() => un_pin_check(record)} ><BookmarkBorderIcon/> Détacher</li> }
    {record.is_paid == 0 ?<li onClick={() => set_check_paid(record)}> <AttachMoneyIcon /> Régler le paiement</li> : <li onClick={() => set_check_unpaid(record)}> <MoneyOffIcon /> Supprimer le paiement</li> }
    <li onClick={() => delete_check(record)}> <DeleteIcon /> Supprimer</li>
  </ul>


export default Popup;