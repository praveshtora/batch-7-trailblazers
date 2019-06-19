import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';
import { SERVER_URL } from '../../config';
import LifeCycleColumn from '../LifeCycleColumn';
import { useSnackBar } from '../../customHooks';
import { requestToServer } from '../../util/helper';
import { DragDropContext } from 'react-beautiful-dnd';
import Modal from '@material-ui/core/Modal';
import IssueDetails from '../../components/IssueDetails/IssueDetails';
import './KanbanView.css';

const KanbanView = forwardRef(({ boardId }, ref) => {
  const [lifeCycles, setLifeCycles] = useState([]);
  const { openSnackBar } = useSnackBar();
  const showError = useCallback(message => openSnackBar('error', message), [
    openSnackBar
  ]);

  const [issueId, setIssueId] = useState();
  const [openIssueDetails, setOpenIssueDetails] = useState(false);
  useImperativeHandle(ref, () => ({
    refreshBoard() {
      getBoards();
    }
  }));

  const openModalIssueDetails = id => {
    setIssueId(id);
    setOpenIssueDetails(true);
  };
  const onIssueModalClose = () => setOpenIssueDetails(false);

  const getBoards = () => {
    requestToServer(
      axios.get(`${SERVER_URL}/board/${boardId}`),
      data => {
        setLifeCycles(data.lifeCycles);
      },
      showError
    );
  };

  useEffect(getBoards, []);

  const changeLifeCycle = async (id, finishLifeCycleName) => {
    requestToServer(
      axios({
        method: 'post',
        url: `${SERVER_URL}/issue/changeLifeCycle`,
        data: {
          id,
          lifeCycle: finishLifeCycleName
        },
        withCredential: true,
      }),
      getBoards,
      showError
    );
  };

  const onDragEnd = result => {
    const { source, destination } = result;
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const startLifeCycleName = source.droppableId;
    const finishLifeCycleName = destination.droppableId;

    if (startLifeCycleName !== finishLifeCycleName) {
      const startLifeCycle = lifeCycles[startLifeCycleName].issues;
      const startIssues = Array.from(startLifeCycle);
      const issue = startIssues[source.index];
      startIssues.splice(source.index, 1);

      const finishLifeCycle = lifeCycles[finishLifeCycleName].issues;
      const finishIssues = Array.from(finishLifeCycle);
      finishIssues.push(issue);

      setLifeCycles({
        ...lifeCycles,
        [startLifeCycleName]: startIssues,
        [finishLifeCycleName]: finishIssues
      });

      changeLifeCycle(issue.id, finishLifeCycleName);
    }
  };

  const lifeCycleColumns = Object.entries(lifeCycles).map(([key, value]) => (
    <LifeCycleColumn
      key={key}
      title={key}
      issues={value.issues}
      openModalIssueDetails={openModalIssueDetails}
    />
  ));

  return (
    <>
      <div className="KanbanView">
        <DragDropContext onDragEnd={onDragEnd}>
          {lifeCycleColumns}
        </DragDropContext>
      </div>

      <Modal
        aria-labelledby="issue-details"
        aria-describedby="issue-details"
        open={openIssueDetails}
        onClose={onIssueModalClose}
      >
        <div className="issueDetails-container">
          {openIssueDetails && (
            <IssueDetails issueId={issueId} onClose={onIssueModalClose} />
          )}
        </div>
      </Modal>
    </>
  );
});

export default KanbanView;
