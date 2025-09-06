import React from "react";
import { Card, Button } from "react-bootstrap";
import { EmojiFrown } from "react-bootstrap-icons";
import Styles from './Reviews.module.css'

const ReviewEmptyPage = () => {
  return (
    <Card className="text-center shadow-sm border-0 p-4 my-4">
      <Card.Body>
        <div className={Styles.emptyReviewsIcon}><i class="bi bi-emoji-frown"></i></div>

        <Card.Title>No Reviews Yet</Card.Title>
      </Card.Body>
    </Card>
  );
};

export default ReviewEmptyPage;
