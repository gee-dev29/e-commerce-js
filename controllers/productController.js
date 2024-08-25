export const addProduct = async (req, res) => {
    try {
        const product = req.product;
        const {
            productTitle,
            productDescription,
            productPrice,
            productDiscount,
            productCategory,
            productColors,
            productSize,
            productImages,
            productstock,
        } = req.body;
    } catch (error) {}
};
