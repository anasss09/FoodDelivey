import axios from "../utils/axios";
import React, { useEffect, useState } from "react";
import Styles from "./Cart.module.css";
import PaymentButton from "../components/Payment/PaymentButton";
import { useSelector } from "react-redux";
import CartEmpty from "./CartEmpty";

const Cart = () => {
	const userData = useSelector((state) => state.userReducer);
	console.log(userData.cart);
	const [cart, setCart] = useState([]);
	const [totalPrice, settotalPrice] = useState(0);

	useEffect(() => {
		async function getCart() {
			try {
				const { data } = await axios.get("restaurant/cart/get-cart");
				setCart(data.data);
			} catch (error) {
				console.log(error.response.data.message);
			}
		}
		getCart();
	}, []);

	// Calculate totalPrice whenever cart changes
	useEffect(() => {
		const total = cart.reduce(
			(sum, item) => sum + item.food.price * item.quantity,
			0
		);
		settotalPrice(total);
	}, [cart]);

	async function onIncreaseHandler(id, restaurantName, category) {
		category = encodeURIComponent(category)
		restaurantName = encodeURIComponent(restaurantName)
		try {
			const { data } = await axios.get(
				`restaurant/cart/increase-cart/${id}?restaurant_name=${restaurantName}&category=${category}`
			);
			setCart(data.data)

		} catch (error) {
			alert(error.response.data.message);
		}
	}

	async function onDecreaseHandler(id, restaurantName, category) {
		category = encodeURIComponent(category)
		restaurantName = encodeURIComponent(restaurantName)
		try {
			const { data } = await axios.get(
				`restaurant/cart/decrease-cart/${id}?restaurant_name=${restaurantName}&category=${category}`
			);

			setCart(data.data);

		} catch (error) {
			alert(error.response.data.message);
		}
	}

	return (
		<>
			{cart.length > 0 ? (
				<>
					{cart.map((item, indx) => (
						<div
							key={item._id}
							className={`border p-2 my-2 ${Styles["card-item-comtainer"]}`}
						>
							<div>
								<img
									className={`${Styles["cart-item-img"]}`}
									src={item?.food?.images?.[0].url}
									alt={item.food.name}
								/>
							</div>

							<div>
								<h3 className="text-capitalize">{item.food.name}</h3>
								<div>
									<div className={Styles["card-item-details"]}>
										Price: <strong>₹{item.food.price}</strong>
									</div>
									<div className={Styles["card-item-details"]}>
										{item.food.description}
									</div>
									<div className={`${Styles["card-item-veg"]} ${item.food.veg ? "" : "no"}`}>
										{item.food.veg ? "Veg" : "Non-Veg"}
									</div>

									<div className={Styles["card-item-controls"]}>
										<button
											onClick={() =>
												onIncreaseHandler(
													item.food._id,
													item.restaurantName,
													item.category,
												)
											}
										>
											+
										</button>
										<span>
											{item.quantity}
										</span>
										<button
											onClick={() =>
												onDecreaseHandler(
													item.food._id,
													item.restaurantName,
													item.category,
												)
											}
										>
											-
										</button>
									</div>
								</div>
							</div>
						</div>
					))}

					<PaymentButton amount={totalPrice} />
				</>
			) : (
				<CartEmpty />
			)}
		</>
	);
};

export default Cart;
