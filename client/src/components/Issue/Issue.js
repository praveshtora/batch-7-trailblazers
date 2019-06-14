import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import { Draggable } from 'react-beautiful-dnd';
import CardContent from '@material-ui/core/CardContent';
import CommentOutlined from '@material-ui/icons/CommentOutlined';
import { makeStyles } from '@material-ui/core/styles';
import './Issue.css';

const useStyles = makeStyles(theme => ({
  ContentWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 16,
    '&:last-child': {
      paddingBottom: 16
    }
  },
  icon: {
    fontSize: 18,
    color: theme.palette.primary.light
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

const Issue = ({ issue = {}, index }) => {
  const { id, title, comments } = issue;

  const { ContentWrapper, icon } = useStyles();

  return (
    <DraggableContainer id={id} index={index}>
      <Card className="issue-card">
        <CardContent className={ContentWrapper}>
          <span>{title}</span>
          <Box display="flex">
            <CommentOutlined className={icon} />
            {comments}
          </Box>
        </CardContent>
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
