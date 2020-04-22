'use strict';

module.exports = function(app){
    var supplierReq = require('../controllers/supplierController');
    var storeReq = require('../controllers/storeController');
    var storeReportReq = require('../controllers/storeReportController');
    var checkReq = require('../controllers/checkController');
    var storeBankAccReq = require('../controllers/storeBankAccController');
    var invoiceController = require('../controllers/invoiceController');

    app.route('/supplier')
    .get(supplierReq.get_all_suppliers)
    .post(supplierReq.add_new_supplier);

    // app.route('/updateSupplier')
    // .get(supplierReq.update_supplier)  

    app.route('/invoice')
    .get(invoiceController.get_invoices)
    .post(invoiceController.add_new_invoice);
    
    app.route('/searchInvoiceByRef')
    .post(invoiceController.get_invoices_by_ref_number);

    app.route('/store')
    .post(storeReq.add_new_store)
    .get(storeReq.get_all_stores)
    // .put(supplierReq.update_a_supplier)
    // .delete(supplierReq.delete_a_supplier);

    app.route('/getStoreBankAccount')
    .post(storeReq.get_store_bank_acc)

    app.route('/starting_amount')
    .post(storeReportReq.get_store_starting_amount)

    app.route('/getStoreReport')
    .post(storeReportReq.get_report_by_store)
    
    app.route('/getStoreReportDetail')
    .post(storeReportReq.get_store_report_details)

    app.route('/addNewstoreReport')
    .post(storeReportReq.add_new_store_report)
    .get(storeReq.get_all_stores)
    
    app.route('/getStoreBankAcc')
    .post(storeBankAccReq.get_store_bankAcc)

    app.route('/getStoreBankAccFilter')
    .post(storeBankAccReq.get_store_bankAcc_filter)
    
    app.route('/check')
    .post(checkReq.add_new_check)
    .get(checkReq.get_checks)
    
    app.route('/getCheckById')
    .get(checkReq.get_check_by_id)

    app.route('/updateCheck')
    .post(checkReq.update_check)
    
    app.route('/searchCheck')
    .post(checkReq.search_check)

    app.route('/searchCheckFilter')
    .post(checkReq.search_with_filter)
}