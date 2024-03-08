import Stripe from "stripe";
import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    return res.status(400).send("Missing the stripe signature");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return res.status(400).send("Webook error" + err);
  }

  let finalAddress; // Declare finalAddress outside of the switch block

  switch (event.type) {
    // case "payment_intent.created":
    //   const paymentIntent = event.data.object;

    //   console.log("Payment intent was created");
    //   break;
    case "charge.succeeded":
      const charge: any = event.data.object as Stripe.Charge;

      if (typeof charge.payment_intent === "string") {
        finalAddress = {
          ...charge.shipping?.address,
          countryCode: "",
          firstName: "",
          lastName: "",
          fullName: charge.shipping.name,
          phone: "",
          street: "",
          userId: "",
          apartment: "",
        };
        await prismadb.order.update({
          where: { paymentIntentId: charge.payment_intent },
          data: {
            paymentStatus: "complete",
            email: "",
            shippingAddress: finalAddress,
          },
        });
        // const user = await prismadb.user.findUnique({
        //   where: {
        //     id: orderUpdate.userId,
        //   },
        // });

        // try {
        //   const user = orderUpdate.userId;

        //   if (user) {
        //     const updatedAddresses = [finalAddress];
        //     await prismadb.user.update({
        //       where: { id: user },
        //       data: {
        //         addresses: updatedAddresses,
        //       },
        //     });
        //   } else {
        //     console.error("Unable to retrieve current user.");
        //   }
        // } catch (error) {
        //   console.error("Error retrieving current user:", error);
        //   return res.status(500).send("Internal Server Error");
        // }
      }
      break;
    default:
      console.log("Unhandled event type:" + event.type);
  }
  res.json({ received: true });
}
