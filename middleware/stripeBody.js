export const stripeData = (req, res, next) => {
  let dataStream = "";

  // Set the encoding to UTF-8 and listen for 'data' events
  req.setEncoding("utf-8");

  req.on("data", (chunk) => {
    
    dataStream += chunk; // Accumulate data chunks
  });

  
  req.on("end", () => {
    req.rawBody = dataStream; // Store the raw body in req.rawBody
    next(); // Call the next middleware
  });



  req.on("error", (err) => {
    console.error("Error reading request body:", err);
    res.status(500).send("Internal Server Error");
  });
};
