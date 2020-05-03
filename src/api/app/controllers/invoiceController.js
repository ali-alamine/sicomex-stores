'use strict';

var Invoice = require('../models/invoiceModel.js');

exports.add_new_invoice=function(req,res){

    var request = req.body;
    var invoice_data = {"invoice_amount":request.invoice_amount,"invoice_number":request.invoice_number,'supplier_id':request.supplier_id,'store_id':request.store_id,'invoice_date':request.invoice_date};
    Invoice.addNewInvoice(invoice_data,function(err,invoice){
        if(err){
            res.send(err)
        }else{
            res.send(invoice)
        }
    })
}

exports.get_invoices = function(req,res){

    Invoice.getInvoices(function(err,invoices){
        if(err){
            res.send(err);
        }else{
            res.send(invoices);
        }
    })
}
exports.update_invoice = function(req,res){
    var request=req.body
    var invoice_data = {"edit_invoice_amount":request.edit_invoice_amount,"invoice_id":request.invoice_id,"edit_invoice_number":request.edit_invoice_number,'supplier_id':request.supplier_id,'store_id':request.store_id,'edit_invoice_date':request.edit_invoice_date};
    console.log('invoice_data')
    console.log(invoice_data)
    Invoice.updateInvoice(invoice_data,function(err,invoice){
        if(err){
            res.send(err);
        }else{
            res.send(invoice);
        }
    })
}