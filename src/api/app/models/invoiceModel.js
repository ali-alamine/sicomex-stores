'use strict';

var sql = require('./db.js');
var supplierModel = require('../models/supplierModel');

var Invoice =function(invoice){
    this.store_id=invoice.store_id;
    this.supplier_id=invoice.supplier_id;
    this.check_id=invoice.check_id;
    this.is_paid=invoice.is_paid;
    this.invoice_amount=invoice.invoice_amount;
    this.invoice_date=invoice.invoice_date;
}
Invoice.addNewInvoice = function (invoice_data,result){
    
    sql.beginTransaction(function(err){
        if (err) { throw err; }
        sql.query('INSERT INTO invoice SET ?',invoice_data, function(err,res){
            if(err){
                sql.rollback(function() {
                    throw err;
                });
            }else{
                sql.query('UPDATE supplier SET supplier_amount = supplier_amount + ' + invoice_data.invoice_amount + ' WHERE supplier_id = ' + invoice_data.supplier_id, function(err,res){
                    if(err){
                        sql.rollback(function() {
                            throw err;
                        });
                    }else{
                        sql.commit(function(err) {
                            if (err) { 
                                sql.rollback(function() {
                                    throw err;
                                });
                            }else{
                                result(null,res);
                            }
                        });
                    }
                })
            }

        });
    });
}

Invoice.getInvoices = function(result){
    sql.query('SELECT inv.*,sup.*,st.* FROM invoice as inv left join supplier as sup on inv.supplier_id = sup.supplier_id left join store as st on inv.store_id = st.store_id ORDER BY inv.invoice_order DESC , inv.invoice_id DESC limit 50',function(err,res){
        if(err){
            result(err);
        }else{
            result(res);
        }
    });
}

Invoice.updateInvoice = function(invoice_data,result){
    sql.beginTransaction(function(err){
        if (err) { throw err; }
        var sqlQuery='UPDATE invoice SET invoice_number = ' +"'"+ invoice_data.edit_invoice_number  +"'" + ',store_id = ' +"'"+ invoice_data.store_id  +"'"+',supplier_id = ' +"'"+ invoice_data.supplier_id  +"'"+ ',invoice_date = ' +"'"+ invoice_data.edit_invoice_date  +"'" + ',invoice_amount= ' +"'"+ invoice_data.edit_invoice_amount +"'"+" WHERE invoice_id = " +"'"+ invoice_data.invoice_id +"'";
        sql.query(sqlQuery,function(err,res){
            if(err){
                if(err){
                    sql.rollback(function() {
                        throw err;
                    });
                }
            }else{
                if(invoice_data.final_amount != 0){

                    var update_supplier_amount ={'final_amount':invoice_data.final_amount,'supplier_id':invoice_data.supplier_id}
                    supplierModel.updateAmount(update_supplier_amount,function(err,response){
                        if(err){
                            sql.rollback(function() {
                                throw err;
                            });
                        }
                    })
                    sql.commit(function(err) {
                        if (err) { 
                            sql.rollback(function() {
                                throw err;
                            });
                        }
                        result(null,res);
                    });
                }else{
                    
                    sql.commit(function(err) {
                        if (err) { 
                            sql.rollback(function() {
                                throw err;
                            });
                        }
                        result(null,res);
                    });
                }
            }
        });
    })
}
Invoice.deleteInvoice = function(invoice_data,result){
    sql.beginTransaction(function(err){
        if (err) { throw err; }
        var sqlQuery="DELETE FROM invoice WHERE invoice_id = " + invoice_data.invoice_id;
        sql.query(sqlQuery,function(err,res){
            if(err){
                if(err){
                    sql.rollback(function() {
                        throw err;
                    });
                }
            }else{
                sql.query('UPDATE supplier SET supplier_amount = supplier_amount - ' + invoice_data.invoice_amount + ' WHERE supplier_id = ' + invoice_data.supplier_id, function(err,res){
                    if(err){
                        sql.rollback(function() {
                            throw err;
                        });
                    }else{
                        
                        sql.commit(function(err) {
                            if (err) { 
                                sql.rollback(function() {
                                    throw err;
                                });
                            }else{
                                result(null,res);
                            }
                        });
                    }
                })
            }
        });
    })
}
Invoice.pinInvoice = function (invoice_data,result){
    var invoice_id=invoice_data.invoice_id;
    sql.query('UPDATE invoice SET invoice_order = 1 WHERE invoice_id= +'+ invoice_id,function(err,res){
        if(err){
            result(err);
        }else{
            result(res);
        }
    });
}
Invoice.unPinInvoice = function (invoice_data,result){
    var invoice_id=invoice_data.invoice_id;
    sql.query('UPDATE invoice SET invoice_order = 0 WHERE invoice_id= +'+ invoice_id,function(err,res){
        if(err){
            result(err);
        }else{
            result(res);
        }
    });
}
Invoice.getInvoiceByNumber = function(invoice_data,result){
    var invoice_number=invoice_data.invoice_number;
    sql.query('SELECT * FROM invoice WHERE invoice_number ',function(err,res){
    // sql.query('SELECT * from invoice where invoice_number = ' +invoice_number,function(err,res){
        if(err){
            result(err);
        }else{
            result(res);
        }
    });
}
module.exports = Invoice;   