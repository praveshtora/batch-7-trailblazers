import React, { Fragment, useEffect, useState } from 'react';
import Board from './Board';
import './../../App.css';
import { Typography, Grid } from '@material-ui/core';
import { SERVER_URL } from './../../config';
import AddBoardModel from '../CommonComponents/Modal';
import AddBoardForm from './AddBoardForm';
import axios from 'axios';
import { useSnackBar } from './../../customHooks';
import AppMenu from '../AppMenu/AppMenu';

export default function Dashboard(props) {
  const [openAddModel, setOpenAddModel] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [ownBoards, setOwnBoards] = useState([]);
  const [otherBoards, setOtherBoards] = useState([]);
  const { openSnackBar } = useSnackBar();

  useEffect(fetchBoardList, []);

  function fetchBoardList() {
    (async () => {
      try {
        const result = await axios(`${SERVER_URL}/dashboard/getboards`,{
          method :'get',
          withCredentials:true,
          headers: { 'Content-Type': 'application/json' }
        });
        const boards = result.data.data;        

        if (result.data.isSuccess) {
          const { ownBoards = [], otherBoards = [] } = boards;
          setOwnBoards(ownBoards);
          setOtherBoards(otherBoards);
        } else {
          setOwnBoards([]);
          setOtherBoards([]);
        }
      } catch (error) {
        if (error.response) {
          const { isSuccess, message } = error.response.data;
          openSnackBar('error', message);
        }
      }
    })();
  }

  function showAddBoardModel() {
    setOpenAddModel(true);
  }

  function goToBoard(boardId) {
    props.history.push(`/boarddetails/${boardId}`);
  }

  const handleModalClose = function() {
    setOpenAddModel(!openAddModel);
  };

  const handleBoardSaveClick = function(data) {
    setIsSaving(true);
    saveBoardData(data);
  };

  async function saveBoardData(data) {
    try {
      const result = await axios({
        url: `${SERVER_URL}/dashboard/add`,
        method: 'post',
        data,
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      const { isSuccess, message } = result.data;
      if (isSuccess) {
        setIsSaving(false);
        openSnackBar('success', message);
        handleModalClose();
        fetchBoardList();
      } else {
        openSnackBar('error', message);
      }
    } catch (error) {
      setIsSaving(false);
      if (error.response) {
        const { isSuccess, message } = error.response.data;
        if (!isSuccess) {
          openSnackBar('error', message);
        }
      }
      console.log(error);
    }
  }

  return (
    <Fragment>
      <AppMenu title="Dashboard"></AppMenu>
      <Grid container>
        <Grid item xs={12}>
          <h3>Personal</h3>
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
              afterClick={() => goToBoard(board.id)}
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
              <h3>Others</h3>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              {otherBoards.map((board, index) => (
                <Board
                  key={index}
                  showAction={true}
                  backgroundColor="#76a1e8"
                  afterClick={() => goToBoard(board.id)}
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
        ''
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
