export const addProduct = async (req, res) => {
    try {
        // const product = req.product;
        const {
            productTitle,
            productDescription,
            productPrice,
            productDiscount,
            productCategory,
            productColors,
            productSizes,
            productImages,
            productQuantity,
        } = req.body;
        const checkFields = entity.checkMissingFieldsInput(
            productField,
            req.body
        );
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }
        const product = new productModel({
            productTitle: productTitle,
            productDescription: productDescription,
            productPrice: productPrice,
            productDiscount: productDiscount,
            productCategory: productCategory,
            productColors: productColors,
            productSizes: productSizes,
            productImages: productImages,
            productQuantity: productQuantity,
        });
        await product.save();
        return res.status(201).json({
            message: "product created successfuly",
        });
    } catch (error) {}
};

//get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await entity.getAllFilteredData(productModel, {});
        return res.status(200).json({ payload: products });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

//get single product
export const getSingleProduct = async (req, res) => {
    try {
        return res.status(200).json({ payload: req.product });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

//update product
export const updateProduct = async (req, res) => {
    try {
        const product = req.product;
        const {
            productTitle,
            productDescription,
            productPrice,
            productDiscount,
            productCategory,
            productColors,
            productSizes,
            productImages,
            productQuantity,
        } = req.body;
        const checkFields = entity.checkMissingFieldsInput(
            productField,
            req.body
        );
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }
        const payload = {
            productTitle: productTitle,
            productDescription: productDescription,
            productPrice: productPrice,
            productDiscount: productDiscount,
            productCategory: productCategory,
            productColors: productColors,
            productSizes: productSizes,
            productImages: productImages,
            productQuantity: productQuantity,
        };
        await entity.updateDataById(req.params.id, payload, productModel);
        return res.status(200).json({
            message: "product updated successfuly",
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

//delete product
export const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        await entity.deleteDataById(id, productModel);
        return res.status(200).json({
            message: "product deleted successfuly",
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
