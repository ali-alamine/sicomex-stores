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
const Popup = ({record, visible, x, y}) => visible &&
  <ul className="popup"  id='popupMenu' style={{left: `${x}px`, top: `${y}px`}}>
    <li><Sup_dialog /></li>
    { record.sup_order==0 ? <li onClick={() => pin_supplier(record)} ><BookmarkIcon/> Pin</li>: <li onClick={() => un_pin_supplier(record)} ><BookmarkBorderIcon/> unpin</li> }
    <li onClick={delete_sup}> <DeleteIcon />Delete</li>
    <li onClick={update_sup}> <EditIcon /> Edit</li>
  </ul>


const open_sup_dialo = () => {
}
const delete_sup = () => {
  alert('2')
}
const update_sup = () => {
  alert('3')
}
// const [pin_supplier,set_pin_supplier] = useState({});
const pin_supplier = (pin_supplier) => {
  axios.post('http://localhost:4000/pin_supplier',pin_supplier).then(
      response => {
          Swal.fire({
              icon: 'success',
              title: 'Success',
              showConfirmButton: false,
              timer: 1000
          });
      },error =>{
          console.log(error);
          Swal.fire({
              title: 'Error!',
              text: 'Please Contact your software developer',
              icon: 'error',
              confirmButtonText: 'OK'
          })
      }
  )
}
const un_pin_supplier = (pin_supplier) => {
  axios.post('http://localhost:4000/un_pin_supplier',pin_supplier).then(
    response => {
        Swal.fire({
            icon: 'success',
            title: 'Success',
            showConfirmButton: false,
            timer: 1000
        });
    },error =>{
        console.log(error);
        Swal.fire({
            title: 'Error!',
            text: 'Please Contact your software developer',
            icon: 'error',
            confirmButtonText: 'OK'
        })
    }
  )
}
export default Popup;