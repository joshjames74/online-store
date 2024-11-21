import { combineReducers, Reducer } from "redux";
import { productReducer } from "./product";

interface RootState {
  product: ReturnType<typeof productReducer>;
}

const rootReducer: Reducer<RootState> = combineReducers({
  product: productReducer,
});

export default rootReducer;
