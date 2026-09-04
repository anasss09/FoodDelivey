import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
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
			<div className={Styles.historyHeader}><span>Your table</span><h2 className={Styles['orderhistory-heading']}>Past orders, <em>remembered.</em></h2><p>Every good meal you have enjoyed with us, in one place.</p></div>
			{orders.length === 0 && <div className={Styles.emptyOrders}>No orders yet. Your next favorite meal is waiting.</div>}

			{orders.map((order) => (
				<div key={order._id} className={Styles['order-card']}>
					<div className={Styles['datetotalPtice-container']}>
						<div className={Styles['date-text']}>
							<span>Delivered</span>
							{new Date(order.date).toLocaleString("en-IN")}
						</div>
						<div className={Styles['totalPrice-text']}>
							<span>Order total</span>₹{order.totalPrice}
						</div>
					</div>

					{/* Scrollable container for all items in this order */}
					<div className={Styles['image-scroll']}>
						{order.items.map((item, index) => (
							<div key={index} className={Styles['image-card']}>
								<img src={item.image?.url || item.image} alt={item.name} className={Styles['history-images']} />
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
