'use strict';


var Invoice = require('../models/invoiceModel.js');

exports.add_new_invoice = function(req,res){
    var new_invoice = new Invoice(req.body);

    Invoice.addNewInvoice(new_invoice,function(err,invoice){
        if(err){
            res.send(err);
        }else{
            res.send(invoice)
        }
    });
}
exports.get_invoices = function(req,res){
    var new_invoice = new Invoice(req.body);
    Invoice.getInvoices(new_invoice,function(err,invoice){
        if(err){
            res.send(err);
        }else{
            res.send(invoice)
        }
    });
}
exports.get_invoices_by_ref_number = function(req,res){
    Invoice.getInvoicesByRefNumber(req,function(err,invoice){
        if(err){
            res.send(err);
        }else{
            res.send(invoice)
        }
    });
}
