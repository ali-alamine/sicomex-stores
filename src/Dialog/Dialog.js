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
import AddBoxIcon from '@material-ui/icons/AddBox';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import './Dialog.css';
import $ from 'jquery';
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
var detailsProps = [
  {'text':'text1','amount':'100'},
  {'text':'text2','amount':'200'}
]
function FullScreenDialog(props) {

    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {setOpen(true);};
    const handleClose = () => {setOpen(false); props.calc()};
    useEffect(() => {
      setTimeout(function (){
        $('#text0').focus();
      },500)
     
    },[open])
    /* START - ADD NEW ROW */
    const [details_data,set_details_data]=useState([
      {'text':'','amount':0}
    ])
    const add_new_row = () => {
      set_details_data([...details_data,{'text':'','amount':0}]);
      var index=details_data.length;
      let textId='#text'+index;
      console.log(textId)
      setTimeout(function(){
        $(textId).focus();
      },100)
    }
    const details_handler = (e, index) => {
      const items = [...details_data];
      items[index][e.target.name] = e.target.value;
      set_details_data(items);

      if(props.view=='supply'){
        props.cash_supply_details(items);
        if(e.target.name=='amount'){
          if(!e.target.value) e.target.value=0;
          var sum = 0;
          $('.amount').each(function(){
            if(parseInt(this.value)){
              sum += parseInt(this.value);
          }else{
              sum += 0;
          }
          });
          set_total_amount(sum);
          props.get_supply_total_amount(sum);
        }
      }
      else if(props.view=='expense'){
        props.cash_expense_details(items);
        if(e.target.name=='amount'){
          var sum = 0;
          $('.amount').each(function(){
            if(parseInt(this.value)){
                sum += parseInt(this.value);
            }else{
                sum += 0;
            }
          });
          set_total_amount(sum);
          props.get_expense_total_amount(sum);
        }
      }
   }
    const submit_details = () =>{
      console.log(details_data)
    }
    /* END - ADD NEW ROW */

    const [total_amount,set_total_amount]=React.useState(0);
      useEffect(() => {
        if(details_data) {
            set_details_data(details_data);
        }
      }, [details_data])
    return (
      <div className='dialog-details'>
        <span variant="outlined" color="primary" onClick={handleClickOpen}> <AspectRatioIcon />
        </span>
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>

              <Typography variant="h6" className={classes.title}>
                {props.action_name}
              </Typography>

              <Typography variant="h6" className={classes.title}>
                {total_amount.toLocaleString()}
              </Typography>

            </Toolbar>
          </AppBar>
          <List>
          {
            details_data.map((el,index) => {
              let textId='text'+index;
              let amountId='amount'+index;
              return (
                  <div key={index}>
                    <ListItem>
                      <div className='col-md-12 row'>
                          <input name='text' id={textId} value={el.text} onChange={(e) => details_handler(e, index)} className='form-control text-details col-md-9' placeholder='Type details here..'/>
                          <input name='amount' value={el.amount} onChange={(e) => details_handler(e, index)} className='amount form-control amount-details col-md-3' type='number' placeholder='Amount'/>
                      </div>
                    </ListItem>
                  </div>
                  );
            })

          }
            <AddBoxIcon onClick={add_new_row} className='add-new-row btn btn-light'/>
            <Divider />

            {/* <Button className='submit-details' variant="contained" color="primary" onClick={submit_details}>
              Submit
            </Button> */}

          </List>
        </Dialog>
      </div>
    );
}
export default FullScreenDialog;
