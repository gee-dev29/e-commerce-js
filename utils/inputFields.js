const registerField = ["firstName", "lastName", "email", "password"];
const adminRegisterField = [
    "firstName",
    "lastName",
    "email",
    "password",
    "role",
];
const loginField = ["email", "password"];

const productField = [
    "productTitle",
    "productDescription",
    "productPrice",
    "productDiscount",
    "productCategory",
    "productColors",
    "productSizes",
    "productImages",
    "productQuantity",
];

const shippingFeild = [
    "shippingTrackingNumber",
    "shippingAddress",
    "shippingCountry",
    "shippingNote",
];

const orderField = ["paymentMethod", "paymentStatus"];

export {
    registerField,
    productField,
    shippingFeild,
    orderField,
    loginField,
    adminRegisterField,
};
