// TYPES
export type PaginationStateType = {
  rowCount: number;
  pageNumber: number;
  loadingPage: boolean;
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

export const UnauthorisedReturnCodes = ["R05", "R07", "R10", "R11", "R29"];
