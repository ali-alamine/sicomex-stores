import React from 'react';
var is_prod=true;
var is_running_locally=false;
var base_url ='';
base_url= is_prod ? 'http://ec2-35-153-50-38.compute-1.amazonaws.com:4000' : 'localhost:4000';


class Global_services extends React.Component {

    static get_store_api= base_url+'/store';
    static get_starting_amount= base_url+'/starting_amount';
    static add_new_store_entry= base_url+'/add_new_store_entry';
}

export default Global_services;