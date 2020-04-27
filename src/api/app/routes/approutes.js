'use strict';

module.exports = function(app){
    var store_controller = require('../controllers/storeController');
    var supplier_controller = require('../controllers/supplierController');
    var store_entry_controller = require('../controllers/storeEntryController');
    var check_controller = require('../controllers/checkController');

    app.route('/store')
    .post(store_controller.add_new_store)
    .get(store_controller.get_all_stores)

    app.route('/supplier')
    .post(supplier_controller.add_new_supplier)
    app.route('/supplier')
    .get(supplier_controller.get_suppliers)

    app.route('/starting_amount')
    .post(store_entry_controller.get_store_starting_amount)

    app.route('/add_new_store_entry')
    .post(store_entry_controller.add_new_store_entry)
    .get(store_controller.get_all_stores)

    app.route('/add_new_exp_check')
    .post(check_controller.add_new_exp_check)
}