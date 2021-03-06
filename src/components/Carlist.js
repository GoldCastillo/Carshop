import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Alert from "@material-ui/lab/Alert";
import EditCar from "./EditCar.js";
import AddCar from "./AddCar.js";
import {ExportCSV} from "./ExportCsv"
import ExcelColumn from "react-data-export/dist/ExcelPlugin/elements/ExcelColumn";

function Carlist() {
  const [cars, setCars] = useState([]);
  const gridRef = useRef();
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);
  const [updateOpen, setUpdateOpen] = React.useState(false);
  const excel = "CarsExcel"
  useEffect(() => {
    getCars();
  }, []);

  const deleteCar = (link) => {
    if (window.confirm("Are you sure?")) {
      fetch(link, { method: "DELETE" })
        .then((_) => gridRef.current.refreshCells({ rowNodes: getCars() }))
        .then((_) => setDeleteOpen(true))
        .catch((err) => console.error(err));
    }
  };

  const updateCar = (car, link) => {
    fetch(link, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(car),
    })
      .then((_) => gridRef.current.refreshCells({ rowNodes: getCars() }))
      .then((_) => setUpdateOpen(true))
      .catch((err) => console.error(err));
  };

  const addCar = (newCar) => {
    fetch("https://carstockrest.herokuapp.com/cars", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(newCar),
    })
      .then((_) => gridRef.current.refreshCells({ rowNodes: getCars() }))
      .then((_) => setAddOpen(true))
      .catch((err) => console.error(err));
  };
  const closeSnackbar = () => {
    setDeleteOpen(false);
    setAddOpen(false);
    setUpdateOpen(false);
  };

  const getCars = () => {
    fetch("https://carstockrest.herokuapp.com/cars")
      .then((response) => response.json())
      .then((data) => setCars(data._embedded.cars))
      .catch((err) => console.error(err));
  };

  const columns = [
    { headerName: "Brand", field: "brand", sortable: true, filter: true },
    { headerName: "Model", field: "model", sortable: true, filter: true },
    { headerName: "Color", field: "color", sortable: true, filter: true },
    { headerName: "Fuel", field: "fuel", sortable: true, filter: true },
    { headerName: "Year", field: "year", sortable: true, filter: true },
    { headerName: "Price", field: "price", sortable: true, filter: true },
    {
      headerName: "",
      width: 90,
      cellRendererFramework: (row) => (
        <EditCar updateCar={updateCar} car={row.data} />
      ),
    },
    {
      headerName: "",
      field: "_links.self.href",
      width: 90,
      cellRendererFramework: (params) => (
        <Button
          color="secondary"
          size="small"
          onClick={() => console.log(params.value)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div>
      <AddCar addCar={addCar} />
      
      <div
        className="ag-theme-material"
        style={{ height: "700px", width: "70%", margin: "auto" }}
      >
        <AgGridReact
          ref={gridRef}
          suppressCellSelection={true}
          onGridReady={(params) => {
            gridRef.current = params.api;
          }}
          columnDefs={columns}
          rowData={cars}
          pagination="true"
          paginationPageSize="10"
        ></AgGridReact>
        <Snackbar
          open={deleteOpen}
          autoHideDuration={3000}
          onClose={closeSnackbar}
        >
          <Alert
            severity="success"
            elevation={5}
            variant="filled"
            action={
              <React.Fragment>
                <IconButton
                  size="small"
                  aria-label="close"
                  onClick={closeSnackbar}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          >
            Delete was successful!
          </Alert>
        </Snackbar>
        <Snackbar
          open={updateOpen}
          autoHideDuration={3000}
          onClose={closeSnackbar}
        >
          <Alert
            severity="success"
            elevation={5}
            variant="filled"
            action={
              <React.Fragment>
                <IconButton
                  size="small"
                  aria-label="close"
                  onClick={closeSnackbar}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          >
            Update was successful!
          </Alert>
        </Snackbar>
        <Snackbar
          open={addOpen}
          autoHideDuration={3000}
          onClose={closeSnackbar}
        >
          <Alert
            severity="success"
            elevation={5}
            variant="filled"
            action={
              <React.Fragment>
                <IconButton
                  size="small"
                  aria-label="close"
                  onClick={closeSnackbar}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          >
            Add was successful!
          </Alert>
        </Snackbar>
      </div>
      <ExportCSV csvData={cars} fileName={excel}/>
    </div>
  );
}

export default Carlist;
