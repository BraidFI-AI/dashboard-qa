// TYPES
export type PaginationStateType = {
  rowCount: number;
  pageNumber: number;
  loadingPage: boolean;
  pageSize?: number;
};

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

export const SCROLLBAR_STYLE =
  "overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-[#12A7FF] scrollbar-thumb-rounded-full scrollbar-track-[#ffffff]";

export const paginationPageSize = 100;
export const pageSizeOptionsType = 100 | 200 | 500;
export const pageSizeOptions = [100, 200, 500];

/// TIMEZONE
export const APP_TIMEZONE = "America/Los_Angeles";

export const ADMIN_SPECIFIC_FEATURE_MESSAGE =
  "This feature is only available for Bank";

export const ADMIN_ROLE = "admin-admin";
export const ADMIN_OPS_ROLE = "admin-ops";
export const DEVELOPER_ROLE = "developer-developer";
export const DEVELOPER_OPS_ROLE = "developer-ops";
export const CUSTOMER_ROLE = "customers";

export const ADMIN_ROUTE = [ADMIN_ROLE, ADMIN_OPS_ROLE];
export const DEVELOPER_ROUTE = [
  DEVELOPER_ROLE,
  DEVELOPER_OPS_ROLE,
  ADMIN_ROLE,
  ADMIN_OPS_ROLE,
];
export const CUSTOMER_ROUTE = [
  CUSTOMER_ROLE,
  DEVELOPER_ROLE,
  DEVELOPER_OPS_ROLE,
  ADMIN_ROLE,
  ADMIN_OPS_ROLE,
];

export const States = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

export const userGroupMapping: any = {
  "Bank Admin": "admin-admin",
  "Bank Ops": "admin-ops",
  "Fintech Admin": "developer-admin",
  "Fintech Ops": "developer-ops",
  // "Fintech Admin": "developers",
  // "Fintech Ops": "developers",
  "": "",
};

export const userGroupMappingToReadableNames: any = {
  "admin-admin": "Bank Admin",
  "admin-ops": "Bank Ops",
  "developer-admin": "Fintech Admin",
  "developer-ops": "Fintech Ops",
  admins: "Bank Admin",
  developers: "Fintech Admin",
  customers: "Customer",
  "": "",
};

export function mapStringToBusinessType(value: string) {
  if (value === "Sole Proprietor") {
    return "SOLE_PROPRIETOR";
  } else if (value === "Limited Liability Company (LLC)") {
    return "LIMITED_LIABILITY_COMPANY";
  } else if (value === "S or C Corporation") {
    return "CORPORATION";
  } else if (value === "General Partnership") {
    return "GENERAL_PARTNERSHIP";
  } else if (value === "Limited Liability Partnership") {
    return "LIMITED_LIABILITY_PARTNERSHIP";
  } else if (value === "Non-Profit Corporation") {
    return "NON_PROFIT";
  } else if (value === "Government Organization") {
    return "GOVERNMENT_ORGANIZATION";
  } else if (value === "Publicly Traded Company") {
    return "PUBLICLY_TRADED_COMPANY";
  } else if (value === "Trusts") {
    return "PUBLICALLY_TRADED_COMPANY";
  } else {
    return "";
  }
}

export function mapBusinessTypeToString(value: string) {
  if (value === "SOLE_PROPRIETOR") {
    return "Sole Proprietor";
  } else if (value === "LIMITED_LIABILITY_COMPANY") {
    return "Limited Liability Company (LLC)";
  } else if (value === "CORPORATION") {
    return "S or C Corporation";
  } else if (value === "GENERAL_PARTNERSHIP") {
    return "General Partnership";
  } else if (value === "LIMITED_LIABILITY_PARTNERSHIP") {
    return "Limited Liability Partnership";
  } else if (value === "NON_PROFIT") {
    return "Non-Profit Corporation";
  } else if (value === "GOVERNMENT_ORGANIZATION") {
    return "Government Organization";
  } else if (value === "PUBLICLY_TRADED_COMPANY") {
    return "Publicly Traded Company";
  } else if (value === "PUBLICALLY_TRADED_COMPANY") {
    return "Trusts";
  } else {
    return "";
  }
}

export const UnauthorisedReturnCodes = ["R05", "R07", "R10", "R11", "R29"];

export const boxStyle = "border-[#F4F5F7] border-[1px] shadow-sm";
