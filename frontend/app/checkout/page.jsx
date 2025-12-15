import CheckoutForm from "@/components/checkout-form";
import Logo from "@/components/logo";

export default function CheckoutPage() {
  return (
    <>
      <div className="sticky top-0 z-50 bg-white py-3 md:py-4 lg:py-5">
        <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8 xl:max-w-[1600px]">
          <Logo />
        </div>
      </div>
      <main className="bg-background min-h-screen">
        <CheckoutForm />
      </main>
    </>
  );
}
