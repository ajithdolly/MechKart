import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import newRequest from "../../utils/newRequest";
import { toast } from "react-toastify";
import { ProductsContext } from "../../context/productContext";
import { useContext } from "react";

//These are the functions that calls for the execution of updation of LocalCart first and then the updation of Database - START
export const addItemToCartWithDatabaseUpdate = createAsyncThunk(
  "cart/addItemToCartWithDatabaseUpdate",
  (product, thunkAPI) => {
    thunkAPI.dispatch(addItemToCart(product));

    const { cartItems } = thunkAPI.getState().cart;
    const newArray = cartItems.map((cartItem) => ({
      product: cartItem._id,
      quantity: cartItem.quantity,
    }));

    const res = thunkAPI.dispatch(pushCartToDatabase({ items: newArray }));
    return res.data; // You can return a meaningful value if needed
  }
);

export const removeItemFromCartWithDatabaseUpdate = createAsyncThunk(
  "cart/addItemToCartWithDatabaseUpdate",
  (product, thunkAPI) => {
    thunkAPI.dispatch(removeItemFromCart(product));

    const { cartItems } = thunkAPI.getState().cart;
    const newArray = cartItems.map((cartItem) => ({
      product: cartItem._id,
      quantity: cartItem.quantity,
    }));

    const res = thunkAPI.dispatch(pushCartToDatabase({ items: newArray }));

    return res.data;
  }
);

export const clearItemFromCartWithDatabaseUpdate = createAsyncThunk(
  "cart/addItemToCartWithDatabaseUpdate",
  (product, thunkAPI) => {
    thunkAPI.dispatch(clearItemFromCart(product));

    const { cartItems } = thunkAPI.getState().cart;
    const newArray = cartItems.map((cartItem) => ({
      product: cartItem._id,
      quantity: cartItem.quantity,
    }));

    const res = thunkAPI.dispatch(pushCartToDatabase({ items: newArray }));

    return res.data;
  }
);
//These are the functions that calls for the execution of updation of LocalCart first and then the updation of Database - END

//The funcvtion that we used to update the cartItems in our database with the updated Local CartValue (Database Modifications) - START
export const pushCartToDatabase = createAsyncThunk(
  "cart/pushCartToDatabase",
  (cartItems, thunkAPI) => {
    try {
      const res = newRequest.post("/cart/set", cartItems.items);
      console.log(res);
    } catch (err) {
      toast.error(err.response.data, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }
);

export const fetchCartFromDatabase = createAsyncThunk(
  "cart/fetchCartFromDatabase",
  async (userId, thunkAPI) => {
    try {
      const res = await newRequest.get(`/cart/${userId}`);
      console.log(res.data);
      const res2 = await newRequest.get(`/product`).then((res)=>res.data);
      thunkAPI.dispatch(cartSlice.actions.convertCartData(res2));
      return res.data;
    } catch (err) {
      toast.error(err.response.data, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }
);


//The funcvtion that we used to update the cartItems in our database with the updated Local CartValue - END

//Functions for modifying the Cart within the application (Local Modifications) - START
const addCartItem = (cartItems, productToAdd) => {
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem._id === productToAdd._id
  );

  if (existingCartItem) {
    return cartItems.map((cartItem) =>
      cartItem._id === productToAdd._id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
  }

  return [...cartItems, { ...productToAdd, quantity: 1 }];
};

const removeCartItem = (cartItems, cartItemToRemove) => {
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem._id === cartItemToRemove._id
  );

  if (existingCartItem.quantity === 1) {
    return cartItems.filter(
      (cartItem) => cartItem._id !== cartItemToRemove._id
    );
  }

  return cartItems.map((cartItem) =>
    cartItem._id === cartItemToRemove._id
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem
  );
};

const clearCartItem = (cartItems, cartItemToClear) =>
  cartItems.filter((cartItem) => cartItem._id !== cartItemToClear._id);

//Functions for modifying the Cart within the application - END

const CART_INITIAL_STATE = {
  isCartOpen: false,
  cartItems: [],
  isPushCartToDatabaseLoading: false,
  isPushCartToDatabaseSuccess: false,
  isFetchCartFromDatabaseLoading: false,
  isFetchCartFromDatabaseSuccess: false,
  cartData: [],
  products: [],
  error: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState: CART_INITIAL_STATE,
  reducers: {
    addItemToCart: (state, action) => {
      state.cartItems = addCartItem(state.cartItems, action.payload);
    },
    removeItemFromCart: (state, action) => {
      state.cartItems = removeCartItem(state.cartItems, action.payload);
    },
    clearItemFromCart: (state, action) => {
      state.cartItems = clearCartItem(state.cartItems, action.payload);
    },
    setIsCartOpen: (state, action) => {
      state.isCartOpen = action.payload;
    },
    convertCartData: (state, action) => {
      const cartData = state.cartData;
      const products = action.payload;
      const cartProductQuantityMap = new Map(
        cartData.map((item) => [item.product, item.quantity])
      );
      const filteredProducts = products
        .filter((product) => cartProductQuantityMap.has(product._id))
        .map((product) => ({
          ...product,
          quantity: cartProductQuantityMap.get(product._id),
        }));
      console.log(filteredProducts);
      state.cartItems = filteredProducts;
    },
    resetCartAction : (state,action) => {
      state = CART_INITIAL_STATE;
    }

  },
  extraReducers: (builder) => {
    builder
      .addCase(pushCartToDatabase.pending, (state, action) => {
        state.isPushCartToDatabaseLoading = true; // Indicate that the database update is in progress
        state.isPushCartToDatabaseSuccess = false; // Update a success flag in the state
      })
      .addCase(pushCartToDatabase.fulfilled, (state, action) => {
        state.error = action.payload;
        state.isPushCartToDatabaseLoading = false; // Indicate that the database update is complete
        state.isPushCartToDatabaseSuccess = true; // Update a success flag in the state
      })
      .addCase(pushCartToDatabase.rejected, (state, action) => {
        state.isPushCartToDatabaseLoading = false; // Indicate that the database update has failed
        state.isPushCartToDatabaseSuccess = false; // Update a failure flag in the state
      })
      .addCase(fetchCartFromDatabase.pending, (state, action) => {
        state.isFetchCartFromDatabaseLoading = true;
        state.isFetchCartFromDatabaseSuccess = false;
      })
      .addCase(fetchCartFromDatabase.fulfilled, (state, action) => {
        state.cartData = action.payload;
        state.isFetchCartFromDatabaseLoading = false;
        state.isFetchCartFromDatabaseSuccess = true;
      })
      .addCase(fetchCartFromDatabase.rejected, (state, action) => {
        state.isFetchCartFromDatabaseLoading = false;
        state.isFetchCartFromDatabaseSuccess = false;
        state.error = action.error.message;
      })
      
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  clearItemFromCart,
  setIsCartOpen,
  convertCartData,
  resetCartAction
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
export const selectCartItems = (state) => state.cart.cartItems;
