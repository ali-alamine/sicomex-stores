'use strict';

var sql = require('./db.js');

var StoreModel = require('./storeModel.js');
var SupplierModel = require('./supplierModel.js');

var StoreBankAccount = function(data){
    this.store_id=data.store_id;
    this.store_report_id=data.store_report_id;
    this.check_id=data.check_id;
}


StoreBankAccount.getStoreBankAcc =function(req,result){

    var request=req.body;
    var store_id=request.store_id;
    var sqlQuery='SELECT ck.check_number, ck.check_amount as amount, ck.check_date as date, ck.is_paid as type, sup.supplier_name FROM store_bank_acc as sba LEFT JOIN `check` as ck on sba.check_id = ck.check_id LEFT JOIN supplier as sup on ck.sup_id = sup.supplier_id WHERE (sba.check_id != -1 AND ck.store_id =' +store_id +') UNION SELECT null, sr.bank_deposit, sr.report_date, null, null FROM store_bank_acc as sba LEFT JOIN store_report as sr on sba.store_report_id = sr.store_report_id WHERE (sba.store_report_id != -1 AND sr.store_id =' +store_id +')';

    sql.query(sqlQuery,function(err,res){
        if(err){
            console.log(err)
            result(err,null);
        }else{
            
            console.log(sqlQuery)
            result(null,res);
        }
    })
}
StoreBankAccount.getStoreBankAccFilter =function(req,result){

    var request=req.body;
    var store_id=request.store_id;
    var date_from = request.date_from;
    var date_to = request.date_to;
    var sqlQuery='SELECT sba.*,sup.supplier_name,ck.check_number,ck.check_amount,ck.is_paid,sr.bank_deposit FROM store_bank_acc as sba LEFT JOIN supplier as sup on sba.supplier_id = sup.supplier_id LEFT JOIN store_report as sr on sba.store_report_id = sr.store_report_id LEFT JOIN `check` as ck on sba.check_id = ck.check_id where ( (sba.store_id ='+ store_id  + ' OR ck.store_id =' + store_id +') AND (date(sba.trans_date) >='+ '"' + date_from + '"' +' AND date(sba.trans_date) <=' + '"' + date_to + '"' + ')) limit 1000';

    sql.query(sqlQuery,function(err,res){
        if(err){
            result(err,null);
        }else{
            result(null,res);
        }
    })
}

StoreBankAccount.addNewBankStoreTrans = function(data,update_store_sup_data,result){
    var data=data;
    sql.query('INSERT INTO store_bank_acc SET ?',data, function(err,res){
        if(err){
            result(err,null);
        }else{
            /* IF TYPE IS CHECK, ONLY UPDATE BANK ACC WHEN CHECK IS PAID (EQUAL TO 1) */
            if(update_store_sup_data.type == 'sub' && update_store_sup_data.is_paid !='1'){
                result(null,res);
            }else{
                var updateStoreData = {"store_id" :update_store_sup_data.store_id, "amount" :update_store_sup_data.amount,"type":update_store_sup_data.type};
                StoreModel.updateBankAcc(updateStoreData,function(err,res){
                    /* IF TYPE IS BANK DEPOSIT */
                    if(update_store_sup_data.supplier_id != '-1'){
                        var operationType = 'sub';
                        var updateSupData = {"supplier_id": update_store_sup_data.supplier_id,"amount" :update_store_sup_data.amount,"type":operationType};
                        SupplierModel.updateSupplierAcc(updateSupData,function(err,res){
                            result(res);
                        })
                    }else{
                        result(null,res);
                    }
                })
            }
        }
    })
}

module.exports = StoreBankAccount;