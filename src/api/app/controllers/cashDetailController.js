'use strict';

var CashDetail = require('../models/CashDetailModel.js');

exports.add_cash_details = function (req,res){

    var new_cash_detail = new CashDetail(req.body);

    CashDetail.addCashDetail(new_cash_detail, function (err,CashDetail){
        if(err){
            res.send(err);
        }else{
            res.send(CashDetail);
        }
    })
}