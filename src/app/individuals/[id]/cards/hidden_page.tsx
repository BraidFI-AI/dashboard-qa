"use client";

import { AccountCard, Submission } from "@/core/api/ApiTypes";
import ItemRow from "@/core/components/Text/ItemRow";
import MyText from "@/core/components/Text/Text";
import { useAppDispatch } from "@/redux/store/store";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import { setTitle } from "@/redux/slices/AppSlice";
import MyTable from "@/core/components/Table/MyTable";
import { GridEventListener } from "@mui/x-data-grid";
import {
  fetchIndividual,
  // fetchIndividualAccountsCards,
} from "@/redux/slices/IndividualSlice";

const CardsPage = ({ params }: { params: { id: string } }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const [cards, setCards] = useState<AccountCard[] | null>(null);
  const [selectedCard, setSelectedCard] = useState<AccountCard | null>(null);
  const [cardModalOpen, setCardModalOpen] = useState<boolean>(false);

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
    // dispatch(setTitle("Individual Customer"));
    // dispatch(fetchIndividual(parseInt(params.id))).then((individual: any) => {
    //   dispatch(setTitle(individual.payload.name));
    //   if (individual.payload != null) {
    //     dispatch(fetchIndividualAccountsCards(individual.payload)).then(
    //       (data: any) => {
    //         setCards(data.payload);
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
                <ItemRow
                  title="Expiration"
                  value={selectedCard.expiration!}
                ></ItemRow>
                <ItemRow
                  title="Last four"
                  value={selectedCard.lastFour!}
                ></ItemRow>
                <ItemRow
                  title="Virtual"
                  value={selectedCard.virtual!}
                ></ItemRow>
                <ItemRow
                  title="Created At"
                  value={selectedCard.createdAt!}
                ></ItemRow>
                <ItemRow
                  title="Updated At"
                  value={selectedCard.updatedAt!}
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
                width: 120,
              },
              { field: "accountId", headerName: "AccountId", width: 120 },
              {
                field: "embossingName",
                headerName: "Embossing Name",
                flex: 1,
                minWidth: 120,
                maxWidth: 300,
              },
              {
                field: "lastFour",
                headerName: "Last Four",
                flex: 1,
                minWidth: 150,
                maxWidth: 300,
              },
              {
                field: "expiration",
                headerName: "Expiration",
                width: 120,
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
