module.exports.checkProduct = async (req, res, next) => {
    try {
        const productId = req.params.id;
        if(!productId){
            return res.status(404).json({ message: "Product Id is required" });
        }
        const product = await productModel.findById(productId);
        if(!product){
            return res.status(404).json({ message: "Product not found" });
        }
        req.product = product;
        next();
    } catch (error) {
        
    }
}