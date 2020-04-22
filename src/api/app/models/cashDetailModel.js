'use strict';

var sql = require('./db.js');

var CashDetail = function (cashDetail){
    this.cash_detail='';
    this.cash_type='';
    this.store_report_id;
    this.cash_amount=1;
}

CashDetail.addCashDetail =  function(new_cash_detail,result){
    var cashSuppLength = new_cash_detail.cash_supply_detail.length;
    var cashExpLength = new_cash_detail.cash_expense_detail.length;


    for(var i =0; i <cashSuppLength; i++){
        var textTag='suppDetailText'+i;
        var valTag='suppDetailVal'+i;
        var jsonData = 
        [
            {
                'cash_detail':new_cash_detail.cash_supply_detail[i][textTag],
                'cash_type':'sup',
                'store_report_id':new_cash_detail.store_report_id,
                'cash_amount':new_cash_detail.cash_supply_detail[i][valTag],
            }
        ]
        sql.query('INSERT INTO cash_detail SET ?',jsonData,function(err,res){
            if(err){
                res.result(err);
            }else{
                
            }
        });
    }
    for(var i =0; i <cashExpLength; i++){
        var textTag='expenseDetailText'+i;
        var valTag='expenseDetailVal'+i;
        var jsonData = 
        [
            {
                'cash_detail':new_cash_detail.cash_expense_detail[i][textTag],
                'cash_type':'sup',
                'store_report_id':new_cash_detail.store_report_id,
                'cash_amount':new_cash_detail.cash_expense_detail[i][valTag],
            }
        ]
        sql.query('INSERT INTO cash_detail SET ?',jsonData,function(err,res){
            if(err){
                res.result(err);
            }else{
                
            }
        });
    }
    result(null,200)
}


module.exports = CashDetail;