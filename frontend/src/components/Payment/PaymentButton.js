import { Button } from "react-bootstrap";
import axios from "../../utils/axios";
import Styles from "./PaymentButton.module.css";

function PaymentButton({ amount }) {
	const handlePayment = async () => {
		try {
			// 1️⃣ Create dummy order from backend
			const { data } = await axios.post("restaurant/payment/create-order", {
				amount,
			});

			// 2️⃣ Razorpay checkout options
			const options = {
				key: "rzp_test_1DP5mmOlF5G5ag", // ✅ Test Key ID (publicly safe)
				amount: amount * 100,
				currency: data.currency,
				name: "Purchase Item Demo",
				description: "Payment Integration Demo",
				order_id: data.id, // dummy order id
				handler: async function (response) {
					// 2️⃣ Verify payment with backend
					const verifyRes = await axios.post(
						"restaurant/payment/verify-payment",
						{
							razorpay_order_id: response.razorpay_order_id,
							razorpay_payment_id: response.razorpay_payment_id,
							razorpay_signature: response.razorpay_signature,
						}
					);

					if (verifyRes.data.success) {
						alert("✅ Payment Successful and Verified!");
						window.location.reload()
					} else {
						alert("❌ Payment Verification Failed!");
					}
				},
				prefill: {
					name: data.order.name,
					email: "demo@example.com",
					contact: "9999999999",
				},
				theme: {
					color: "blueviolet",
				},
			};

			const rzp1 = new window.Razorpay(options);
			rzp1.open();
		} catch (error) {
			alert("Something went wrong!");
		}
	};

	return (
		<div className={Styles["payment-btn-container"]}>
			<div className={Styles["payment-btn-wrapper"]}>
				<span className={Styles["payment-btn-amount"]}>Amount: ₹{amount}</span>
				<Button onClick={handlePayment} className={Styles["payment-btn"]}>
					Pay ₹{amount}
				</Button>
			</div>
		</div>
	);
}

export default PaymentButton;