import React, { Fragment, useEffect, useState } from "react";
import Board from "./Board";
import "./../../App.css";
import { Typography, Grid } from "@material-ui/core";
import { SERVER_URL } from "./../../config";
import AddBoardModel from "../CommonComponents/Modal";
import AddBoardForm from "./AddBoardForm";
import axios from "axios";

export default function Dashboard(props) {
  const [openAddModel, setOpenAddModel] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [ownBoards, setOwnBoards] = useState([]);
  const [otherBoards, setOtherBoards] = useState([]);

  useEffect(() => {
    fetchBoardList();
  }, [fetchBoardList, props]);

  async function fetchBoardList() {
    try {
      const result = await axios("/dashboard/getboards",{
        method :'get',
        withCredentials:true,
        headers: { 'Content-Type': 'application/json' }
      });
      const boards = result.data.data;

      if (result.data.isSuccess) {
        const { ownBoards = [], otherBoards = [] } = boards;
        setOwnBoards(ownBoards);
        otherBoards(otherBoards);
      } else {
        setOwnBoards([]);
        otherBoards([]);
      }
    } catch (exception) {
      console.log(exception);
    }
  }

  function showAddBoardModel() {
    setOpenAddModel(true);
  }

  function goToBoard() {
    console.log("go to the board");
  }

  const handleModalClose = function() {
    setOpenAddModel(!openAddModel);
  };

  const handleBoardSaveClick = function(data) {
    setIsSaving(true);
    saveBoardData(data);
  };

  async function saveBoardData(data) {
    console.log(data);
    try {
      const result = await axios({
        url: `${SERVER_URL}/dashboard/add`,
        method: "post",
        data,
        headers: { "Content-Type": "application/json" }
      });

      if (result.isSuccess) {
        setIsSaving(false);
        handleModalClose();
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (exception) {
      console.log(exception);
    }
  }

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={12}>
          <h3 className="left-margin-25">Personal</h3>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Board
            showAction={false}
            backgroundColor="grey"
            afterClick={showAddBoardModel}
          >
            <Typography
              variant="h6"
              component="h2"
              className="text-align-center"
            >
              Create Board
            </Typography>
          </Board>
          {ownBoards.map((board, index) => (
            <Board
              key={index}
              showAction={true}
              backgroundColor="#76a1e8"
              afterClick={goToBoard}
            >
              <Typography
                variant="h6"
                gutterBottom
                className="text-color-white"
              >
                {board.name}
              </Typography>
            </Board>
          ))}
        </Grid>
      </Grid>
      {otherBoards.length > 0 ? (
        <div>
          <Grid container>
            <Grid item xs={12}>
              <h3 className="left-margin-25">Others</h3>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              {otherBoards.map((board, index) => (
                <Board
                  key={index}
                  showAction={true}
                  backgroundColor="#76a1e8"
                  afterClick={goToBoard}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    className="text-color-white"
                  >
                    {board.name}
                  </Typography>
                </Board>
              ))}
            </Grid>
          </Grid>
        </div>
      ) : (
        ""
      )}

      <AddBoardModel
        open={openAddModel}
        handleClose={handleModalClose}
        width="500px"
        title="Add Board"
      >
        <AddBoardForm
          onClose={handleModalClose}
          onSave={handleBoardSaveClick}
          isSaving={isSaving}
        />
      </AddBoardModel>
    </Fragment>
  );
}
