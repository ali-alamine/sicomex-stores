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
import './Sup_dialog.css';
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
function Sup_dialog(props) {

    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {setOpen(true);};
    const handleClose = () => {setOpen(false);};

    useEffect(() => {
      props.open_dialog(handleClickOpen);
    },[])

    return (
      <div className='dialog-details' onClick={handleClickOpen}>
        {/* <span variant="outlined" color="primary" onClick={handleClickOpen}> <AspectRatioIcon /> </span> */}
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>

              <Typography variant="h6" className={classes.title}>
                {/* {props.action_name} */}
              </Typography>

              <Typography variant="h6" className={classes.title}>
                {/* {total_amount.toLocaleString()} */}
              </Typography>

            </Toolbar>
          </AppBar>
         
        </Dialog>
      </div>
    );
}
export default Sup_dialog;