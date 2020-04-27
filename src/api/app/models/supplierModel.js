'use strict';

var sql = require('./db.js');

var Supplier =function(store){
    this.supplier_name=store.supplier_name;
    this.supplier_amount=store.supplier_amount;
}

Supplier.addNewSupplier = function (new_supplier,result){
    sql.query('INSERT INTO supplier SET ?',new_supplier, function(err,res){
        if(err){
            result(err,null);
        }else{
            result(null,res.inserted);
        }
    })
}

Supplier.getSuppliers = function (result){
    sql.query('SELECT * FROM supplier order by supplier_id desc limit 50',function(err,res){
        if(err){
            result(err);
        }else{
            result(res);
        }
    });
}

module.exports = Supplier;