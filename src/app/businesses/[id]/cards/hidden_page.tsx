"use client";

import { AccountCard, Submission } from "@/core/api/ApiTypes";
import ItemRow from "@/core/components/Text/ItemRow";
import MyText from "@/core/components/Text/Text";
import { timestampToDate } from "@/core/utils/date_time_util";
import {
  fetchBusiness,
  // fetchBusinessAccountsCards,
} from "@/redux/slices/BusinessSlice";
import { useAppDispatch } from "@/redux/store/store";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import { setTitle } from "@/redux/slices/AppSlice";
import MyTable from "@/core/components/Table/MyTable";
import { GridEventListener } from "@mui/x-data-grid";
import { useParams } from "next/navigation";

const cards2dTo1d = (cards2d: any) => {
  let cards: any = [];

  cards2d.forEach((cards1d: any) => {
    cards1d.forEach((card: any) => {
      cards.push(card);
    });
  });

  return cards;
};

const CardsPage = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const [cards, setCards] = useState<AccountCard[] | null>(null);
  const [selectedCard, setSelectedCard] = useState<AccountCard | null>(null);
  const [cardModalOpen, setCardModalOpen] = useState<boolean>(false);
  const params = useParams();
  const ModalBoxstyle = {
    position: "absolute" as any as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: "5px",
    boxShadow: 24,
    p: 4,
  };

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    // getting index from row id

    if (cards) {
      cards.forEach((row: any) => {
        if (row.id == params.id) {
          setSelectedCard(row);
        }
      });

      handleCardModalOpen();
    }
  };
  const handleCardModalOpen = () => setCardModalOpen(true);
  const handleCardModalClose = () => setCardModalOpen(false);

  useEffect(() => {
    // dispatch(setTitle("Business Customer"));
    // dispatch(fetchBusiness(parseInt(params.id))).then((business: any) => {
    //   dispatch(setTitle(business.payload.name));
    //   if (business.payload != null) {
    //     dispatch(fetchBusinessAccountsCards(business.payload)).then(
    //       (data: any) => {
    //         if (data.payload) {
    //           const cards2d = data.payload.filter((cArr: any) => {
    //             return cArr.length != 0;
    //           });
    //           const cards = cards2dTo1d(cards2d);
    //           setCards(cards);
    //           console.log(cards);
    //         }
    //         setLoading(false);
    //       }
    //     );
    //   } else {
    //     setLoading(false);
    //   }
    // });
  }, [dispatch, params.id]);

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center pt-10">
          <CircularProgress></CircularProgress>
          <div>Loading cards...</div>
        </div>
      ) : cards == null ? (
        <MyText size="md">No cards found</MyText>
      ) : (
        <>
          {cards != null && selectedCard != null && (
            <Modal open={cardModalOpen} onClose={handleCardModalClose}>
              <Box className="w-[480px]" sx={ModalBoxstyle}>
                <MyText size="lg">Details</MyText>
                <div className="h-4"></div>
                <ItemRow title="id" value={selectedCard.id!}></ItemRow>
                <ItemRow
                  title="Account ID"
                  value={selectedCard.accountId!}
                ></ItemRow>
                <ItemRow
                  title="Card Management ID"
                  value={selectedCard.cardManagementId!}
                ></ItemRow>
                <ItemRow
                  title="Embossing Name"
                  value={selectedCard.embossingName!}
                ></ItemRow>
                <ItemRow title="Bin" value={selectedCard.bin!}></ItemRow>
                <ItemRow title="Status" value={selectedCard.status!}></ItemRow>
                <ItemRow
                  title="Expiration"
                  value={selectedCard.expiration!}
                ></ItemRow>
                <ItemRow
                  title="Last four"
                  value={selectedCard.lastFour!}
                ></ItemRow>
                <ItemRow
                  title="Masked Pan"
                  value={selectedCard.maskedPan!.toString()}
                ></ItemRow>
                <ItemRow
                  title="Virtual"
                  value={selectedCard.virtual!.toString()}
                ></ItemRow>
                <ItemRow
                  title="Pin enabled"
                  value={selectedCard.pinEnabled!.toString()}
                ></ItemRow>
                <ItemRow
                  title="Created At"
                  value={timestampToDate(selectedCard.createdAt)}
                ></ItemRow>
                <ItemRow
                  title="Updated At"
                  value={timestampToDate(selectedCard.updatedAt)}
                ></ItemRow>
                <div className="h-1"></div>
              </Box>
            </Modal>
          )}
          <MyTable
            columns={[
              {
                field: "id",
                headerName: "ID",
                flex: 1,
                minWidth: 120,
              },
              { field: "accountId", headerName: "Account ID", width: 120 },
              {
                field: "embossingName",
                headerName: "Embossing Name",
                flex: 1,
                minWidth: 180,
              },
              {
                field: "lastFour",
                headerName: "Last Four",
                flex: 1,
                minWidth: 180,
              },
              {
                field: "expiration",
                headerName: "Expiration",
                flex: 1,
                minWidth: 120,
              },
              {
                field: "status",
                headerName: "Status",
                flex: 1,
                minWidth: 120,
              },
              {
                field: "maskedPan",
                headerName: "Masked Pan",
                flex: 1,
                minWidth: 180,
              },
            ]}
            handleRowClick={handleRowClick}
            rows={cards}
          />
        </>
      )}
    </>
  );
};

export default CardsPage;
