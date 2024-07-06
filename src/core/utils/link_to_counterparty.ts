import { Counterparty } from "../api/ApiTypes";

export default function linkToCounterparty(counterparty: Counterparty | null) {
  if (!counterparty) {
    return null;
  }
  if (counterparty.productId != null) {
    return `/configuration/products/${counterparty.productId}/counterparties/${counterparty.id}`;
  } else if (counterparty.accountId != null) {
    return `/accounts/${counterparty.accountId}/counterparties/${counterparty.id}`;
  } else if (counterparty.businessId != null) {
    return `/businesses/${counterparty.businessId}/counterparties/${counterparty.id}`;
  } else if (counterparty.accountId != null) {
    return `/individuals/${counterparty.accountId}/counterparties/${counterparty.id}`;
  } else {
    return null;
  }
}
