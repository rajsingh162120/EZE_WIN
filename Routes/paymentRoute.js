const paymentRouter = require("express").Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Middleware for error handling
errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
}

// Middleware for verifying the Razorpay signature
verifySignature = (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.KEY_SECRET)
      .update(sign)
      .digest('hex');
    
    if (razorpay_signature === expectedSign) {
      next();
    } else {
      res.status(400).json({ message: 'Invalid signature sent' });
    }
  } catch (error) {
    next(error);
  }
};

// Create a Razorpay instance
const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

// Create a payment order
paymentRouter.post('/createOrder', async (req, res, next) => {
  try {
    const { Price } = req.body;
    // Ensure Price is a valid number (in paise)
    if (typeof Price !== 'number' || Price <= 0) {
      return res.status(400).json({ message: 'Invalid Price' });
    }
    const options = {
      amount: Price * 100, // Convert Price to paise
      currency: 'INR',
      receipt: crypto.randomBytes(10).toString('hex'),
    };
    instance.orders.create(options, (error, order) => {
      if (error) {
        console.error(error);
        res.status(400).json({ message: 'Something went wrong' });
      } else {
        res.status(200).json({ data: order });
      }
    });
  } catch (error) {
    next(error);
  }
});


// Verify a payment
paymentRouter.post('/verifySignature', verifySignature, async (req, res, next) => {
  res.status(200).json({ message: 'Payment verification successfully' });
});

// Apply error handling middleware
paymentRouter.use(errorHandler);

module.exports = paymentRouter;