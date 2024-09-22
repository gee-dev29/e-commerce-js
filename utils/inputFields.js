const registerField = ["firstName", "lastName", "email", "password"];
const updateField = ["phone", "address", "profilePicture"];
const adminRegisterField = ["firstName", "lastName", "email", "password", "role"];
const loginField = ["email", "password"];
const uploadField = ["file"];

const productField = [
    "productTitle",
    "productDescription",
    "productPrice",
    "productCategory",
    "productColors",
    "productStock",
    "productSize",
    "productDiscount",
    "productImages",
];
const orderField = [
    "orderedItems",
    "shippingInfo",
    "paymentMethod",
    "totalAmount",
    "orderStatus",
];

const shippingField = [
    "shippingTrackingNumber",
    "zipCode",
    "state",
    "city",
    "street",
    "shippingCountry",
    "shippingNote",
    "shippingFee",
    "currency",
];
const updateShippingField = [
    "zipCode",
    "state",
    "city",
    "street",
    "shippingCountry",
    "shippingNote",
    "shippingFee",
    "currency",
];

const cartField = ["productId", "quantity"];
const heroField = ["image", "text", "title"];
const categoryField = ["image", "name"];
const verifyOTPField = ["otp", "email"];

const wishListField = ["productId"];

export {
    registerField,
    productField,
    shippingField,
    orderField,
    loginField,
    adminRegisterField,
    updateField,
    cartField,
    wishListField,
    updateShippingField,
    verifyOTPField,
    uploadField,
    heroField,
    categoryField
};
