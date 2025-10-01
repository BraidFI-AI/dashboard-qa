"use client";

import MyBlueButton from "../../Button/MyBlueButton";
import { useParams, useRouter } from "next/navigation";

const CreateWirePayment = () => {
  const router = useRouter();
  const params = useParams();
  return (
    <MyBlueButton
      onClick={() => {
        router.push(`/transactions/newTransaction?accountNumber=${params.id}`);
      }}
    >
      Create Payment
    </MyBlueButton>
  );
};

export default CreateWirePayment;
