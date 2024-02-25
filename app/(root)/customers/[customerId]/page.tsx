import { getUserById } from "@/actions/getUserById";
import AddCustomerForm from "@/components/customer/AddCustomerForm";

interface CustomerPageProps {
  params: {
    customerId: string;
  };
}
const Customer = async ({ params }: CustomerPageProps) => {
  const user = await getUserById(params.customerId);

  return (
    <div>
      <AddCustomerForm user={user} />
    </div>
  );
};

export default Customer;
