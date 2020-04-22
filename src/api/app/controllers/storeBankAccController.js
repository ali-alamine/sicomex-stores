'use strict';

var StoreBankAcc=  require('../models/storeBankAccModel.js');

exports.get_store_bankAcc = function(req,res){
    StoreBankAcc.getStoreBankAcc(req,function(err,report){
        
        if(err){
            res.send(err);
        }else{
            res.send(report)
        };
    })
}
exports.get_store_bankAcc_filter = function(req,res){
    StoreBankAcc.getStoreBankAccFilter(req,function(err,report){
        
        if(err){
            res.send(err);
        }else{
            res.send(report)
        };
    })
}