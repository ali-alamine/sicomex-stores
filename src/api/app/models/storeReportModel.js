'use strict';

var sql = require('./db.js');
var CashDetailModel = require('./cashDetailModel.js');
var StoreBankAccModel = require('./storeBankAccModel.js');
// store constructor

var StoreReport =function(storeReport){
    this.store_id=storeReport.store_id;
    this.cash_expense=storeReport.cash_expense_amount;
    this.cash_supply=storeReport.cash_supply_amount;
    this.sales=storeReport.sales_amount;
    this.remain=storeReport.remain_amount;
    this.start_amount=storeReport.start_amount;
    this.bank_deposit=storeReport.bank_deposit_amount;
    this.report_date=storeReport.report_date;
}

StoreReport.addNewStoreReport = function (report_details,request,result){

    sql.query('INSERT INTO store_report SET ?',report_details, function(err,res){
        if(err){
            result(err, null);
        }else{
            var new_cash_detail = new CashDetailModel(report_details);
                    var lastStoreReportID=res.insertId;
                    var reqBody=request.body;
                    new_cash_detail.store_report_id=res.insertId;
                    new_cash_detail.cash_supply_detail=reqBody.cash_supply_details;
                    new_cash_detail.cash_expense_detail=reqBody.cash_expense_details;
                    
                    CashDetailModel.addCashDetail(new_cash_detail,function(err,res){
                        if(err){
                            res.result(err);
                        }else{
                            var update_store_sup_data= {"store_id":'',"store_report_id":'',"supplier_id":'-1',"check_id":'-1',"amount":'',"type":'add',"is_paid":'0'};
                            update_store_sup_data.store_id=report_details.store_id;
                            update_store_sup_data.store_report_id=lastStoreReportID;
                            update_store_sup_data.amount=report_details.bank_deposit;
                            var new_store_bank_acc=  new StoreBankAccModel(update_store_sup_data);
                            StoreBankAccModel.addNewBankStoreTrans(new_store_bank_acc,update_store_sup_data,function(err,res){
                                if(err){
                                    result(err);
                                }else{
                                    result(null,res);
                                }
                            })
                        }
                    })


        }
    })
}

StoreReport.getReportByStore =function(req,result){
    var filter_params=req.body;
    var sqlQuery= "select sr.*, s.* FROM store_report sr LEFT JOIN store s on sr.store_id = s.store_id WHERE sr.store_id =" +filter_params.store_id;
    if(filter_params.date_from != ''){
        sqlQuery = sqlQuery +" and date(sr.report_date) >= " +"'"+ filter_params.date_from +"'"
    }
    if(filter_params.date_to != ''){
        sqlQuery = sqlQuery +" and date(sr.report_date) <=" +"'"+ filter_params.date_to +"'"
    }
    sql.query(sqlQuery,function(err,res){
        if(err){
            result(err,null);
        }else{
            result(null,res);
        }
    })

}

StoreReport.getStoreReportDetails =function(req,result){

    var request=req.body;
    var sqlQuery='SELECT * FROM `cash_detail` WHERE store_report_id =' + request.store_report_id;
    sql.query(sqlQuery,function(err,res){
        if(err){
            result(err,null);
        }else{
            result(null,res);
        }
    })

}

StoreReport.getStoreStartingAmount = function(req,result){
    var request=req.body;
    var sqlQuery='SELECT store_report_id, date(report_date) as date, start_amount FROM `store_report` WHERE store_id = '+  request.store_id + ' order by store_report_id desc LIMIT 1';

    sql.query(sqlQuery,function(err,res){
        if(err){
            result(err,null);
        }else{
            result(null,res);
        }
    })
}

module.exports = StoreReport;