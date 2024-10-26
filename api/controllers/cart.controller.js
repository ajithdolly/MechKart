import Cart from "../models/cart.model.js";
import createError from "../utils/createError.js";

export const setCartItems = async(req,res,next) => {
  const items = req.body;
  // console.log(items);
  
  const userId = req.userId;
  try{
    let existingCart = await Cart.findOne({user : userId});
    if(existingCart){
      existingCart.items = items;
      existingCart.save();
    }else{
      const newCart = new Cart({
        user: userId,
        items: items,
      });
      await newCart.save();
    }
  }catch(err){
    next(createError(500,"Something went wrong"))
  }
}

export const addCartItem = async (req, res, next) => {
    const { productId } = req.body;
    const userId = req.userId;
    try {
      let existingCart = await Cart.findOne({ user: userId });
      if (existingCart) {
        const cartItem = existingCart.items.find(
          (cartItem) => cartItem.product.toString() === productId
        );
  
        if (cartItem) {
          cartItem.quantity += 1;
        } else {
          const item = {
            product: productId,
            quantity: 1,
          };
          existingCart.items.push(item);
        }
  
        await existingCart.save();
      } else {
        const newCart = new Cart({
          user: userId,
          items: [
            {
              product: productId,
              quantity: 1,
            },
          ],
        });
        await newCart.save();
      }
      res.status(200).json({ message: "Item added to cart successfully" });
    } catch (err) {
      next(createError(500, "Something went wrong"));
    }
  };
  

export const getCartItems = async (req, res, next) => {
  const userId = req.params.id;
  try {
    let existingCart = await Cart.findOne({ user: userId });
    if (!existingCart) {
      const newCart = new Cart({
        user: userId,
        items: [],
      });
      existingCart = await newCart.save();
    }

    res.status(200).json(existingCart.items);
  } catch (err) {
    next(createError(500, "Internal server error"));
  }
};
