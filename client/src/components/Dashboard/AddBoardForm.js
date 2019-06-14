import React, { Fragment, useState } from "react";
import "./../../App.css";
import { TextField, Chip, Avatar, Grid } from "@material-ui/core";
import Button from "./../Button/Button";
import Icon from "@material-ui/core/Icon";

export default function AddBoardForm(props) {
  const [name, setName] = useState("");
  const [lifeCycle, setLifeCycle] = useState("");
  const [lifeCycles, setLifeCycles] = useState([]);
  const [error, setError] = useState({ message: "", show: false });

  const addLifeCycle = function() {
    if (!lifeCycle) {
      return;
    }

    if (lifeCycles.indexOf(lifeCycle.toLowerCase()) === -1) {
      setLifeCycles([...lifeCycles, lifeCycle.toLowerCase()]);
      setLifeCycle("");
    } else {
      setError({ message: "already exists", show: true });
      setTimeout(() => {
        setError({ message: "", show: false });
      }, 3000);
    }
  };

  const deleteLifecycyle = index => {
    const lifeCyclesClone = Object.assign([], lifeCycles);
    lifeCyclesClone.splice(index, 1);
    setLifeCycles(lifeCyclesClone);
  };

  const onFormSave = event => {
    event.preventDefault();
    props.onSave({
      name,
      lifeCycles
    });
  };

  return (
    <Fragment>
      <form onSubmit={onFormSave} noValidate>
        <Grid container>
          <Grid item xs={12}>
            <TextField
              id="name"
              label="Name"
              margin="normal"
              fullWidth
              value={name}
              onChange={evt => {
                setName(evt.target.value);
              }}
              required
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={10}>
            <TextField
              id="lifeCycle"
              label="LifeCycle"
              margin="normal"
              value={lifeCycle}
              onChange={evt => {
                setError({ message: "", show: false });
                setLifeCycle(evt.target.value);
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <Button onClick={addLifeCycle}>
              <Icon>add</Icon>
            </Button>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            {error.show ? (
              <label className="eror-msg">{error.message}</label>
            ) : (
              ""
            )}
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            {lifeCycles.map((lifeCycle, index) => {
              return (
                <Chip
                  avatar={<Avatar>{index + 1}</Avatar>}
                  label={lifeCycle}
                  onDelete={() => {
                    deleteLifecycyle(index);
                  }}
                  color="primary"
                  variant="outlined"
                  key={index}
                  style={{ margin: "5px" }}
                />
              );
            })}
          </Grid>
        </Grid>
        <div style={{ marginTop: "10px" }}>
          <div className="float-right">
            <Button
              type="submit"
              loading={props.isSaving}
              disable={!name || lifeCycles.length === 0}
            >
              Save
            </Button>
          </div>
          <div className="float-right">
            <Button onClick={props.onClose}>Close</Button>
          </div>
        </div>
      </form>
    </Fragment>
  );
}
