import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';
import LifeCycleColumn from '../LifeCycleColumn';
import { useSnackBar } from '../../customHooks';
import {SERVER_URL} from '../../config';

import { DragDropContext } from 'react-beautiful-dnd';
import './KanbanView.css';

const KanbanView = forwardRef(({ boardId }, ref) => {
  const [lifeCycles, setLifeCycles] = useState([]);
  const { openSnackBar } = useSnackBar();
  const showError = useCallback(message => openSnackBar('error', message), [
    openSnackBar
  ]);

  useImperativeHandle(ref, () => ({
    refreshBoard() {
      getBoards();
    }
  }));

  const requestToServer = (promise, onSuccess) => {
    (async () => {
      try {
        const res = await promise;

        if (!res || !res.data) throw new Error('No response from server');
        const { isSuccess, message, data } = res.data;
        if (!isSuccess) throw new Error(message);

        onSuccess(data);
      } catch (err) {
        if(!err.response) showError(err.message);

        const { message } = err.response.data;
        showError(message);
      }
    })();
  };

  const getBoards = () => {
    requestToServer(axios.get(`${SERVER_URL}/board/${boardId}`), data => {
      setLifeCycles(data.lifeCycles);
    });
  };

  useEffect(getBoards, []);

  const changeLifeCycle = async (id, finishLifeCycleName) => {
    requestToServer(
      axios.post(`/issue/changeLifeCycle`, {
        id,
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
    <LifeCycleColumn key={key} title={key} issues={value.issues} />
  ));

  return (
    <div className="KanbanView">
      <DragDropContext onDragEnd={onDragEnd}>
        {lifeCycleColumns}
      </DragDropContext>
    </div>
  );
});

export default KanbanView;
