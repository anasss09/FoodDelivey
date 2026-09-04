import { Button } from "react-bootstrap";
import { useState } from "react";
import axios from "../../utils/axios";
import Styles from "./PaymentButton.module.css";

function PaymentButton({ amount }) {
	const [isPaying, setIsPaying] = useState(false);
	const handlePayment = async () => {
		setIsPaying(true);
		try {
			const { data } = await axios.post("restaurant/payment/create-order", {
				amount,
			});
			const order = data.order;
			if (data.isDummy) {
				if (!window.Razorpay) throw new Error("Razorpay checkout could not load. Check your internet connection and try again.");
				const dummyCheckout = new window.Razorpay({
					key: "rzp_test_1DP5mmOlF5G5ag",
					amount: order.amount,
					currency: order.currency,
					name: "Foodie",
					description: "Food order payment",
					handler: completeDummyPayment,
					modal: { ondismiss: () => setIsPaying(false) },
					theme: { color: "#e65d36" },
				});
				dummyCheckout.open();
				return;
			}
			if (!window.Razorpay) throw new Error("Razorpay checkout could not load. Check your internet connection and try again.");

			const options = {
				key: data.keyId,
				amount: order.amount,
				currency: order.currency,
				name: "Foodie",
				description: "Food order payment",
				order_id: order.id,
				handler: async function (response) {
					try {
						const verifyRes = await axios.post(
						"restaurant/payment/verify-payment",
						{
							razorpay_order_id: response.razorpay_order_id,
							razorpay_payment_id: response.razorpay_payment_id,
							razorpay_signature: response.razorpay_signature,
						}
					);

						if (verifyRes.data.success) window.location.reload();
						else alert("Payment verification failed. Your cart is still saved.");
					} catch (error) { alert(error.response?.data?.message || "Payment verification failed. Your cart is still saved."); }
				},
				prefill: {
					name: data.user?.name || "",
					email: "demo@example.com",
					contact: "",
				},
				modal: { ondismiss: () => setIsPaying(false) },
				theme: {
					color: "#e65d36",
				},
			};

			const rzp1 = new window.Razorpay(options);
			rzp1.open();
		} catch (error) {
			alert(error.response?.data?.message || "Could not start payment. Please try again.");
			setIsPaying(false);
		}
	};

	const completeDummyPayment = async () => {
		setIsPaying(true);
		try {
			await axios.post("restaurant/payment/verify-payment", { dummyPayment: true });
			alert("Payment successful!");
			window.location.reload();
		} catch (error) {
			alert(error.response?.data?.message || "Could not complete the dummy payment.");
		} finally {
			setIsPaying(false);
		}
	};

	return (
		<div className={Styles["payment-btn-container"]}>
			<div className={Styles["payment-btn-wrapper"]}>
				<span className={Styles["payment-btn-amount"]}>Amount: ₹{amount}</span>
				<Button onClick={handlePayment} disabled={isPaying} className={Styles["payment-btn"]}>
					{isPaying ? "Opening checkout..." : `Pay ₹${amount}`}
				</Button>
			</div>
		</div>
	);
}

export default PaymentButton;
