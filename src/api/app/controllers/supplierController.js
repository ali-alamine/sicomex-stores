'use strict';

var Supplier = require('../models/supplierModel.js');

exports.get_all_suppliers = function (req,res){
    Supplier.getAllSuppliers(function(err, supplier) {
        if (err){
            res.send(err);
        }else{
            res.send(supplier);
        }
    });
}
exports.get_supplier_account = function (req,res){
    Supplier.getSupplierAccount(function(err, supplier) {
        if (err){
            res.send(err);
        }else{
            res.send(supplier);
        }
    });
}
exports.add_new_supplier = function (req,res){
    var new_supplier = new Supplier(req.body);

    Supplier.addNewSupplier(new_supplier,function(err,supplier){
        if (err){

            res.send(err);
        }else{
            res.json(supplier);
        }
    })
}
