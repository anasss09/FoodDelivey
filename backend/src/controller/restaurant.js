import Restaurant from "../models/restaurant.js";
import User from "../models/user.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import ErrorWrapper from "../utils/ErrorWrapper.js";
import uploadOnCloudinary, {
	uploadBatchOnCloudinary,
} from "../utils/uploadCloudinary.js";

export const postAddRestaurant = ErrorWrapper(async (req, res, next) => {
	const { name, address, contact } = req.body;
	const email = req.user.email;

	if (!email) {
		throw new ErrorHandler(401, "Please verify your email and try again !");
	}

	const incomingFields = Object.keys(req.body);
	const requireFields = ["name", "address", "contact"];
	const missingFields = requireFields.filter(
		(field) => !incomingFields.includes(field)
	);

	if (missingFields.length > 0) {
		throw new ErrorHandler(401, `Enter ${missingFields} Fiels`);
	}

	let restaurant;
	try {
		restaurant = await Restaurant.findOne({ name, ownerId: req.user._id });
	} catch (error) {
		ErrorHandler(500, error.message);
	}

	if (restaurant) {
		throw new ErrorHandler(401, "Restaurant Already Exist");
	}

	let cloudinaryResponse;
	try {
		cloudinaryResponse = await uploadOnCloudinary(req.file.path);
	} catch (error) {
		throw new ErrorHandler(500, `Cloudinary ${error.message}`);
	}

	try {
		let newRestaurant = await Restaurant.create({
			name,
			address,
			email,
			contact,
			coverImage: cloudinaryResponse.url,
			ownerId: req.user._id,
		});

		res.status(201).json({
			success: "True",
			message: "Restaurant added successfully",
			newRestaurant,
		});
	} catch (error) {
		throw new ErrorHandler(
			500,
			`Error while adding restaurant: ${error.message}`
		);
	}
});

export const postCusineCategoryAdd = ErrorWrapper(async (req, res, next) => {
	const { category, restaurant_name } = req.body;

	let newCusineCategory = category.split(",");
	newCusineCategory = newCusineCategory.map((c) => c.trim().toLowerCase());

	if (!newCusineCategory)
		throw new ErrorHandler(401, `Enter valid category to add`);

	try {
		let restaurant = await Restaurant.findOne({
			name: restaurant_name,
		});

		if (!restaurant)
			throw new ErrorHandler(
				401,
				`Restaurant not found: ${restaurant_name}`
			);

		if (restaurant.email !== req.user.email) {
			throw new ErrorHandler(
				401,
				"You are not authorise to add cusine to this restaurent."
			);
		}

		let existingCusines = restaurant.cusines;
		if (existingCusines.length) {
			let newCusines = newCusineCategory.filter((cusine) => {
				for (let i = 0; i < existingCusines.length; i++) {
					if (existingCusines[i].category == cusine) return false;
				}
				return true;
			});

			newCusineCategory = newCusines;
		}

		let newCusines = [];
		for (let i = 0; i < newCusineCategory.length; i++) {
			let category = newCusineCategory[i];
			let newCusine = {
				category,
				food: [],
			};
			newCusines.push(newCusine);
		}

		if (newCusines.length) {
			restaurant.cusines = [...newCusines, ...existingCusines];
			restaurant.save();
		}

		res.status(200).json({
			seccess: true,
			message: "Restaurant added successfully",
			data: restaurant,
		});
	} catch (error) {
		throw new ErrorHandler(500, error.message);
	}
});

export const getRestaurants = ErrorWrapper(async (req, res, next) => {
	try {
		const restaurant = await Restaurant.find();
		if (!restaurant) {
			throw new ErrorHandler(
				404,
				`${restaurant.name} not found, Please Provide valid Restaurant name.`
			);
		}

		res.status(200).json({
			success: true,
			message: "Restaurant Fatched Successfully",
			restaurant,
		});
	} catch (error) {
		throw new ErrorHandler(error.statusCode || 500, error.message);
	}
});

export const getRestaurant = ErrorWrapper(async (req, res, next) => {
	const { restaurantId } = req.params;
	try {
		const restaurant = await Restaurant.find({ _id: restaurantId });
		if (!restaurant) {
			throw new ErrorHandler(
				404,
				"Restaurant not found, Please provide valid restaurant."
			);
		}

		res.status(200).json({
			success: true,
			message: "Restaurants fetched successfully",
			restaurant: restaurant,
		});
	} catch (error) {
		throw new ErrorHandler(error.statusCode || 500, error.message);
	}
});

export const postAddFoodItem = ErrorWrapper(async (req, res, next) => {
	const incomingFields = Object.keys(req.body);
	let requireFields = [
		"category",
		"name",
		"price",
		"description",
		"veg",
		"restaurant_name",
	];
	const missingFields = requireFields.filter(
		(field) => !incomingFields.includes(field)
	);

	if (missingFields.length > 0) {
		throw new ErrorHandler(401, `Fill the ${missingFields}`);
	}

	try {
		let { category, name, price, description, veg, restaurant_name } =
			req.body;
		category = category.toLowerCase();
		description = description.toLowerCase();
		veg = veg.toLowerCase();
		name = name.toLowerCase();
		restaurant_name = restaurant_name.toLowerCase();

		const restaurant = await Restaurant.findOne({
			name: restaurant_name,
		});

		if (!restaurant) {
			throw new ErrorHandler(401, "Restaurent not Found");
		}

		let index = -1;
		for (let i = 0; i < restaurant.cusines.length; i++) {
			if (restaurant.cusines[i].category == category) {
				index = i;
				break;
			}
		}

		if (index == -1) {
			throw new ErrorHandler(
				401,
				`Please add the category first in which you want to add ${name} eatable`
			);
		}

		let cloudinaryResponse = {
			url: "",
		};

		if (req.file.path) {
			cloudinaryResponse = await uploadOnCloudinary(req.file.path);
		}

		let vegValue = veg === "true" ? true : false;
		let newFoodItem = {
			name: name,
			price: +price,
			veg: vegValue,
			description: description,
			images: [
				{
					url: cloudinaryResponse.url,
				},
			],
		};

		// restaurant.cusines → gives you the array of cuisines.
		// Example: [ { category: "North Indian", food: [...] }, { category: "South Indian", food: [...] } ]
		// restaurant.cusines[index] → picks one cuisine from that array (using index).
		// Example: if index = 1, it selects the South Indian cuisine.
		// restaurant.cusines[index]["food"] → goes inside that cuisine and picks the food array.
		// .push(newFoodItem) → adds (pushes) a new food object into that array.
		restaurant.cusines[index]["food"].push(newFoodItem);
		await restaurant.save();

		res.status(200).json({
			message: "Food item added successfully!",
			data: restaurant,
		});
	} catch (error) {
		throw new ErrorHandler(error.statusCode || 500, error.message);
	}
});

export const postUpdateFoodItem = ErrorWrapper(async (req, res, next) => {
	const { id } = req.params;
	const { name, price, veg, description, category, restaurant_name } =
		req.body;

	try {
		const restaurant = await Restaurant.findOne({
			name: restaurant_name,
		});

		if (!restaurant) {
			throw new ErrorHandler(
				401,
				"Restaurant with name ${restaurant_name} not found"
			);
		}

		const user = req.user;
		if (user._id.toString() !== restaurant.ownerId.toString()) {
			throw new ErrorHandler(401, "You are not authorize to update Food. ");
		}

		const index = restaurant.cusines.findIndex(
			(item) => item.category === category
		);

		if (index == -1) {
			throw new ErrorHandler(
				401,
				`Please add the category first in which you want to update the food item of ${restaurant_name} `
			);
		}

		const foodIndex = restaurant.cusines[index]["food"].findIndex(
			(item) => item._id.toString() === id.toString()
		);
		if (foodIndex == -1) {
			throw new ErrorHandler(
				404,
				`Please provide the correct details - food or id inorder to update the details`
			);
		}

		if (name) restaurant.cusines[index]["food"][foodIndex].name = name;
		if (price) restaurant.cusines[index]["food"][foodIndex].price = price;
		if (veg) restaurant.cusines[index]["food"][foodIndex].veg = veg;
		if (description)
			restaurant.cusines[index]["food"][foodIndex].description = description;

		if (req.file) {
			const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
			const { url } = cloudinaryResponse;
			restaurant.cusines[index]["food"][foodIndex].images[0].url = url;
		}

		await restaurant.save();

		res.status(200).json({
			message: "Food item updated successfully!",
			data: restaurant,
		});
	} catch (error) {
		throw new ErrorHandler(error.statusCode || 500, error.message);
	}
});

export const getDeleteFoodItem = ErrorWrapper(async (req, res, next) => {
	const { id } = req.params;
	const { category, restaurant_name } = req.query;

	try {
		const restaurant = await Restaurant.findOne({
			name: restaurant_name,
		});

		if (!restaurant) {
			throw new ErrorHandler(
				401,
				`Restaurant with name ${restaurant_name} not found`
			);
		}

		const user = req.user;
		if (user._id.toString() !== restaurant.ownerId.toString()) {
			throw new ErrorHandler(
				401,
				"You are not authorized to perform this action"
			);
		}

		const index = restaurant.cusines.findIndex(
			(item) => item.category == category
		);
		if (index == -1) {
			throw new ErrorHandler(
				404,
				`Please add the category first in which you want to update the food item of ${restaurant_name}`
			);
		}

		const foodIndex = restaurant.cusines[index]["food"].findIndex(
			(item) => item._id.toString() === id.toString()
		);
		if (foodIndex == -1) {
			throw new ErrorHandler(
				404,
				`Please provide the correct details - food or id inorder to update the details`
			);
		}

		restaurant.cusines[index]["food"].splice(foodIndex, 1);
		await restaurant.save();

		res.status(200).json({
			message: "Food item deleted successfully!",
			data: restaurant,
		});
	} catch (error) {
		throw new ErrorHandler(error.statusCode || 500, error.message);
	}
});

export const getFoodItems = ErrorWrapper(async (req, res, next) => {
	const { category, restaurant_name } = req.query;
	console.log(category, restaurant_name);

	try {
		const restaurant = await Restaurant.findOne({
			name: restaurant_name,
		});

		if (!restaurant) {
			throw new ErrorHandler(404, "Enter valid restaurant name ");
		}

		const user = req.user;
		if (user._id.toString() !== restaurant.ownerId.toString()) {
			throw new ErrorHandler(
				401,
				"You are not authorized to perform this task"
			);
		}

		const index = restaurant.cusines.findIndex(
			(item) => item.category === category
		);
		if (index == -1) {
			throw new ErrorHandler(
				401,
				`${category} not found, Please enter bvalid category`
			);
		}

		const food = restaurant.cusines[index]["food"];
		res.status(200).json({
			message: "Selected Food Item fetch Successfully",
			data: food,
		});
	} catch (error) {
		throw new ErrorHandler(error.statusCode || 500, error.message);
	}
});

export const getFoodItem = ErrorWrapper(async (req, res, next) => {
	const { id } = req.params;
	const { restaurant_name, category } = req.query;

	try {
		const restaurant = await Restaurant.findOne({
			name: restaurant_name,
		});

		if (!restaurant) {
			throw new ErrorHandler(
				404,
				`${restaurant_name} not found, Please provide valid Restaurant name`
			);
		}

		const user = req.user;
		if (user._id.toString() !== restaurant.ownerId.toString()) {
			throw new ErrorHandler(
				401,
				"You are not authorized to perform this action"
			);
		}

		const index = restaurant.cusines.findIndex(
			(item) => item.category === category
		);
		if (index == -1) {
			throw new ErrorHandler(404, `Provided ${category} not found.`);
		}

		const foodIndex = restaurant.cusines[index]["food"].findIndex(
			(item) => item._id.toString() === id.toString()
		);
		if (foodIndex == -1) {
			throw new ErrorHandler(404, `This ${id} not found`);
		}

		const food = restaurant.cusines[index]["food"][foodIndex];

		res.status(200).json({
			message: "Seccessfully fetched Food with the help of ID",
			data: food,
		});
	} catch (error) {
		throw new ErrorHandler(error.statusCode || 500, error.message);
	}
});

export const getAllCusines = ErrorWrapper(async (req, res, next) => {
	const { restaurant_name } = req.query;
	try {
		const restaurant = await Restaurant.findOne({
			name: restaurant_name,
		});

		if (!restaurant) {
			throw new ErrorHandler(404, `Provided ${restaurant_name} not Found`);
		}

		const user = req.user;
		if (user.id.toString() !== restaurant.ownerId.toString()) {
			throw new ErrorHandler(401, `You are not authorized to perform task`);
		}

		const allCusines = restaurant.cusines;

		res.status(200).json({
			message: "Successfully fetched All Cusines",
			data: allCusines,
		});
	} catch (error) {
		throw new ErrorHandler(error.statusCode || 500, error.message);
	}
});

export const getAllRestauratFoodItems = ErrorWrapper(async (req, res, next) => {
	try {
		const restaurant = await Restaurant.find();

		// const foodItems = restaurant.map(restaurantItrate => {
		// 	return {
		// 		cusines: restaurantItrate.cusines.map(cusine => {
		// 			return {
		// 				food: cusine.food  // this contains all food items for this category
		// 			};
		// 		})
		// 	};
		// });

		// Format restaurants with foods grouped by cuisine
		const foodItems = restaurant.map(r => {
			return {
				restaurantName: r.name,
				cuisines: r.cusines.map(c => {
					return {
						category: c.category,
						foods: c.food.map(f => ({
							_id: f._id,
							name: f.name,
							price: f.price,
							description: f.description,
							veg: f.veg,
							images: f.images
						}))
					};
				})
			};
		});


		res.status(200).json({
			success: true,
			message: 'Success Fully fetched',
			foodItems: foodItems
		})
	} catch (error) {
		throw new ErrorHandler(error.statusCode || 500, error.message)
	}
})

export const postAddFoodImages = ErrorWrapper(async (req, res, next) => {
	const { id } = req.params;
	const { category, restaurant_name } = req.body;

	try {
		const restaurant = await Restaurant.findOne({
			name: restaurant_name,
		});

		if (!restaurant) {
			throw new ErrorHandler(
				404,
				`${restaurant_name} this restaurant not found!`
			);
		}

		const user = req.user;
		if (user._id.toString() !== restaurant.ownerId.toString()) {
			throw new ErrorHandler(
				401,
				`You are not authorized to add images in this ${restaurant_name}`
			);
		}

		const index = restaurant.cusines.findIndex(
			(item) => item.category === category
		);
		if (index == -1) {
			throw new ErrorHandler(
				404,
				`Category not found, Please provide valid category`
			);
		}

		const foodIndex = restaurant.cusines[index]["food"].findIndex(
			(item) => item._id.toString() === id.toString()
		);
		if (foodIndex == -1) {
			throw new ErrorHandler(404, `Food item with id ${id} not found`);
		}

		const food = restaurant.cusines[index]["food"][foodIndex];

		const images = req.files;
		if (images.length == 0) {
			throw new ErrorHandler(400, "Please provide images to upload");
		}

		const imageUrl = [];

		const cloudinaryResult = await uploadBatchOnCloudinary(images);

		for (let i = 0; i < cloudinaryResult.length; i++) {
			imageUrl.push({
				url: cloudinaryResult[i].url,
			});
		}

		food.images = [...imageUrl, ...food.images];
		await restaurant.save();

		res.status(200).json({
			success: true,
			message: "Images uploaded successfully",
			data: food,
		});
	} catch (error) {
		throw new ErrorHandler(error.statusCode || 500, error.message);
	}
});


export const postAddRestaurantImages = ErrorWrapper(async (req, res, next) => {
	// const { id } = req.params;
	const { restaurant_name } = req.body;

	try {
		const restaurant = await Restaurant.findOne({
			name: restaurant_name
		})

		if (!restaurant) {
			throw new ErrorHandler(404, 'This restaurant not found Plaese give valid Restaurant name.')
		}

		if (req.user._id.toString() !== restaurant.ownerId.toString()) {
			throw new ErrorHandler(401, "You are not authorized to add images")
		}

		const images = req.files;
		if (images.length == 0) {
			throw new ErrorHandler(400, "Please provide images to upload");
		}

		let imageUrl = []
		const cloudinaryResult = await uploadBatchOnCloudinary(images)

		for (let i = 0; i < cloudinaryResult.length; i++) {
			imageUrl.push({
				url: cloudinaryResult[i].url,
			});
		}

		restaurant.images = [...imageUrl, ...restaurant.images]
		await restaurant.save()

		res.status(200).json({
			success: true,
			message: 'Images added SuccessFully',
			images: restaurant.images
		})

	} catch (error) {
		throw new ErrorHandler(error.statusCode || 500, error.message)
	}
})


export const getAllRestauratImages = ErrorWrapper(async (req, res, next) => {
	const { restaurant_name } = req.query

	try {
		const restaurant = await Restaurant.findOne({ name: restaurant_name })
		if (!restaurant) {
			throw new ErrorHandler(404, 'Restaurant not found Please provide valid restaurant name.')
		}

		res.status(200).json({
			success: true,
			message: 'Succssfull',
			images: restaurant.images
		})
	} catch (error) {
		throw new ErrorHandler(error.statusCode || 500, error.message)
	}
})

// CRUD ON REVIEWS
export const postAddReview = ErrorWrapper(async (req, res, next) => {
	const { restaurant_name, rating, message } = req.body;
	const { name } = req.user;
	const userId = req.user._id;
	const userImage = req.user.image
	console.log(userImage);


	try {
		const restaurant = await Restaurant.findOne({
			name: restaurant_name,
		});

		if (!restaurant) {
			throw new ErrorHandler(
				404,
				`${restaurant_name} not found, please enter valid restaurant name`
			);
		}

		if (userId.toString() === restaurant.ownerId.toString()) {
			throw new ErrorHandler(
				401,
				"You are not authorized to perform this task"
			);
		}

		if (Number(rating) < 1 || Number(rating) > 5) {
			throw new ErrorHandler(400, "Rating must between 1 to 5");
		}

		const response = await uploadBatchOnCloudinary(req.files);
		const imageUrl = [];

		for (let i = 0; i < response.length; i++) {
			imageUrl.push({
				url: response[i].url,
			});
		}

		const review = {
			username: name,
			rating: +rating,
			message,
			userId,
			userImage: userImage,
			images: imageUrl,
		};

		restaurant.reviews.unshift(review);
		await restaurant.save();

		res.status(200).json({
			success: true,
			message: "Review added Successfully",
			review,
		});
	} catch (error) {
		throw new ErrorHandler(error.statusCode || 500, error.message);
	}
});

export const postUpdateReview = ErrorWrapper(async (req, res, next) => {
	const { reviewId } = req.params;
	const { restaurant_name, rating, message } = req.body;
	const userId = req.user._id;

	try {
		const restaurant = await Restaurant.findOne({
			name: restaurant_name,
		});

		if (!restaurant) {
			throw new ErrorHandler(
				404,
				`${restaurant_name} this restaurant is not found. Please provide valid restaurant`
			);
		}

		// const index = restaurant.reviews.findIndex(t => t._id.toString() === reviewId.toString());
		// Both are same.

		const index = restaurant["reviews"].findIndex(
			(item) => item._id.toString() === reviewId.toString()
		);
		if (index === -1) {
			throw new ErrorHandler(
				404,
				"Review not found, that you are trying to update"
			);
		}

		if (
			userId.toString() !== restaurant["reviews"][index].userId.toString()
		) {
			throw new ErrorHandler(
				400,
				`You are not authorized to update this review`
			);
		}

		if (Number(rating) < 1 || Number(rating) > 5) {
			throw new ErrorHandler(400, "Rating must between 1 to 5");
		}

		if (rating) restaurant["reviews"][index].rating = +rating;
		if (message) restaurant["reviews"][index].message = message;
		await restaurant.save();

		res.status(200).json({
			success: true,
			message: "Review updated successfully",
			restaurant,
		});
	} catch (error) {
		throw new ErrorHandler(error.statusCode || 500, error.message);
	}
});

export const getDeleteReview = ErrorWrapper(async (req, res, next) => {
	const { reviewId } = req.params;
	const { restaurant_name } = req.query;
	const userId = req.user._id;

	try {
		const restaurant = await Restaurant.findOne({
			name: restaurant_name,
		});

		if (!restaurant) {
			throw new ErrorHandler(
				404,
				`Restaurant not found, Please provide valid restaurant name`
			);
		}

		const index = restaurant["reviews"].findIndex(
			(item) => item._id.toString() === reviewId.toString()
		);
		if (index == -1) {
			throw new ErrorHandler(
				404,
				"Review not found, that you are trying to update"
			);
		}

		if (
			userId.toString() !== restaurant["reviews"][index].userId.toString()
		) {
			throw new ErrorHandler(
				401,
				"You are not authorized to delete this review"
			);
		}

		restaurant["reviews"].splice(index, 1);
		await restaurant.save();

		res.status(200).json({
			success: true,
			message: "Review deleted Successfully",
			restaurant,
		});
	} catch (error) {
		throw new ErrorHandler(error.statusCode || 500, error.message);
	}
});

export const getAllReviews = ErrorWrapper(async (req, res, next) => {
	const { restaurant_name } = req.query;

	try {
		const restaurant = await Restaurant.findOne({ name: restaurant_name });
		if (!restaurant) {
			throw new ErrorHandler(
				404,
				"Restaurant not found to update the review"
			);
		}

		res.status(200).json({
			success: true,
			message: "Reviews fetched successfully",
			reviews: restaurant["reviews"],
		});
	} catch (error) {
		throw new ErrorHandler(error.statusCode || 500, error.message);
	}
});

export const getReview = ErrorWrapper(async (req, res, next) => {
	const { reviewId } = req.params;
	const { restaurant_name } = req.query;

	try {
		const restaurant = await Restaurant.findOne({ name: restaurant_name });
		if (!restaurant) {
			throw new ErrorHandler(
				404,
				"Restaurant not found to update the review"
			);
		}
		const index = restaurant["reviews"].findIndex(
			(r) => r._id.toString() == reviewId.toString()
		);
		if (index === -1) {
			throw new ErrorHandler(
				404,
				"Review not found, that you are trying to update"
			);
		}

		res.status(200).json({
			success: true,
			message: "Review fetched successfully",
			review: restaurant["reviews"][index],
		});
	} catch (error) {
		throw new ErrorHandler(error.statusCode || 500, error.message);
	}
});

export const postCreateOrder = ErrorWrapper(async (req, res, next) => {
	const { amount } = req.body;
	try {
		const cart = req.user.cart;

		if (!amount) {
			throw new ErrorHandler(400, "Amount not fount");
		}

		// Create order object
		const food = {
			date: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
			items: cart.map((item) => ({
				name: item.food.name,
				totalPrice: item.food.price * item.quantity,
				quantity: item.quantity,
				image: item.food.images[0].url
			})),
			totalPrice: amount,
		};

		req.user.orderHistory.unshift(food);

		const order = {
			id: req.user.orderHistory[0]._id,
			amount: req.user.orderHistory[0].totalPrice, // convert to paise
			currency: "INR",
			name: req.user.name,
		};


		req.user.cart = []
		await req.user.save()

		res.status(200).json({
			success: true,
			message: "Success",
			orderHistory: food,
			order: order,
		});
	} catch (error) {
		throw new ErrorHandler(error.statusCode || 500, error.message);
	}
});

export const postOrderVerifyPayment = ErrorWrapper(async (req, res, next) => {

	if (process.env.RAZORPAY_SECRET === "1234567890dummysecretkey") {
		return res.json({ success: true, message: "✅ Payment Verified Successfully" });
	}

	const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

	const sign = razorpay_order_id + "|" + razorpay_payment_id;
	const expectedSign = crypto
		.createHmac("sha256", process.env.RAZORPAY_SECRET)
		.update(sign.toString())
		.digest("hex");

	if (razorpay_signature === expectedSign) {
		return res.json({
			success: true,
			message: "Payment verified successfully",
		});
	} else {
		return res
			.status(400)
			.json({ success: false, message: "Invalid signature" });
	}
});

export const getOrderHistory = ErrorWrapper(async (req, res, next) => {
	const order = req.user.orderHistory;

	if (!order) {
		throw new ErrorHandler(400, 'Order not found')
	}

	res.status(200).json({
		success: true,
		message: 'Seccessfull',
		order: order
	})
})

export const getSwap = async (req, res, next) => {
	try {
		const restaurant = await Restaurant.find()

		const temp = restaurant[0]
		restaurant[0] = restaurant[2]
		restaurant[2] = temp

		await restaurant[0].save();
		await restaurant[2].save();
		res.send('done')


	} catch (error) {
		next(error)
	}
}