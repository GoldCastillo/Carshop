import React, { useState, useEffect, useRef } from 'react';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import AddCar from './AddCar.js'


function Carlist() {
  const [cars, setCars] = useState([]);
  const gridRef = useRef();
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    getCars();
  }, [])

  const deleteCar = (link) => {
    if (window.confirm('Are you sure?')) {
      fetch(link, {
        method: 'DELETE',
      })
        .then((_) => gridRef.current.refreshCells({ rowNodes: getCars() }))
        .then((_) => setOpen(true))
        .catch((err) => console.error(err));
    }
  };

  const addCar = (newCar) => {
    fetch('https://carstockrest.herokuapp.com/cars', {
    method: 'POST',
    headers: {'Content-type' : 'application/json'},
    body: JSON.stringify(newCar)
})
  .then(_ => gridRef.current.refreshCells({rowNodes: getCars()})) 
  .catch(err => console.error(err))
}
  const closeSnackbar = () => {
    setOpen(false);
  };

  const getCars = () => {
    fetch('https://carstockrest.herokuapp.com/cars')
      .then((response) => response.json())
      .then((data) => setCars(data._embedded.cars))
      .catch((err) => console.error(err));
  };

  const columns = [
    { headerName: 'Brand', field: 'brand', sortable: true, filter: true },
    { headerName: 'Model', field: 'model', sortable: true, filter: true },
    { headerName: 'Color', field: 'color', sortable: true, filter: true },
    { headerName: 'Fuel', field: 'fuel', sortable: true, filter: true },
    { headerName: 'Year', field: 'year', sortable: true, filter: true },
    { headerName: 'Price', field: 'price', sortable: true, filter: true },
    {
      headerName: '',
      field: '_links.self.href',
      width: 90,
      cellRendererFramework: (params) => (
        <Button
          color='secondary'
          size='small'
          onClick={() => deleteCar(params.value)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
      <div>
          <AddCar addCar={addCar}/>
    <div
      className='ag-theme-material'
      style={{ height: '700px', width: '70%', margin: 'auto' }}
    >
      <AgGridReact
        ref={gridRef}
        suppressCellSelection={true}
        onGridReady={params => {
          gridRef.current = params.api
        }}
        columnDefs={columns}
        rowData={cars}
        pagination='true'
        paginationPageSize='10'
      ></AgGridReact>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        message='Car deleted succesfully'
        action={
          <React.Fragment>
            <IconButton
              size='small'
              aria-label='close'
              color='inherit'
              onClick={closeSnackbar}
            >
              <CloseIcon fontSize='small' />
            </IconButton>
          </React.Fragment>
        }
      />
    </div></div>
  );
}

export default Carlist;
