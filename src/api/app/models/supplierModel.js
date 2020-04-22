'use strict';

var sql = require('./db.js');

/* supplier constructor */

var Supplier = function(supplier){
    this.supplier_name = supplier.supplier_name;
    this.amount = supplier.amount;
};

Supplier.getAllSuppliers = function (result){
    sql.query('SELECT * FROM supplier order by supplier_id desc',function(err,res){
        if(err){
            result(null, err);
        }else{
            result(null,res);
        }
    })

}

Supplier.addNewSupplier =  function (supplier_details,result){
    sql.query("INSERT INTO supplier set ?",supplier_details, function (err, res) {
        if(err){
            result(err, null);
        }else{
            result(null, res.insertId);
        }
    });

};

Supplier.getSupplierAccount =  function (result){
    var sqlQuery="select sum(ct.check_amount * ct.is_paid) as suppAcc, sup.* from `check` as ct left join supplier as sup on ct.sup_id = sup.supplier_id where sup.supplier_id is not NULL GROUP by sup_id order by sup.supplier_id desc";
    sql.query(sqlQuery,function(err,res){
        if(err){
            result(null, err);
        }else{
            result(null,res);
        }
    })

};

Supplier.updateSupplierAcc =  function (supData,result){
    var operationType = supData.type;
    if(operationType == 'add'){
        operationType = '+';
    }else{
        operationType = '-';
    }
    var supplier_id = supData.supplier_id;
    var amount = supData.amount;
    var sqlQuery = 'UPDATE supplier SET amount = amount ' + operationType + ' ' + amount + ' WHERE supplier_id = ' + supplier_id;

    sql.query(sqlQuery,function(err,res){
        if(err){
            result(null, err);
        }else{
            result(null,res);
        }
    })

};

module.exports= Supplier;