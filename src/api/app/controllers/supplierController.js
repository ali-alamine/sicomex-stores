'use strict'

var Supplier = require('../models/supplierModel.js');

exports.add_new_supplier = function(req,res){

    var new_supplier = new Supplier(req.body);
    Supplier.addNewSupplier(new_supplier,function(err,store){
        if(err){
            res.send(err);
        }else{
            res.send(store)
        }
    });
}
exports.get_suppliers = function(req,res){

    Supplier.getSuppliers(function(err,supplierObj){
        if(err){
            res.send(err);
        }else{
            res.send(supplierObj)
        }
    });
}