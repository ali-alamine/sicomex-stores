import React, { useState } from 'react';
import './Dynamic_table.css';
import Spinner from 'react-bootstrap/Spinner'
import Sup_dialog from'./Sup_dialog.js';
import Context_menu from'../Context_menu/Context_menu';
const Table = (props) => {
    const { headers, rows } = props;
    return (
        <div>
            <table className="table table-bordered table-striped table-hover dynamic-table">
                <TableHeader headers={headers}></TableHeader>
                <TableBody headers={headers} rows={rows}></TableBody>
            </table>
        </div>
    );
}

const TableHeader = (props) => {
    const { headers } = props;
    return(
        <thead className="dynamic-table-header" key="header-1">
            <tr key="header-0">
                { headers && headers.map((value, index) => {
                    return <th key={index}><div>{value}</div></th>
                })}
            </tr>
        </thead>
    );
}

const TableBody = (props) => {
    const { headers, rows } = props;
    const columns = headers ? headers.length : 0;
    const showSpinner = rows === null;

    function buildRow(row, headers) {
      return (
                <tr key={row.id} className="" id="navbarDropdownMenuLink"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                { headers.map((value, index) => {
                    return <td key={index}>{row[value]}</td>
                })}
                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <a className="dropdown-item" href="#">Action</a>
                    <a className="dropdown-item" href="#">Another action</a>
                    <a className="dropdown-item" href="#">Something else here</a>
                </div>
                </tr>




       )
    };
  
    return(
      <tbody>
          {
            <div>
                {/* <Sup_dialog open_dialog={open_dialog}/> */}
            </div>
          }
          {showSpinner &&
            <tr key="spinner-0">
                <td colSpan={columns} className="text-center">
                <Spinner animation="grow" />
                </td>
            </tr>
            }
          { !showSpinner && rows && rows.map((value) => {
                return buildRow(value, headers);
            })}
      </tbody>
    );
  }

  export default Table;