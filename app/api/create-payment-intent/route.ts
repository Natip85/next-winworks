import Stripe from "stripe";

import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { CartProductType } from "@/components/product/ProductDetails";
import getCurrentUser from "@/actions/getCurrentUser";
import { FulfillmentStatusLabel } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

const calculateOrderAmount = (items: CartProductType[]) => {
  const totalPrice = items.reduce((acc, item) => {
    const itemTotal = item.price * item.quantity;
    return acc + itemTotal;
  }, 0);
  const price: any = Math.floor(totalPrice);
  return price;
};

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { items, payment_intent_id } = body;
  const total = calculateOrderAmount(items) * 100;

  const orderData = {
    user: { connect: { id: currentUser?.id } },
    totalPrice: total,
    currency: "usd",
    paymentStatus: "pending",
    deliveryStatus: "pending",
    paymentIntentId: payment_intent_id,
    products: items,
    email: "",
    fulfillmentStatus: FulfillmentStatusLabel.UNFULFILLED,
    itemCount: items.length,
    shippingPrice: 0,
    subtotalPrice: 0,
    taxPrice: 0,
    totalDiscounts: 0,
  };

  //Check if the payment intent exists just update the order
  if (payment_intent_id) {
    const current_intent = await stripe.paymentIntents.retrieve(
      payment_intent_id
    );
    if (current_intent) {
      const updated_intent = await stripe.paymentIntents.update(
        payment_intent_id,
        { amount: total }
      );
      //Fetch order with product ids
      const [existing_order, updated_order] = await Promise.all([
        prismadb.order.findFirst({
          where: { paymentIntentId: updated_intent.id },
          // include: { products: true },
        }),
        prismadb.order.update({
          where: { paymentIntentId: updated_intent.id },
          data: {
            totalPrice: total,
            products: items,
          },
        }),
      ]);

      if (!existing_order) {
        return NextResponse.error();
      }
      return NextResponse.json({ paymentIntent: updated_intent });
    }
  } else {
    //Create a new order with prisma
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    orderData.paymentIntentId = paymentIntent.id;
    await prismadb.order.create({
      data: orderData,
    });

    return NextResponse.json({ paymentIntent });
  }
  return NextResponse.error();
}
