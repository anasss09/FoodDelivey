import axios from "axios";

const instance = axios.create({
	baseURL: "https://fooddelivey.onrender.com",    //"http://localhost:4444",
	withCredentials: true,
});

export default instance;