import React, { useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/cartContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useDispatch, useSelector } from "react-redux";
import { selectCartItems,selectCartTotal } from "../../store/cart/cart.selector";
import { addItemToCart, removeItemFromCart,clearItemFromCart,  } from "../../store/cart/cart.reducer";
import { removeItemFromCartWithDatabaseUpdate,addItemToCartWithDatabaseUpdate,clearItemFromCartWithDatabaseUpdate} from "../../store/cart/cart.reducer";
import { toast } from "react-toastify";

const Cart = () => {

  
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dis = 1000;
  const cartTotFinal = cartTotal - dis;
 
  
  
  const handleAdd = (product) => {
    // addMutation.mutate(product);
    dispatch(addItemToCartWithDatabaseUpdate(product));
  
    // TotalAmt=product.quantity*product.price;
    // return(TotalAmt);
  }

  const handleReduce = (product) => {
    dispatch(removeItemFromCartWithDatabaseUpdate(product));
  }

  const handleRemove = (product) => {
    dispatch(clearItemFromCartWithDatabaseUpdate(product));
  }

  const handleCheckOut = (price) =>{
    try {
    const options = {
      key: "rzp_test_vc8XY2Q34138RT",
      key_secret: "Wg893VmTA2VegApQqTzMZS9Z",
      amount: price*100,
      currency: 'INR',
      order_id: cartItems.id,
      name: 'MechKart',
      description: 'Mechanical Items',
      handler: function (response) {
        console.log('Payment successful:', response);
        toast.success("Payment successful! Your order has been placed.");
        navigate('/')
      },
      prefill: {
      },
      notes: {
        address: 'Razorpay Corporate office',
      },
      theme: {
        color: '#ffa500',
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  }
  catch (error) {
    console.error('Error during payment:', error);
    alert('An error occurred during payment.');
  }
};

return (
    <div className="p-5">
    <div className="w-[110px] bg-[#682A85] hover:bg-[#983ec2] h-[47px] my-[-5px] flex items-center justify-center rounded-[5px] cursor-pointer">
        
        
        <button className="text-white"onClick={()=>navigate(-1)}>
          
            Back
        </button>
    
        </div>
      <div className="bg-gray-200 p-4 mb-5 h-[180px] flex justify-center items-center">
        
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
      </div>
      <div className="flex">
        <div className="w-9/12 pr-4">
          <div className="border border-gray-300 rounded p-4">
            <h2 className="text-xl font-bold">Cart Items</h2>
            <table className="w-full mt-4">
              <thead>
                <tr>
                  <th style={{ width: "40%", textAlign: "left" }}>Product</th>
                  <th style={{ width: "20%", textAlign: "left" }}>Quantity</th>
                  <th style={{ width: "20%", textAlign: "left" }}>Price</th>
                  <th style={{ width: "20%", textAlign: "left" }}></th>
                </tr>
              </thead>
              <tbody>
                {cartItems &&
                  cartItems?.map((item, index) => (
                    <tr
                      key={item.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                    >
                      
                      <td className="flex items-center">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-25 h-24 mr-2"
                        />
                        {item.title}
                      </td>
                      
                      <td>
                        <div className="flex items-center">
                          <button
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-2 rounded-l"
                            onClick={()=>handleReduce(item)}
                          >
                            -
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-2 rounded-r"
                            onClick={() =>handleAdd(item)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>Rs.{item.price}</td>
                      <td>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                          onClick={()=>handleRemove(item)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-3/12 pl-4">
          <div className="border border-gray-300 rounded p-4">
            <h2 className="text-xl font-bold">Other Details</h2>
            {/* Add other details or components as needed */}
          </div>
          <div className="border border-gray-300 rounded p-4 mt-4 pb-10">
            <h2 className="text-xl font-bold">Summary</h2>
            <div className="flex justify-between mt-4">
              <div>Total Price:</div>
              <div>Rs.{cartTotal}</div>
            </div>
             <div className="flex justify-between mt-2">
              <div>Discount:</div>
              <div>Rs.{dis}</div>
            </div> 
             
              
            
            <div className="flex justify-between mt-2">
              <div>Total:</div>
              {cartTotal &&  
              <div>Rs.{cartTotFinal}</div>
}
              
            </div>
            <button
                          className="bg-red-500 hover:bg-red-600 text-white rounded float-right p-2 mt-4"
                          onClick={()=>handleCheckOut(cartTotFinal)}
              >Check Out</button>
            <div className="border-t mt-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
