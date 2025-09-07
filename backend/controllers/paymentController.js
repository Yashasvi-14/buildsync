import Stripe from 'stripe';

/**
 * @desc    Create a Stripe Payment Intent
 * @route   POST /api/payments/create-payment-intent
 * @access  Private
 */
export const createPaymentIntent = async(req ,res ,next) => {
     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    try {
        const { amount} = req.body;

        if(!amount || isNaN(amount) || amount<=0)
        {
            return res.status(400).json({message: 'Please provide a valid amount'});
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'usd',
            payment_method_types: ['card'],
        });

        res.status(200).json({clientSecret: paymentIntent.client_secret});
    } catch(error) {
        next(error);
    }
};