const registerField = ["firstName", "lastName", "email", "password"];
const updateField = ["phone", "address", "profilePicture"];
const adminRegisterField = [
    "fullName",
    "email",
    "password",
    "role",
];
const loginField = ["email", "password"];

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

const shippingFeild = [
    "shippingTrackingNumber",
    "shippingAddress",
    "shippingCountry",
    "shippingNote",
];

const cartField = ["productId", "quantity"];
const wishListField = ["productId"];
// const emailField = ["productId", "quantity"];

export {
    registerField,
    productField,
    shippingFeild,
    orderField,
    loginField,
    adminRegisterField,
    updateField,
    cartField,
    wishListField,
};
