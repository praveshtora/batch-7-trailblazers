import React, { Fragment } from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import "./../../App.css";

export default function Board({
  backgroundColor,
  className,
  afterClick,
  showAction,
  children
}) {
  return (
    <Fragment>
      <Card
        style={{ backgroundColor: backgroundColor }}
        className={`board  ${className || ""}`}
        onClick={afterClick}
      >
        <CardContent>{children}</CardContent>
        {showAction ? (
          <CardActions style={{ justifyContent: "center" }}>
            <Button size="small">View Board</Button>
          </CardActions>
        ) : (
          ""
        )}
      </Card>
    </Fragment>
  );
}
