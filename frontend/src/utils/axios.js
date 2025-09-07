import axios from "axios";

const instance = axios.create({
	baseURL: "https://fooddelivey.onrender.com",
	withCredentials: true,
});

export default instance;