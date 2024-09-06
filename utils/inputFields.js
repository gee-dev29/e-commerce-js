const registerField = ["firstName", "lastName", "email", "password"];
const updateField = ["phone", "address", "profilePicture"];
const adminRegisterField = ["fullName", "email", "password", "role"];
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
    updateShippingField
};
