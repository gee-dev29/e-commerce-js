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
const uploadField = ["file"];

const productField = [
    "productTitle",
    "productDescription",
    "productPrice",
    "productCategory",
    "productSubCategory",
    "productColors",
    "productStock",
    "productSize",
    "productDiscount",
    "productImages",
];
const orderField = [
    "fullName",
    "orderedItems",
    "paymentMethod",
];
const deliveryField = [
    "street",
    "city",
    "state",
    "country",
    "zipCode",
    "phone",
];

const shippingField = [
    "shippingRate",
    "subregion",
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

const cartField = ["productId"];
const heroField = ["image", "text", "title"];
const categoryField = ["image", "name"];
const verifyOTPField = ["otp", "email"];

const wishListField = ["productId"];
const reviewFieldId = ["productId", 'orderId', "comment", "rating"];

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
    categoryField,
    deliveryField,
    reviewFieldId
};
