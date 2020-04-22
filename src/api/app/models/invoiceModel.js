'use strict';

var sql = require('./db.js');

var Invoice = function(data){
    this.store_id=data.store_id;
    this.inv_amount=data.invoice_amount;
    this.inv_date=data.invoice_date;
    this.supplier_id =data.supplier_id;
}

Invoice.addNewInvoice = function(new_invoice,result){
    sql.query('INSERT INTO inv_supply SET ?',new_invoice, function(err,res){
        if(err){
            result(err,null);
        }else{
            result(null,res.inserted);
        }
    })
}

Invoice.getInvoices = function(req,result){
    sql.query('SELECT inv.*, sup.supplier_name, st.store_name from inv_supply as inv LEFT JOIN supplier as sup on inv.supplier_id = sup.supplier_id LEFT JOIN store as st on inv.store_id = st.store_id order by inv_sup_id limit 100', function(err,res){
        if(err){
            result(err,null);
        }else{
            result(res);
        }
    })
}

Invoice.getInvoicesByRefNumber = function(req,result){
    var request=req.body;
    console.log(request);
    sql.query('SELECT inv_ref from inv_supply where inv_ref like ' + "'%" + request.searchText  + "%'", function(err,res){
        if(err){
            result(err,null);
        }else{
            result(res);
        }
    })
}

module.exports = Invoice;