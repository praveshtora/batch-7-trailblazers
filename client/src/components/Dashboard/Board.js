import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import './../../App.css';

export default function Board({
  backgroundColor,
  className = '',
  afterClick,
  children
}) {
  return (
      <Card
        style={{ backgroundColor }}
        className={`board  ${className}`}
        onClick={afterClick}
      >
        <CardContent>{children}</CardContent>
      </Card>
  );
}
