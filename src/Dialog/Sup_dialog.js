import React, {useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import './Sup_dialog.css';
import $ from 'jquery';
import Global_services from '../Global_services/Global_services';
import axios from 'axios';
import Swal from 'sweetalert2';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import moment from 'moment';
const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Sup_dialog(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const handleClose = () => {setOpen(false);};
    const handleClickOpen = () => {
      setOpen(true);
      get_supplier_account();
    };

    useEffect(()=>{
     
    },[]);
    const [loader,set_loader] = useState(false);
    const [supplier_invoices,set_supplier_invoices] = useState([]);
    const [supplier_checks,set_supplier_checks] = useState([]);
    const get_supplier_account = () =>{
      set_loader(true);
      var supplier_data={'supplier_id':props.supplier_data.supplier_id};
      axios.post(Global_services.get_supplier_account,supplier_data).then(
        response => {
          set_loader(false);
            var res=response.data;
            console.log(res)
            res[0].map(el => {
              let date = moment(new Date(el.invoice_date));
              el.invoice_date = date.format("DD/MM/YYYY")
            })
            set_supplier_invoices(res[0]);
            res[1].map(el => {
              let date = moment(new Date(el.check_date));
              el.check_date = date.format("DD/MM/YYYY")
            })
            set_supplier_checks(res[1]);
        },error =>{
            set_loader(false);
            console.log(error);
            Swal.fire({
                title: 'Error!',
                text: 'Please Contact your software developer',
                icon: 'error',
                confirmButtonText: 'OK'
            })
        }
      )
    }

    return (
      <div className='dialog-details'>
        <span className='open-dialog' variant="outlined" color="primary" onClick={handleClickOpen}> <OpenInNewIcon /> Open </span>
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>

              <Typography variant="h6" className={classes.title}>
                  
              </Typography>

              <Typography variant="h6" className={classes.title}>
              <div className='supplier-header-data'>{props.supplier_data.supplier_name} - <span className='supplier-amount'>{props.supplier_data.supplier_amount.toLocaleString()}</span></div>
              </Typography>
            </Toolbar>
          </AppBar>
         {
           !loader ? 
            <Container className='supp-acc-container'>
              <Row>
                <Col>
                
                  <table className='table table-bordered table-dark table-striped table-hover'>
                    <tr>
                      <th>Invoice Number</th>
                      <th>Invoice Amount</th>
                      <th>Invoice Date</th>
                    </tr>
                    {
                      supplier_invoices.map((el,index) => {
                        return <tr key={index}>
                                <td>{el.invoice_number}</td>
                                <td>{el.invoice_amount}</td>
                                <td>{el.invoice_date}</td>
                              </tr>
                      })
                    }
                  </table>
                </Col>
      
                <Col>
                  <table className='table table-bordered table-striped table-hover'>
                    <tr>
                      <th>Check Number</th>
                      <th>Check Amount</th>
                      <th>Check Date</th>
                    </tr>
                    {
                      supplier_checks.map((el,index) => {
                        return <tr key={index}>
                                <td>{el.check_number}</td>
                                <td>{el.check_amount}</td>
                                <td>{el.check_date}</td>
                              </tr>
                      })
                    }
                  </table>
                </Col>
              </Row>
            </Container>
           : Global_services.show_spinner('grow',8,'success')
         }
         
        </Dialog>
      </div>
    );
}
export default Sup_dialog;
