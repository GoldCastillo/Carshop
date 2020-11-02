import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

function AddCar(props) {
  const [car, setCar] = useState({
    brand: '',
    model: '',
    color: '',
    fuel: '',
    year: '',
    price: '',
  });
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    if (isNaN(car.price) || isNaN(car.year)) {
        alert("Price and year must be numbers!")
        
    }
    else {

        props.addCar(car);
    handleClose();
  }};

  const inputChanged = (event) => {
    setCar({ ...car, [event.target.name]: event.target.value });
  };

  return (
    <div>
      <Button variant='outlined' color='primary' onClick={handleClickOpen}>
        Add car
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>New car</DialogTitle>
        <DialogContent>
          <TextField
            margin='dense'
            name='brand'
            value={car.brand}
            onChange={inputChanged}
            label='Brand'
            fullWidth
          />
          <TextField
            margin='dense'
            name='model'
            value={car.model}
            onChange={inputChanged}
            label='Model'
            fullWidth
          />
          <TextField
            margin='dense'
            name='color'
            value={car.color}
            onChange={inputChanged}
            label='Color'
            fullWidth
          />
          <TextField
            margin='dense'
            name='fuel'
            value={car.fuel}
            onChange={inputChanged}
            label='Fuel'
            fullWidth
          />
          <TextField
            margin='dense'
            name='year'
            value={car.year}
            onChange={inputChanged}
            label='Year'
            fullWidth
          />
          <TextField
            margin='dense'
            name='price'
            value={car.price}
            onChange={inputChanged}
            label='Price'
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleSave} color='primary'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddCar;
