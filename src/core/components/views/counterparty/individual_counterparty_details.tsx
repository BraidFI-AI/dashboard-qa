"use client";

import { Counterparty } from "@/core/api/ApiTypes";
import React, { useEffect, useState } from "react";
import ItemRow from "../../Text/ItemRow";
import { useAppDispatch } from "@/redux/store/store";
import { decrypt } from "@/redux/slices/encryption_slice";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const IndividualCounterpartyDetails = ({
  counterparty,
}: {
  counterparty: Counterparty;
}) => {
  const dispatch = useAppDispatch();
  const [showEncryptedData, setShowEncryptedData] = useState(false);
  const [idNumber, setIdNumber] = useState("••••••••");

  useEffect(() => {
    if (counterparty.idNumber != null) {
      dispatch(decrypt(counterparty.idNumber)).then((d: any) => {
        if (typeof d.payload == "string") {
          setIdNumber(d.payload);
        } else {
          setIdNumber(d.payload.data);
        }
      });
    }
  }, [counterparty.idNumber, dispatch]);

  return (
    <>
      <div className="flex flex-row items-center gap-2 justify-between">
        <ItemRow
          title="ID Number"
          value={showEncryptedData ? idNumber : "••••••••"}
        />
        {showEncryptedData ? (
          <VisibilityOffIcon
            className="text-[#12A7FF]"
            onClick={() => {
              setShowEncryptedData(!showEncryptedData);
            }}
          />
        ) : (
          <VisibilityIcon
            className="text-[#12A7FF]"
            onClick={() => {
              setShowEncryptedData(!showEncryptedData);
            }}
          />
        )}
      </div>

      <ItemRow title="ID Type" value={counterparty.idType ?? ""} />
      <ItemRow
        title="Date of Birth"
        value={`${counterparty.dateOfBirth?.[0]}-${counterparty.dateOfBirth?.[1]}-${counterparty.dateOfBirth?.[2]}`}
      />
    </>
  );
};

export default IndividualCounterpartyDetails;
