import { Card, Button } from "react-bootstrap";
import React from "react";

const SinglePost = (post: any) => {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>{post.title}</Card.Title>
        <Card.Text>{post.body}</Card.Text>
        <Button variant="primary">See</Button>
      </Card.Body>
    </Card>
  );
};
export default SinglePost;
