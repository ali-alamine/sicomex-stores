import React from "react";
// import {Icon} from "antd"
import './Popup.css';
import Sup_dialog from '../Dialog/Sup_dialog';
const Popup = ({record, visible, x, y}) => visible &&
  <ul className="popup"  id='popupMenu' style={{left: `${x}px`, top: `${y}px`}}>
    <li><Sup_dialog /></li>
    <li onClick={delete_sup}>Delete</li>
    <li onClick={update_sup}>Edit</li>
  </ul>


const open_sup_dialo = () => {
}
const delete_sup = () => {
  alert('2')
}
const update_sup = () => {
  alert('3')
}
export default Popup;