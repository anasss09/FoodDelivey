import axios from "axios";

const instance = axios.create({
	baseURL: "https://food-delivey-mpp3.vercel.app",
	withCredentials: true,
});

export default instance;

