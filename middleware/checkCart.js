import { cartModel } from "../interface/cartModel.js";

export const checkCart = async(req, res, next) => {
    try {
        let cartId;
        if(!req.body.cartId){
            cartId = req.params.cartId;
        }else{
            cartId = req.body.cartId;
        }

        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }
        req.cart = cart;
        req.cartId = cartId;
        next();
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        })
    }
}