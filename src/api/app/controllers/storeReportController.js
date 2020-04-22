'use strict';

var StoreReport=  require('../models/storeReportModel.js');

exports.add_new_store_report = function(req,res){

    var new_store_report = new StoreReport(req.body);
    var temp =new_store_report.remain;
    new_store_report.remain= temp.replace(/,/g,'');
    new_store_report.start_amount=new_store_report.remain;

    StoreReport.addNewStoreReport(new_store_report,req,function(err,StoreReport){
        if(err){
            res.send(err);
        }else{
            res.send(err);
        };
    })
};

exports.get_store_starting_amount = function(req,res){
    StoreReport.getStoreStartingAmount(req,function(err,report){
        if(err){
            res.send(err);
        }else{
            res.send(report)
        };
    })
}

exports.get_report_by_store =function(req,res){
    StoreReport.getReportByStore(req,function(err,report){
        if(err){
            res.send(err);
        }else{
            res.send(report)
        };
    })
}

exports.get_store_report_details =function(req,res){
    
    StoreReport.getStoreReportDetails(req,function(err,report){
        if(err){
            res.send(err);
        }else{
            res.send(report)
        };
    })
}


