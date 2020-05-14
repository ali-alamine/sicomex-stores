import React from "react";
// import {Icon} from "antd"
import './Popup.css';
import DeleteIcon from '@material-ui/icons/Delete';
// import check_dialog from '../Dialog/check_dialog';
import EditIcon from '@material-ui/icons/Edit';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import LaunchIcon from '@material-ui/icons/Launch';
import axios from 'axios';
import Swal from 'sweetalert2';

const Popup = ({record, pin_check,un_pin_check,delete_check,open_edit_check_modal,open_check_description,visible, x, y}) => visible &&
  <ul className="popup"  id='popupMenu' style={{left: `${x}px`, top: `${y}px`}}>
    <li Style={record.is_for_sup =='Expense' ? 'display:block':'display:none' } onClick={() =>open_check_description(record)}> <LaunchIcon /> Check Details</li>
    <li onClick={() =>open_edit_check_modal(record)}> <EditIcon /> Edit</li>
    { record.check_order==0 ? <li onClick={() => pin_check(record)} ><BookmarkIcon/> Pin</li>: <li onClick={() => un_pin_check(record)} ><BookmarkBorderIcon/> unpin</li> }
    <li onClick={() => delete_check(record)}> <DeleteIcon />Delete</li>
  </ul>


const open_check_dialo = () => {
  
}
const delete_check = (check_data) => {

}
const update_check = () => {
  alert('3')
}
// const [pin_check,set_pin_check] = useState({});


export default Popup;