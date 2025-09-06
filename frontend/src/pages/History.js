import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { data } from "react-router-dom";
import Styles from './History.module.css'

const History = () => {
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		async function getHistory() {
			try {
				const { data } = await axios.get(
					"restaurant/order/get-order-history",
					{}
				);
				console.log(data);

				setOrders(data.order);
			} catch (error) {
				console.log(error.response.data.message);
			}
		}

		getHistory();
	}, []);

	return (
		<div className={Styles['history-container']}>
			<h2 className={Styles['orderhistory-heading']}>Order History</h2>
			{orders.length === 0 && <p>No orders yet!</p>}

			{orders.map((order) => (
				<div key={order._id} className={Styles['order-card']}>
					<div className={Styles['datetotalPtice-container']}>
						<div className={Styles['date-text']}>
							<strong>Date:</strong>{" "}
							{new Date(order.date).toLocaleString("en-IN")}
						</div>
						<div className={Styles['totalPrice-text']}>
							<strong>Total Price:</strong> ₹{order.totalPrice}
						</div>
					</div>

					{/* Scrollable container for all items in this order */}
					<div className={Styles['image-scroll']}>
						{order.items.map((item, index) => (
							<div key={index} className={Styles['image-card']}>
								<img src={item.image.url || item.image} className={Styles['history-images']} />
								<div className={Styles['ordername-quantity']}><span>{item.name}</span> x <span>{item.quantity}</span></div>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
};

export default History;
