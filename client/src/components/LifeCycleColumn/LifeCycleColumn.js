import React from 'react';
import Issue from '../Issue';
import { Typography } from '@material-ui/core';
import { Droppable } from 'react-beautiful-dnd';
import { makeStyles } from '@material-ui/core/styles';
import './LifeCycleColumn.css';

const useStyles = makeStyles(theme => ({
  header: {
    backgroundColor: theme.palette.primary.main,
    padding: '8px',
    color: '#ffffff'
  },
  IssuesContainer: {
    height: '100%'
  }
}));

const IssueList = React.memo(({ issues, ...rest }) =>
  issues.map((issue, index) => (
    <Issue key={issue.id} issue={issue} index={index} {...rest} />
  ))
);

const DroppableContainer = ({ id, children, className = '' }) => (
  <Droppable droppableId={id}>
    {({ innerRef, droppableProps, placeholder }) => (
      <div className={className} ref={innerRef} {...droppableProps}>
        {children}
        {placeholder}
      </div>
    )}
  </Droppable>
);

const LifeCycleColumn = ({ title, issues = [], ...rest }) => {
  const { header, IssuesContainer } = useStyles();
  return (
    <div className="LifeCycleColumn">
      <Typography variant="h6" className={header}>
        {title}
      </Typography>
      <DroppableContainer className={IssuesContainer} id={title}>
        <IssueList issues={issues} {...rest} />
      </DroppableContainer>
    </div>
  );
};

export default LifeCycleColumn;
