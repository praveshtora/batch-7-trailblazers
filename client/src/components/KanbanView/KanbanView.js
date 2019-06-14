import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import LifeCycleColumn from '../LifeCycleColumn';
import { useSnackBar } from '../../customHooks';
import { DragDropContext } from 'react-beautiful-dnd';
import './KanbanView.css';

const KanbanView = ({ boardId }) => {
  const [lifeCycles, setLifeCycles] = useState([]);
  const { openSnackBar } = useSnackBar();
  const showError = useCallback(message => openSnackBar('error', message), [
    openSnackBar
  ]);

  const requestToServer = (promise, onSuccess) => {
    (async () => {
      try {
        const res = await promise;

        if (!res || !res.data) throw new Error('No response from server');
        const { isSuccess, message, data } = res.data;
        if (!isSuccess) throw new Error(message);

        onSuccess(data);
      } catch (err) {
        showError(err.message);
      }
    })();
  };

  const getBoards = () => {
    requestToServer(axios.get(`/board/${boardId}`), data => {
      setLifeCycles(data.lifeCycles);
    });
  };

  useEffect(getBoards, []);

  const changeLifeCycle = async (_id, finishLifeCycleName) => {
    requestToServer(
      axios.post(`/issue/changeLifeCycle`, {
        _id,
        lifeCycle: finishLifeCycleName
      }),
      getBoards
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

    const finishLifeCycleName = destination.droppableId;

    const startLifeCycleName = source.droppableId;
    const startLifeCycle = lifeCycles[startLifeCycleName].issues;
    const startIssues = Array.from(startLifeCycle);
    const issue = startIssues[source.index];

    if (startLifeCycleName !== finishLifeCycleName) {
      const { _id } = issue;
      changeLifeCycle(_id, finishLifeCycleName);
    }
  };

  const lifeCycleColumns = Object.entries(lifeCycles).map(([key, value]) => (
    <LifeCycleColumn key={key} title={key} issues={value.issues} />
  ));

  return (
    <div className="KanbanView">
      <DragDropContext onDragEnd={onDragEnd}>
        {lifeCycleColumns}
      </DragDropContext>
    </div>
  );
};

export default KanbanView;
