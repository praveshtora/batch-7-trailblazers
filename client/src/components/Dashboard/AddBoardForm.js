import React, { Fragment, useState } from "react";
import "./../../App.css";
import { TextField, Chip, Avatar, Grid } from "@material-ui/core";
import Button from "./../Button/Button";
import Icon from "@material-ui/core/Icon";

export default function AddBoardForm(props) {
  const [name, setName] = useState("");
  const [lifecycle, setLifecycle] = useState("");
  const [lifecycles, setLifecycles] = useState([]);
  const [error, setError] = useState({ message: "", show: false });

  const addLifecycle = function() {
    if (!lifecycle) {
      return;
    }

    if (lifecycles.indexOf(lifecycle.toLowerCase()) === -1) {
      setLifecycles([...lifecycles, lifecycle.toLowerCase()]);
      setLifecycle("");
    } else {
      setError({ message: "already exists", show: true });
      setTimeout(() => {
        setError({ message: "", show: false });
      }, 3000);
    }
  };

  const deleteLifecycyle = index => {
    const lifeCyclesClone = Object.assign([], lifecycles);
    lifeCyclesClone.splice(index, 1);
    setLifecycles(lifeCyclesClone);
  };

  const onFormSave = event => {
    event.preventDefault();
    props.onSave({
      name,
      lifecycles
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
              id="lifecycle"
              label="Lifecycle"
              margin="normal"
              value={lifecycle}
              onChange={evt => {
                setError({ message: "", show: false });
                setLifecycle(evt.target.value);
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <Button onClick={addLifecycle}>
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
            {lifecycles.map((lifecycle, index) => {
              return (
                <Chip
                  avatar={<Avatar>{index + 1}</Avatar>}
                  label={lifecycle}
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
              disable={!name || lifecycles.length === 0}
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
