import React from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { Col } from "react-bootstrap";

const Restaurant = ({ restaurant }) => {
	return (
		<Col xs={12} sm={6} md={4} lg={3} className="mb-4">
			<Card className="shadow-sm h-100 d-flex flex-column">
				<Card.Img
					variant="top"
					src={restaurant.coverImage}
					alt='Restaurant Image'
					style={{ height: "200px", objectFit: "cover", objectPosition: "center" }}
				/>
				<Card.Body className="d-flex flex-column" style={{ flex: 1 }}>
					<Card.Title
						className="text-truncate capitalize"
						title={restaurant.name} // hover shows full name
					>
						{restaurant.name}
					</Card.Title>

					{/* Cuisine text with fixed height and ellipsis */}
					<Card.Text
						className="text-muted mb-3"
						style={{
							flex: 1,
							overflow: "hidden",
							display: "-webkit-box",
							WebkitLineClamp: 2, // show max 2 lines
							WebkitBoxOrient: "vertical",
						}}
					>
						<span>Cusines: </span> {restaurant.cusines.map((c, index) => {
								return (
									<span key={index} className="capitalize">
										{c.category}&nbsp;
									</span>
								);
							})}
					</Card.Text>

					<Card.Text
						className="text-muted mb-3 capitalize"
						style={{
							flex: 1,
							overflow: "hidden",
							display: "-webkit-box",
							WebkitLineClamp: 2, // show max 2 lines
							WebkitBoxOrient: "vertical",
						}}
					><span>Location: </span>{restaurant.address}</Card.Text>

					<Button variant="primary" id={restaurant._id} className="restaurantDetails-btn">
						<Link to={restaurant._id} className="restaurantDetails-btn">View Restaurant</Link>
					</Button>
				</Card.Body>
			</Card>
		</Col>
	);

};

export default Restaurant;