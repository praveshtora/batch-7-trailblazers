import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef
} from 'react';
import axios from 'axios';
import { SERVER_URL } from '../../config';
import LifeCycleColumn from '../LifeCycleColumn';
import { useSnackBar } from '../../customHooks';
import { requestToServer } from '../../util/helper';
import { DragDropContext } from 'react-beautiful-dnd';
import Modal from '@material-ui/core/Modal';
import IssueDetails from '../../components/IssueDetails/IssueDetails';
import './KanbanView.css';

const KanbanView = forwardRef(({ boardId, setBoardName }, ref) => {
  const [lifeCycles, setLifeCycles] = useState([]);
  const { openSnackBar } = useSnackBar();
  const [boardMembers, setBoardMembers] = useState([]);

  const showError = message => openSnackBar('error', message);
  const showSuccess = message => openSnackBar('success', message);

  const [issueId, setIssueId] = useState();
  const [openIssueDetails, setOpenIssueDetails] = useState(false);
  useImperativeHandle(ref, () => ({
    refreshBoard() {
      getBoardsData();
    }
  }));

  const fetchBoardMembers = () => {
    requestToServer(
      axios(`${SERVER_URL}/board/members/${boardId}`, {
        withCredentials: true
      }),
      data => {
        const users = data.map(d => d.user && d.user.name);
        setBoardMembers(users);
      },
      message => openSnackBar('error', message)
    );
  };

  const openModalIssueDetails = id => {
    setIssueId(id);
    fetchBoardMembers();
    setOpenIssueDetails(true);
  };
  const onIssueModalClose = message => setOpenIssueDetails(false);

  const onUpdateIssue = message => {
    showSuccess(message);
    onIssueModalClose();
    getBoardsData();
  };

  const getBoardsData = () => {
    requestToServer(
      axios.get(`${SERVER_URL}/board/${boardId}`, { withCredentials: true }),
      data => {
        setLifeCycles(data.lifeCycles);
        setBoardName(data.name);
      },
      showError
    );
  };

  useEffect(getBoardsData, []);

  const changeLifeCycle = async (id, finishLifeCycleName) => {
    requestToServer(
      axios({
        method: 'post',
        url: `${SERVER_URL}/issue/changeLifeCycle`,
        data: {
          id,
          lifeCycle: finishLifeCycleName
        },
        withCredential: true
      }),
      getBoardsData,
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
        disableBackdropClick
        aria-labelledby="issue-details"
        aria-describedby="issue-details"
        open={openIssueDetails}
        onClose={onIssueModalClose}
      >
        <div className="issueDetails-container">
          {openIssueDetails && (
            <IssueDetails
              issueId={issueId}
              boardMembers={boardMembers}
              onClose={onIssueModalClose}
              onUpdateIssue={onUpdateIssue}
            />
          )}
        </div>
      </Modal>
    </>
  );
});

export default KanbanView;
