import React, { useState, useEffect } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import { Draggable } from 'react-beautiful-dnd';
import CardContent from '@material-ui/core/CardContent';
import CommentOutlined from '@material-ui/icons/CommentOutlined';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import './Issue.css';

const useStyles = makeStyles(theme => ({
  ContentWrapper: {
    padding: 16,
    '&:last-child': {
      paddingBottom: 16
    }
  },
  icon: {
    fontSize: 18,
    padding: '0 4px',
    color: theme.palette.primary.light
  },
  dueDateProgress: {
    padding: theme.spacing(1)
  },
  dueDateStyle: {
    position: 'absolute',
    right: 8,
    zIndex: 1,
    margin: 0,
    fontWeight: 400
  }
}));

const DraggableContainer = ({ id, index, children }) => (
  <Draggable draggableId={id} index={index}>
    {({ dragHandleProps, draggableProps, innerRef }) => (
      <div
        className="draggable-container"
        {...draggableProps}
        {...dragHandleProps}
        ref={innerRef}
      >
        {children}
      </div>
    )}
  </Draggable>
);

const Issue = ({ issue = {}, index, openModalIssueDetails }) => {
  const { id, title, comments, dueDate } = issue;

  const { ContentWrapper, icon, dueDateProgress, dueDateStyle } = useStyles();
  const [percentage, setPercentage] = useState(0);
  const [dueDateText, setDueDateText] = useState('');

  const findPercentage = () => {
    const created_at = '2019-06-19T05:00:27.871Z';
    const startDate = moment(created_at);
    const endDate = moment(dueDate);
    const today = moment();
    setDueDateText('due ' + endDate.fromNow());

    const totalDuration = moment.duration(endDate.diff(startDate));
    const completedDuration = moment.duration(today.diff(startDate));
    const diffInPercentage =
      (completedDuration.asMilliseconds() / totalDuration.asMilliseconds()) *
      100;

    setPercentage(diffInPercentage);
  };

  useEffect(findPercentage, [issue]);

  return (
    <DraggableContainer id={id} index={index}>
      <Card className="issue-card" onClick={() => openModalIssueDetails(id)}>
        <CardContent className={ContentWrapper}>
          <span className="issue-title">{title}</span>
          <div className="actions">
            <Box display="flex">
              <CommentOutlined className={icon} />
              {comments}
            </Box>
          </div>
        </CardContent>
        <h5 className={dueDateStyle}>{dueDateText}</h5>
        <LinearProgress
          variant="determinate"
          color="secondary"
          className={dueDateProgress}
          value={percentage}
        />
      </Card>
    </DraggableContainer>
  );
};

Issue.propTypes = {
  issue: PropTypes.shape({
    title: PropTypes.string
  }).isRequired,
  index: PropTypes.number.isRequired
};

export default Issue;
