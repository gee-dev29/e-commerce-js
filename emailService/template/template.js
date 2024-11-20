import moment from "moment";

export const resetPasswordTemplate = (token, name) => {
  return `
  <body style="background-color:#f6f9fc;padding:10px 0">
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;background-color:#ffffff;border:1px solid #f0f0f0;padding:45px">
      <tbody>
        <tr style="width:100%">
          <td><img alt="KNcloset" height="80" width="80"src="https://res.cloudinary.com/dzrrdkd7i/image/upload/v1732136066/zkc3dbnvdep7r5auonip.png" style="display:block;outline:none;border:none;text-decoration:none" width="40" />
            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
              <tbody>
                <tr>
                  <td>
                    <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">Hi ${name},</p>
                    <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">Someone recently requested a password change for your KNcloset account. If this was you, you can set a new password here:</p><p style="font-size:32px;line-height:26px; text-align: center; margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040" >${
                      token.otp
                    }</p>
                    <p style="text-align: center; font-size:15px;">Expires: ${moment(
                      token.expiresIn
                    ).format("MMMM Do YYYY, h:mm a")} </p>
                    <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">If you don&#x27;t want to change your password or didn&#x27;t request this, just ignore and delete this message.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table><!--/$-->
  </body>
`;
};

export const welcomeTemplate = (firstName, lastName) => {
  return `
      <body style="background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif">
        <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;margin:0 auto;padding:20px 0 48px">
          <tbody>
            <tr style="width:100%">
              <td>
                <img alt="KNcloset" height="80" width="80" src="https://res.cloudinary.com/dzrrdkd7i/image/upload/v1732136066/zkc3dbnvdep7r5auonip.png" style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto" width="170" />
                <p style="font-size:16px;line-height:26px;margin:16px 0">Hi ${firstName} ${lastName},</p>
                <p style="font-size:16px;line-height:26px;margin:16px 0">Welcome to KNCLOSET, your go-to destination for the latest fashion. Enjoy a seamless shopping experience with easy ordering, secure payments, and fast delivery right to your doorstep..</p>
                <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="text-align:center">
                  <tbody>
                    <tr>
                      <td>
                        <a href="https://knclosets.com" style="line-height:100%;text-decoration:none;display:block;max-width:100%;mso-padding-alt:0px;background-color:#A10153;border-radius:3px;color:#fff;font-size:16px;text-align:center;padding:12px 12px 12px 12px" target="_blank">
                          Get started
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p style="font-size:16px;line-height:26px;margin:16px 0">Best,<br />The KNCLOSET team</p>
                <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#cccccc;margin:20px 0" />
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    `;
};

export const receiptEmailTemplate = (
  orderNumber,
  invoiceDate,
  country,
  state,
  city,
  totalAmount,
  orderedItems
) => `
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #ffffff;">

<table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width: 100%; margin: 0 auto; padding: 20px 0 48px; width: 660px;">
<tbody>
<tr>
  <td>
    <!-- Header Section -->
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
      <tbody>
        <tr>
          <td>
            <img alt="KNcloset" height="80" width="80" src="https://res.cloudinary.com/dzrrdkd7i/image/upload/v1732136066/zkc3dbnvdep7r5auonip.png" style="display: block; outline: none; border: none; text-decoration: none;" />
          </td>
          <td align="right" style="font-size: 32px; line-height: 24px; margin: 16px 0; font-weight: 300; color: #888888;">
            Receipt
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Order Details Section -->
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="margin-top: 20px;">
      <tbody>
        <tr>
          <td>
            <p style="font-size: 10px; color: #666666;">INVOICE DATE</p>
            <p style="font-size: 12px;">${invoiceDate}</p>
          </td>
          <td>
            <p style="font-size: 10px; color: #666666;">ORDER NO.</p>
            <p style="font-size: 12px;">${orderNumber}</p>
          </td>
          <td>
            <p style="font-size: 10px; color: #666666;">SHIP TO</p>
            <p style="font-size: 12px;">${city}, ${state}, ${country}</p>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Product List Section -->
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="margin-top: 20px; background-color: #fafafa; border-radius: 3px; padding: 15px;">
  <tbody>
  ${orderedItems
    .map((orderItem) => {
      const product = orderItem.product; // Access the product from the orderItem
      const calculatedPrice =
        (product.productPrice || 0) * (orderItem.quantity || 1);
      const productImage =
        product.productImages &&
        product.productImages.length > 0 &&
        product.productImages[0];

      return `
        <tr>
          <td style="width: 80px;">
            <img src="${productImage}" alt="${
        product.productTitle || "Unknown Product"
      }" style="width: 60px; height: 60px; border-radius: 8px;" />
          </td>
          <td>
            <p style="font-size: 14px; margin: 0; font-weight: bold;">
              ${product.productTitle || "Unknown Product"}
            </p>
            <p style="font-size: 12px; margin: 0; color: #666666;">
              Color: ${orderItem.color || "N/A"} | Size: ${
        orderItem.size || "N/A"
      } | Quantity: ${orderItem.quantity || 0}
            </p>
          </td>
          <td align="right" style="font-size: 14px; font-weight: bold;">
             Amount: $${calculatedPrice.toFixed(2)}
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 10px 0;">
          </td>
        </tr>
      `;
    })
    .join("")}
</tbody>

    </table>
    <!-- Total Amount Section -->
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="margin-top: 20px;">
      <tbody>
        <tr>
          <td align="right" style="font-size: 16px; font-weight: bold; padding-right: 10px;">

          </td>
          <td align="right" style="font-size: 16px; font-weight: bold;">
            Total Amount: $${Number(totalAmount || 0).toFixed(2)}
          </td>
        </tr>
      </tbody>
    </table>
  </td>
</tr>
</tbody>
</table>
</body>
`;


export const orderUpdateTemplate = (name, orderNumber, orderStatus, note) => {
  return `
    <body style="background-color: #f6f9fc; padding: 10px 0">
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="
        max-width: 37.5em;
        background-color: #ffffff;
        border: 1px solid #f0f0f0;
        padding: 45px;
      "
    >
      <tbody>
        <tr style="width: 100%">
          <td>
            <img
              alt="KNcloset"
              height="80"
              width="80"
              src="https://res.cloudinary.com/dzrrdkd7i/image/upload/v1732136066/zkc3dbnvdep7r5auonip.png"
              style="
                display: block;
                outline: none;
                border: none;
                text-decoration: none;
              "
              width="40"
            />
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
            >
              <tbody>
                <tr>
                  <td>
                    <p
                      style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040"
                    >
                      Hi ${name},
                    </p>
                    <p
                      style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040"
                    >
                      Your order with order number:
                    </p>
                    <p
                      style="font-size:28px;line-height:26px; text-align: center; margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040"
                    >
                      ${ orderNumber }
                    </p>
                    <p style="text-align: center; font-size: 19px">
                      has been updated to ${orderStatus}
                    </p>
                    <p
                      style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040"
                    >
                     ${note}
                    </p>
                    <p
                      style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040"
                    >
                      If you did not make this order or have any concerns,
                      please contact our support team immediately. Thank you for
                      shopping with us!
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <!--/$-->
  </body>
`;
};


export default resetPasswordTemplate;
