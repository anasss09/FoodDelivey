import { combineReducers } from "redux";
import userReducer from "./userReducer";
import restaurantReducer from "./restaurantsReducer";

const rootReducer = combineReducers({
    userReducer,
    restaurantReducer
})

export default rootReducer;