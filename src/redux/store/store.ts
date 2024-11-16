import { useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import IndividualSlice from "../slices/IndividualSlice";
import BusinessSlie from "../slices/BusinessSlice";
import AccountSlice from "../slices/AccountSlice";
import AppSlice from "../slices/AppSlice";
import ProgramSlice from "../slices/ProgramSlice";
import ProductSlice from "../slices/ProductSlice";
import CardManagementSlice from "../slices/CardManagementSlice";
import CustomizableFormSlice from "../slices/CustomizableFormSlice";
import ACHSlice from "../slices/ACHSlice";
import AuthSlice from "../slices/AuthSlice";
import CounterpartySlice from "../slices/CounterpartySlice";
import DeveloperSlice from "../slices/DeveloperSlice";
import LimitsSlice from "../slices/RulesAndLimitsSlice";
import OFACSlice from "../slices/OFACSlice";
import UsermanagementSlice from "../slices/UsermanagementSlice";
import FeeSlice from "../slices/FeeSlice";
import ApiKeySlice from "../slices/ApiKeySlice";
import NocSlice from "../slices/noc_slice";
import ACHProcessingSlice from "../slices/ach_processing_slice";
import ach_return_slice from "../slices/ach_return_slice";
import Transaction from "@/core/svgs/Transaction";
import TransactionSlice from "../slices/TransactionSlice";
import TransactionReviewSlice from "../slices/transaction_review_slice";
import AlertsSlice from "../slices/alerts_slice";
import WireSlice from "../slices/wire_settlement_slice";
import CasesSlice from "../slices/cases_slice";
import WireProcessingSlice from "../slices/wire_processing_slice";
import ClearSightSlice from "../slices/clear_sight_slice";

export const store = configureStore({
  reducer: {
    app: AppSlice.reducer,
    clearSight: ClearSightSlice.reducer,
    auth: AuthSlice.reducer,
    alerts: AlertsSlice.reducer,
    cases: CasesSlice.reducer,
    individual: IndividualSlice.reducer,
    business: BusinessSlie.reducer,
    account: AccountSlice.reducer,
    program: ProgramSlice.reducer,
    product: ProductSlice.reducer,
    cardManagement: CardManagementSlice.reducer,
    customizableForm: CustomizableFormSlice.reducer,
    ach: ACHSlice.reducer,
    noc: NocSlice.reducer,
    counterparty: CounterpartySlice.reducer,
    developer: DeveloperSlice.reducer,
    limits: LimitsSlice.reducer,
    ofac: OFACSlice.reducer,
    userManagement: UsermanagementSlice.reducer,
    fee: FeeSlice.reducer,
    apikey: ApiKeySlice.reducer,
    processing: ACHProcessingSlice.reducer,
    return: ach_return_slice.reducer,
    transaction: TransactionSlice.reducer,
    transactionReview: TransactionReviewSlice.reducer,
    wireSettlement: WireSlice.reducer,
    wireProcessing: WireProcessingSlice.reducer,
  },
});

export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
