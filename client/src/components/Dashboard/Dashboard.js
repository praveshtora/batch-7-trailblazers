import React, { Fragment, useEffect, useState } from 'react';
import Board from './Board';
import { Typography, Grid, Box } from '@material-ui/core';
import { SERVER_URL } from '../../config';
import AddBoardModel from '../CommonComponents/Modal';
import AddBoardForm from './AddBoardForm';
import axios from 'axios';
import { useSnackBar } from '../../customHooks';
import theme from '../../theme';

const PRIMARY_MAIN = theme.palette.primary.main;

const BoardsContainer = ({
  title,
  boardList,
  afterClick,
  showCreateNew = false,
  onCreateNewClick = () => {}
}) => (
  <>
    <Grid container>
      <Grid item xs={12}>
        <h2 style={{ marginLeft: '24px' }}>{title}</h2>
      </Grid>
    </Grid>
    <Grid container>
      <Grid item xs={12}>
        {showCreateNew && (
          <Board
            showAction={false}
            backgroundColor="grey"
            afterClick={onCreateNewClick}
          >
            <Typography
              variant="h6"
              className="text-align-center text-color-white"
            >
              Create Board
            </Typography>
          </Board>
        )}
        {boardList.map((board, index) => (
          <Board
            key={board.id}
            showAction={true}
            backgroundColor={PRIMARY_MAIN}
            afterClick={() => afterClick(board.id)}
          >
            <Box display="flex" flexDirection="column" alignItems="center">
              <label className="labelId">#{board.id}</label>
              <Typography
                variant="h6"
                className="text-color-white"
              >
                {board.name}
              </Typography>
            </Box>
          </Board>
        ))}
      </Grid>
    </Grid>
  </>
);

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
        const result = await axios(`${SERVER_URL}/dashboard/getboards`, {
          method: 'get',
          withCredentials: true,
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
          const { message } = error.response.data;
          openSnackBar('error', message);
        }
      }
    })();
  }

  const showAddBoardModel = () => setOpenAddModel(true);
  const goToBoard = boardId => props.history.push(`/boarddetails/${boardId}`);
  const handleModalClose = () => setOpenAddModel(!openAddModel);
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
      <BoardsContainer
        title="Owns"
        boardList={ownBoards}
        afterClick={goToBoard}
        showCreateNew={true}
        onCreateNewClick={showAddBoardModel}
      />
      {otherBoards.length > 0 && (
        <BoardsContainer
          title="Collaborating"
          boardList={otherBoards}
          afterClick={goToBoard}
        />
      )}

      <AddBoardModel
        open={openAddModel}
        handleClose={handleModalClose}
        width="450px"
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
