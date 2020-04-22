'use strict';

var sql = require('./db.js');

// store constructor

var Store =function(store){
    this.store_name=store.new_store_name;
    this.amount=store.new_store_init_amount;
}


Store.addNewStore = function (store_details,result){
    console.log(store_details)
    sql.query('INSERT INTO store SET ?',store_details, function(err,res){
        if(err){
            result(err,null);
        }else{
            result(null,res.inserted);
        }
    })

}

Store.getAllStores = function(result){
    sql.query('SELECT * FROM store order by store_id desc',function(err,res){
        if(err){
            result(err);
        }else{
            result(res);
        }
    });
}

Store.getStoreBankAcc = function(req,result){
    var request = req.body;
    var store_id=request.store_id;
    sql.query('SELECT amount,store_name FROM store where store_id = '+store_id,function(err,res){
        if(err){
            result(err);
        }else{
            result(res);
        }
    });
}

Store.updateBankAcc = function(req,result){
    var operationTyep = req.type;
    operationTyep == 'add'? operationTyep='+': operationTyep =='sub'? operationTyep = '-' :'';

    var sqlQuery = 'UPDATE store SET amount = amount ' + operationTyep + ' ' + req.amount + ' WHERE store_id = ' + req.store_id;

    sql.query(sqlQuery,function(err,res){
        if(err){
            result(err);
        }else{
            result(res);
        }
    });
}

module.exports = Store;