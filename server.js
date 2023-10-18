const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");

const connectDatabase = require("./config/DBconnect.js");
const userRouter = require("./Routes/userRoute.js");
const paymentRouter = require("./Routes/paymentRoute.js");
const adminRouter = require("./Routes/adminRoute.js");
const QuizRouter = require("./Routes/QuizRouter.js");

// Connection to the Database
connectDatabase();

const app = express();

app.use(cors("*"));
app.use(express.json());

app.use(express.static(__dirname + '/public'));

//ADMIN
app.use("/api/admin",adminRouter);

// ROUTES
app.use("/api", userRouter);
app.use("/quiz",QuizRouter);

// PAYMENT ROUTES
app.use("/api/payment", paymentRouter);

app.listen(process.env.PORT, async () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});