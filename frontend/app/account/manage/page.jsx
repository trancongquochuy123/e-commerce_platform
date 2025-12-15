import ManageAccount from "@/components/manage-account";
import Logo from "@/components/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ManageAccountPage() {
  return (
    <>
      <div className="sticky top-0 z-50 bg-white py-3 md:py-4 lg:py-5">
        <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8 xl:max-w-[1600px]">
          <Logo />
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CardHeader>
          <CardTitle>Manage Account</CardTitle>
          <CardDescription>
            Update your account settings and set your preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ManageAccount />
        </CardContent>
      </div>
    </>
  );
}
