"use client";

import { TieredFee as TieredFeeType } from "@/core/api/ApiTypes";
import { useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form";
import MyControlledTextField from "../../TextField/MyControlledTextField";
import MyBlueButton from "../../Button/MyBlueButton";
import MyText from "../../Text/Text";

type TieredFeeProps = {
  tieredFee: TieredFeeType[];
  setTieredFee: (tieredFee: TieredFeeType[]) => void;
};

const TieredFee = ({ tieredFee, setTieredFee }: TieredFeeProps) => {
  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    getValues,
    setValue,
    handleSubmit,
  } = useForm<TieredFeeType>();
  const onSubmit: SubmitHandler<TieredFeeType> = (data: TieredFeeType) => {
    setTieredFee([...tieredFee, data]);
  };

  const removeTieredFee = (index: number) => {
    setTieredFee(tieredFee.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex flex-row gap-4 items-start">
        <div className="w-full">
          <MyText>Amount</MyText>

          <MyControlledTextField
            name="amount"
            displayName="Amount"
            control={control}
            errors={errors}
            rules={{ required: true }}
            value=""
          />
        </div>
        <div className="w-full">
          <MyText>Start Count</MyText>

          <MyControlledTextField
            name="startCount"
            displayName="Start Count"
            control={control}
            errors={errors}
            rules={{ required: true }}
            value=""
          />
        </div>
        <div className="w-full">
          <MyText>End Count</MyText>
          <MyControlledTextField
            name="endCount"
            displayName="End Count"
            control={control}
            errors={errors}
            rules={{ required: true }}
            value=""
          />
        </div>
        <div className="w-fit pt-[20px]">
          <MyBlueButton
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
          >
            Add
          </MyBlueButton>
        </div>
      </div>
    </div>
  );
};

export default TieredFee;
