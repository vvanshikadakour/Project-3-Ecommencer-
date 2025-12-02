
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connection from "./db/db.js";
import userRouter from "./Routers/User.js";
import cookieParser from "cookie-parser";
import productsRouter from "./Routers/Products.js";
import cartRouter from "./Routers/Cart.js";
import orderRouter from "./Routers/Order.js";
import addressRouter from "./Routers/Address.js";
import otpRouter from "./Routers/Otp.js";
import router from "./Routers/Pyament.js";

dotenv.config();

connection(process.env.mongodb_uri);

const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:5173", 
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);



app.use(cookieParser());
app.use(express.json());

app.use("/products", productsRouter);
app.use("/user", userRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/address", addressRouter);
app.use("/otp", otpRouter);


app.use("/payment", router);
app.listen(process.env.PORT, () => {
  console.log("✅ Server started on port", process.env.PORT);
});
