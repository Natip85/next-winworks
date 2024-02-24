"use client";

import { formatPrice } from "@/lib/utils";

import {
  PaymentElement,
  useElements,
  useStripe,
  AddressElement,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useCart } from "@/hooks/useCart";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface CheckoutFormProps {
  clientSecret: string;
  handleSetPaymentSuccess: (value: boolean) => void;
}
const CheckoutForm = ({
  clientSecret,
  handleSetPaymentSuccess,
}: CheckoutFormProps) => {
  const { toast } = useToast();
  const { cartTotalAmount, handleClearCart, handleSetPaymentIntent } =
    useCart();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const formattedPrice = formatPrice(cartTotalAmount);

  useEffect(() => {
    if (!stripe) {
      return;
    }
    if (!clientSecret) {
      return;
    }
    handleSetPaymentSuccess(false);
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);
    stripe
      .confirmPayment({
        elements,
        redirect: "if_required",
      })
      .then((result) => {
        if (!result.error) {
          toast({
            variant: "success",
            description: "Payment success",
          });
          handleClearCart();
          handleSetPaymentSuccess(true);
          handleSetPaymentIntent(null);
        }
        setIsLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit} id="payment-form">
      <div>
        <h3 className="text-2xl font-semibold mb-3">Contact</h3>
        <Input placeholder="Email" />
      </div>
      <h3 className="text-2xl font-semibold my-3">Delivery</h3>
      <AddressElement
        options={{ mode: "shipping", allowedCountries: ["US", "CA", "UK"] }}
      />
      <h2 className="font-semibold mt-4 mb-2">Payment information</h2>
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <div className="py-4 text-center text-slate-700 text-xl font-bold">
        Total: {formattedPrice}
      </div>
      <div>
        <Button disabled={isLoading || !stripe || !elements} className="w-full">
          {isLoading ? "Processing..." : "Pay now"}
        </Button>
      </div>
    </form>
  );
};

export default CheckoutForm;
