"use client";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { formatPrice } from "@/lib/utils";
import { Input } from "../ui/input";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);
const CheckoutClient = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const {
    cartProducts,
    paymentIntent,
    handleSetPaymentIntent,
    cartTotalAmount,
  } = useCart();

  useEffect(() => {
    if (cartProducts) {
      setLoading(true);
      setError(false);

      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartProducts,
          payment_intent_id: paymentIntent,
        }),
      })
        .then((res) => {
          setLoading(false);
          if (res.status === 401) {
            return router.push("/auth");
          }
          return res.json();
        })
        .then((data) => {
          setClientSecret(data.paymentIntent.client_secret);
          handleSetPaymentIntent(data.paymentIntent.id);
        })
        .catch((error) => {
          setError(true);
          console.log("Error", error);
          toast({
            variant: "destructive",
            description: "Something went wrong",
          });
        });
    }
  }, [cartProducts, paymentIntent]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      labels: "floating",
    },
  };

  const handleSetPaymentSuccess = useCallback((value: boolean) => {
    setPaymentSuccess(value);
  }, []);

  return (
    <div>
      <div className="md:flex md:flex-row flex flex-col-reverse">
        <div className="flex-1 flex md:justify-end p-5">
          <div className="w-full lg:w-2/3">
            {clientSecret && cartProducts && (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm
                  clientSecret={clientSecret}
                  handleSetPaymentSuccess={handleSetPaymentSuccess}
                />
              </Elements>
            )}
          </div>
        </div>
        <div className="flex-1 justify-between bg-stone-100 border-l-2 sticky">
          <ul className=" w-full md:w-fit p-5 md:min-w-[450px] ">
            {cartProducts?.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between mb-5"
              >
                <span className="relative block  size-20">
                  <div className=" absolute top-[-15px] right-[-15px] rounded-full size-6 flex justify-center items-center bg-gray-500  text-white h-fit z-10">
                    {product.quantity}
                  </div>
                  <Image
                    src={product.images[0].url}
                    alt={product.title}
                    fill
                    className="my-0 object-cover transition-[scale,filter] duration-700"
                    style={{
                      position: "absolute",
                      height: "100%",
                      width: "100%",
                      inset: "0px",
                      color: "transparent",
                    }}
                  />
                </span>
                <div>{product.title}</div>
                <div>{formatPrice(product.price)}</div>
              </li>
            ))}
            <Separator className="my-5" />
            <div className="flex items-center justify-between my-3">
              <span className="text-sm">Subtotal</span>
              <span>{formatPrice(cartTotalAmount)}</span>
            </div>
            <div className="flex items-center justify-between my-3">
              <span className="text-sm">Shipping</span>
              <span className="text-xs">Enter shipping address</span>
            </div>
            <div className="flex items-center justify-between my-3">
              <span className="text-sm">Estimated taxes</span>
              <span>$0.00</span>
            </div>
            <div className="flex items-center justify-between my-3">
              <span className="text-2xl">Total</span>
              <span>{formatPrice(cartTotalAmount)}</span>
            </div>
          </ul>
        </div>
      </div>

      {loading && <div className="text-center">Loading checkout...</div>}
      {error && (
        <div className="text-center text-rose-500">Something went wrong...</div>
      )}
      {paymentSuccess && (
        <div className="flex items-center flex-col gap-4">
          <div className="text-teal-600 text-center">Payment success</div>
          <div className="mx-auto">
            <Button onClick={() => router.push("/order")}>
              View your orders
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutClient;
