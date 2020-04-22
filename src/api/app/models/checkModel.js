'use strict';

var sql = require('./db.js');
var StoreBankAccModel = require('./storeBankAccModel.js');
var StoreModel = require('./storeModel.js');
var SupplierModel = require('./supplierModel.js');

var Check = function(checkFields){
    this.check_number=checkFields.checkNumber;
    this.sup_id=checkFields.supplier_id;
    this.store_id=checkFields.store_id;
    this.check_amount=checkFields.checkAmount;
    this.check_date=checkFields.checkDate;
    this.is_paid=checkFields.is_paid;
    this.store_id=checkFields.store_id
}

Check.addNewCheck=function(check_details,result){
    sql.query('INSERT INTO `check` SET ?',check_details,function(err,res){
        if(err){
            res.result(err,null);
        }else{
            var update_store_sup_data= {"store_id":'',"supplier_id":'',"store_report_id":'-1',"check_id":'',"amount":'',"type":'sub',"is_paid":''};
            update_store_sup_data.check_id=res.insertId;
            update_store_sup_data.store_id=check_details.store_id;
            update_store_sup_data.supplier_id=check_details.sup_id;
            update_store_sup_data.is_paid=check_details.is_paid;
            update_store_sup_data.amount=check_details.check_amount;
            var new_store_bank_acc=  new StoreBankAccModel(update_store_sup_data);

            StoreBankAccModel.addNewBankStoreTrans(new_store_bank_acc,update_store_sup_data,function(err,res){
                if(err){
                    result(err);
                }else{
                    result(null,res)
                }
            })
        }
    })
}

Check.getCheks=function(result){
    sql.query('SELECT store.store_name, c.*, s.supplier_name,s.supplier_id FROM `check` as c inner join supplier as s on c.sup_id = s.supplier_id inner join store as store on c.store_id=store.store_id order by check_id desc limit 100',function(err,res){
        if(err){
            result(err);
        }else{
            result(res);
        }
    });
}

Check.getCheckById=function(check_id,result){
    check_id=JSON.parse(check_id);
    sql.query('SELECT c.* , s.*, store.* from `check` as c left JOIN supplier as s on c.sup_id = s.supplier_id LEFT JOIN store on c.store_id = store.store_id where c.check_id = ?',check_id.check_id,function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}

Check.updateCheck = function(update_check_data,checkSetting,result){
    let queryString = 'UPDATE `check` SET  ? where check_id ='+ update_check_data.check_id;
    
    sql.query(queryString,update_check_data,function(err,res){
        if(err){
            result(err);
        }else{
            if(checkSetting.defPayment == update_check_data.is_paid && checkSetting.defPaymentVal == update_check_data.check_amount ){
                sql.query('SELECT c.* , s.*, store.* from `check` as c left JOIN supplier as s on c.sup_id = s.supplier_id LEFT JOIN store on c.store_id = store.store_id where c.check_id = ?',update_check_data.check_id,function(err,res){
                    if(err){
                        result(err);
                    }else{
                        result(res);
                    }
                });
            }else{
                /* TOGGLE PAY / UNPAID */
                if(checkSetting.defPayment != update_check_data.is_paid && checkSetting.defPaymentVal == update_check_data.check_amount){
                    var operationType='';
                    if(update_check_data.is_paid==1){
                        operationType='sub';
                    }else{
                        operationType='add';
                    }
                    var updateStoreData = {"store_id" :update_check_data.store_id, "amount" :update_check_data.check_amount,"type":operationType};
                    StoreModel.updateBankAcc(updateStoreData,function(err,res){
                        var updateSupData = {"supplier_id": update_check_data.sup_id,"amount" :update_check_data.check_amount,"type":operationType};
                        SupplierModel.updateSupplierAcc(updateSupData,function(err,res){
                            sql.query('SELECT c.* , s.*, store.* from `check` as c left JOIN supplier as s on c.sup_id = s.supplier_id LEFT JOIN store on c.store_id = store.store_id where c.check_id = ?',update_check_data.check_id,function(err,res){
                                if(err){
                                    console.log(err);
                                    result(err);
                                }else{
                                    result(res);
                                }
                            });
                        })
                    })
                }
                /* UPDATE CHECK SET PAID AND CHANGE CHECK AMOUNT */
                else if(checkSetting.defPayment != update_check_data.is_paid && update_check_data.is_paid==1 && checkSetting.defPaymentVal != update_check_data.check_amount){
                    var new_amount=update_check_data.check_amount;
                    var opType='sub';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                    var data = {"store_id" :update_check_data.store_id,"amount" :new_amount,"type":opType};
                    StoreModel.updateBankAcc(data,function(err,res){
                        var updateSupData = {"supplier_id": update_check_data.sup_id,"amount" :update_check_data.check_amount,"type":operationType};
                        SupplierModel.updateSupplierAcc(updateSupData,function(err,res){
                            sql.query('SELECT c.* , s.*, store.* from `check` as c left JOIN supplier as s on c.sup_id = s.supplier_id LEFT JOIN store on c.store_id = store.store_id where c.check_id = ?',update_check_data.check_id,function(err,res){
                                if(err){
                                    console.log(err);
                                    result(err);
                                }else{
                                    result(res);
                                }
                            });
                        })
                    })          
                }
                else{
                    sql.query('SELECT c.* , s.*, store.* from `check` as c left JOIN supplier as s on c.sup_id = s.supplier_id LEFT JOIN store on c.store_id = store.store_id where c.check_id = ?',update_check_data.check_id,function(err,res){
                        if(err){
                            result(err);
                        }else{
                            result(res);
                        }
                    });
                }
            }
        }
    });
}

Check.searchCheck = function(search_details,result){
    let sqlQuery = "SELECT c.* , s.*, store.* from `check`as c left JOIN supplier as s on c.sup_id = s.supplier_id LEFT JOIN store on c.store_id = store.store_id where s.supplier_name like '%"+search_details.search_keyword+"%' or c.check_number ="+ "'" + search_details.search_keyword +"' and c.sup_id is not null order by check_id desc"
    
    sql.query(sqlQuery,function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });
}

Check.searchWithFilter = function(search_details,result){
    var sqlQuery='';
    if((search_details.is_paid != 0 && search_details.is_paid != 1) && search_details.supplier_id == '' && search_details.store_id == '' && search_details.date_from == '' && search_details.date_to == ''){
        sqlQuery='SELECT c.*, s.*, store.* from `check` as c left join supplier as s on s.supplier_id=c.sup_id left join store on c.store_id = store.store_id order by check_id desc';
    }else{
        sqlQuery='SELECT c.*, s.*, store.* from `check` as c left join supplier as s on s.supplier_id=c.sup_id left join store on c.store_id = store.store_id where c.is_paid ';
        
        if(search_details.is_paid == '2'){
            sqlQuery=sqlQuery + 'IS NOT NULL';
        }else if(search_details.is_paid == '0' || search_details.is_paid == '1'){
            
            sqlQuery=sqlQuery +'='+ search_details.is_paid;
        }
        if(search_details.supplier_id != ''){
            sqlQuery=sqlQuery + ' AND s.supplier_id = ' + search_details.supplier_id;
        }
        if(search_details.store_id != ''){
            sqlQuery=sqlQuery + ' AND store.store_id = ' + search_details.store_id;
        }
        if(search_details.date_from != ''){
            sqlQuery=sqlQuery + ' AND date(c.check_date) >=' +"'"+search_details.date_from +"'";
        }
        if(search_details.date_to != ''){
            sqlQuery=sqlQuery + ' AND date(c.check_date) <='  +"'"+ search_details.date_to +"'";;
        }
    }

    sql.query(sqlQuery,function(err,res){
        if(err){
            result(err);
        }else{
            result(null,res);
        }
    });

}

module.exports = Check;