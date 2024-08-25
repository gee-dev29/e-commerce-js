const registerField = ["firstName", "lastName", "email", "password"];
const updateField = ["phone", "address", "profilePicture"];
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
    "productCategory",
    "productColors",
    "productSize",
    "productImages",
];

const shippingFeild = [
    "shippingTrackingNumber",
    "shippingAddress",
    "shippingCountry",
    "shippingNote",
];

const orderField = ["paymentMethod", "paymentStatus"];
const cartField = ["productId", "quantity"];
const wishListField = ["productId", "quantity"];
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
