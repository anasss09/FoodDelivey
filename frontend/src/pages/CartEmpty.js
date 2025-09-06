import React from "react";
import { Card } from "react-bootstrap";
import Styles from './Cart.module.css'

const CartEmpty = () => {
    return (
        <>
            <Card className="text-center shadow-sm border-0 p-4 my-4">
                <Card.Body>
                    <div className={Styles.emptyReviewsIcon}><i class="bi bi-cart4"></i></div>

                    <Card.Title>No Item in the Cart</Card.Title>
                </Card.Body>
            </Card>
        </>
    )
};

export default CartEmpty;
