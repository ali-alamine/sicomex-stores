'use strict'

var CheckModel=  require('../models/checkModel.js');

exports.add_new_check = function (req,res){

    var new_check_details=new CheckModel(req.body);
    
    CheckModel.addNewCheck(new_check_details,function(err,CheckModel){
        if(err){
            res.send(err);
        }else{
            res.sendStatus(200);
        }
    })
}

exports.get_checks = function (req,res){
    CheckModel.getCheks(function(err,checks){
        if(err){
            res.send(err);
        }else{
            res.send(checks)
        }
    })
}

exports.get_check_by_id = function (req,res){
    var checkId=req.query['checkId'];

    CheckModel.getCheckById(checkId,function(err,checks){
        if(err){
            res.send(err);
        }else{
            res.send(checks)
        }
    })
}

exports.update_check = function (req,res){
    var request=req.body;
    var update_check_data={};
    update_check_data.check_id=request.check_id;
    update_check_data.check_number=request.checkNumber;
    update_check_data.sup_id=request.supplier_id;
    update_check_data.store_id=request.store_id;
    update_check_data.check_amount=request.checkAmount;
    update_check_data.check_date=request.checkDate;
  
    update_check_data.is_paid=request.is_paid;
    update_check_data.check_id=request.check_id;
    var defPayment=request.defultPaymentState;
    var defPaymentVal=request.defultPaymentVal;
    var checkSetting={'defPayment':defPayment,'defPaymentVal':defPaymentVal};
    CheckModel.updateCheck(update_check_data,checkSetting,function(err,check){
        if(err){
            res.send(err)
        }else{
            res.send(check)
        }
    })
}

exports.search_check =  function (req,res){
    CheckModel.searchCheck(req.body,function(err,checks){
        if(err){
            res.send(err);
        }else{
            res.send(checks);
        }
    })
}

exports.search_with_filter = function (req,res){
    CheckModel.searchWithFilter(req.body,function(err,checks){
        if(err){
            res.send(err);
        }else{
            res.send(checks);
        }
    })
}