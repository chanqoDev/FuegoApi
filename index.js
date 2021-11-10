const express = require("express");
const app = express();
const stripe = require("stripe")("sk_test__ENTERYOURS");
// http methods :  GET, POST, PUT, DELETE, PATCH
// define an api endpoint (route, )
app.get("/api", (req, res) => {
  const apiKey = req.query.apiKey;

  // TODO validate apiKey
  // TODO bill user for api usage8
  res.send({ data: "🔥🔥🔥🔥🔥 " });
});

app.listen(8080, () => {
  console.log("🚀 Server ready at http://localhost:8080");
});

// Create a Stripe Checkout Session to create a customer and subscribe them to a plan
app.post("/checkout", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: "_ENTERYOURS",
      },
    ],
    success_url:
      "https://example.com/success.html?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "https://example.com/canceled.html",
  });

  res.send(session);
});
//   res.redirect(303, session.url);

// Listen to webhooks from Stripe when important events happen
app.post("/webhook", async (req, res) => {
  let data;
  let eventType;
  // Check if webhook signing is configured.
  const webhookSecret = "whsec_ENTERYOURS";

  if (webhookSecret) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req["rawBody"],
        signature,
        webhookSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  switch (eventType) {
    case "checkout.session.completed":
      console.log(data);
      break;
    case "invoice.paid":
      // Continue to provision the subscription as payments continue to be made.
      // Store the status in your database and check when a user accesses your service.
      // This approach helps you avoid hitting rate limits.
      break;
    case "invoice.payment_failed":
      // The payment failed or the customer does not have a valid payment method.
      // The subscription becomes past_due. Notify your customer and send them to the
      // customer portal to update their payment information.
      break;
    default:
    // Unhandled event type
  }

  res.sendStatus(200);
});
