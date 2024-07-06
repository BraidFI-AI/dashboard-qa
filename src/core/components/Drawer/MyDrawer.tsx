// "use client";

// import * as React from "react";
// import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
// import Box from "@mui/material/Box";
// import MuiDrawer from "@mui/material/Drawer";
// import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
// import Tooltip from "@mui/material/Tooltip";
// import Toolbar from "@mui/material/Toolbar";
// import List from "@mui/material/List";
// import CssBaseline from "@mui/material/CssBaseline";
// import Typography from "@mui/material/Typography";
// import SafetyDividerOutlinedIcon from "@mui/icons-material/SafetyDividerOutlined";
// import IconButton from "@mui/material/IconButton";
// import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
// import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
// import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
// import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
// import PaymentRoundedIcon from "@mui/icons-material/PaymentRounded";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
// import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
// import MyListItem from "./MyListItem";
// import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
// import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
// import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
// import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
// import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
// import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
// import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
// import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
// import MyListItemExpandable from "./MyListItemExpandable";
// import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
// import EqualizerRoundedIcon from "@mui/icons-material/EqualizerRounded";
// import Link from "next/link";
// import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
// import { useAppDispatch } from "@/redux/store/store";
// import { logout } from "@/redux/slices/AuthSlice";
// import { useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
// import BackButton from "./BackButton";
// import Image from "next/image";
// import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
// import { useAuthenticator } from "@aws-amplify/ui-react";
// import { Auth } from "aws-amplify";
// import { InactivityTracker } from "@/core/inactivity_tracker/InactivityTracker";
// import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
// import SyncProblemIcon from "@mui/icons-material/SyncProblem";
// import UploadFileIcon from "@mui/icons-material/UploadFile";
// import YoutubeSearchedForIcon from "@mui/icons-material/YoutubeSearchedFor";
// import {
//   resetAppState,
//   setDrawerClosed,
//   setDrawerOpen,
// } from "@/redux/slices/AppSlice";
// import CableOutlinedIcon from "@mui/icons-material/CableOutlined";
// import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
// import RuleIcon from "@mui/icons-material/Rule";

// export const drawerWidth = 260;

// const openedMixin = (theme: Theme): CSSObject => ({
//   width: drawerWidth,
//   transition: theme.transitions.create("width", {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.enteringScreen,
//   }),
//   overflowX: "hidden",
// });

// const closedMixin = (theme: Theme): CSSObject => ({
//   transition: theme.transitions.create("width", {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   overflowX: "hidden",
//   width: `calc(${theme.spacing(7)} + 8px)`,
//   [theme.breakpoints.up("sm")]: {
//     width: `calc(${theme.spacing(8)} + 8px)`,
//   },
// });

// const DrawerHeader = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "flex-end",
//   padding: theme.spacing(0, 1),
//   // necessary for content to be below app bar
//   ...theme.mixins.toolbar,
// }));

// interface AppBarProps extends MuiAppBarProps {
//   open?: boolean;
// }

// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== "open",
// })<AppBarProps>(({ theme, open }) => ({
//   zIndex: theme.zIndex.drawer + 1,
//   transition: theme.transitions.create(["width", "margin"], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   ...(open && {
//     // zIndex: 0,
//     marginLeft: drawerWidth,
//     width: `calc(100% - ${drawerWidth}px)`,
//     transition: theme.transitions.create(["width", "margin"], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   }),
// }));

// const Drawer = styled(MuiDrawer, {
//   shouldForwardProp: (prop) => prop !== "open",
// })(({ theme, open }) => ({
//   width: drawerWidth,
//   flexShrink: 0,
//   whiteSpace: "nowrap",
//   boxSizing: "border-box",
//   ...(open && {
//     ...openedMixin(theme),
//     "& .MuiDrawer-paper": openedMixin(theme),
//   }),
//   ...(!open && {
//     ...closedMixin(theme),
//     "& .MuiDrawer-paper": closedMixin(theme),
//   }),
// }));

// export default function MyDrawer(props: any) {
//   const dispatch = useAppDispatch();
//   const router = useRouter();
//   const theme = useTheme();
//   const open: boolean = useSelector((state: any) => state.app.drawerOpen);
//   const title: string = useSelector((state: any) => state.app.title);

//   const handleDrawerOpen = () => {
//     dispatch(setDrawerOpen());
//   };

//   const handleDrawerClose = () => {
//     dispatch(setDrawerClosed());
//   };

//   return (
//     <Box
//       sx={{ display: "flex" }}
//       className="h-full overflow-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-thumb-rounded-full scrollbar-track-[#ffffff]"
//     >
//       <CssBaseline />
//       <AppBar
//         position="fixed"
//         open={open}
//         sx={{
//           zIndex: 1,
//           backgroundColor: "white",
//           color: "black",
//           borderBottomWidth: 1,
//           borderBottomColor: "grey",
//         }}
//         elevation={0}
//         enableColorOnDark={true}
//       >
//         <Toolbar
//           sx={{ ...(!open && { ml: 8 }) }}
//           className="flex flex-row justify-between"
//         >
//           <div className="flex flex-row items-center">
//             <BackButton />
//             <Typography
//               variant="h6"
//               noWrap
//               component="div"
//               className="pl-2 pt-[1px]"
//             >
//               {title}
//             </Typography>
//           </div>
//           <IconButton
//             onClick={() => {
//               dispatch(resetAppState());
//               Auth.signOut();
//             }}
//           >
//             <LogoutOutlinedIcon></LogoutOutlinedIcon>
//           </IconButton>
//         </Toolbar>
//       </AppBar>
//       <Drawer
//         variant="permanent"
//         open={open}
//         sx={{ zIndex: 1 }}
//         PaperProps={{
//           className:
//             "overflow-auto overflow-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-thumb-rounded-full scrollbar-track-[#ffffff]",
//         }}
//       >
//         <DrawerHeader
//           className={`flex transition-all delay-200 items-center justify-between`}
//         >
//           <Box className="flex flex-row justify-center items-center">
//             <IconButton
//               style={{ backgroundColor: "transparent" }}
//               color="inherit"
//               onClick={handleDrawerOpen}
//               // onClick={() => {
//               //   console.log("TIMER:", InactivityTracker.getInactiveTime());
//               // }}
//               disableRipple
//             >
//               <Image
//                 alt="Braidfi"
//                 src="/images/braid_logo_black.png"
//                 height={open ? 80 : 60}
//                 width={open ? 80 : 60}
//               ></Image>
//             </IconButton>
//           </Box>
//           <IconButton
//             onClick={handleDrawerClose}
//             sx={{
//               ...(!open && { display: "none" }),
//             }}
//           >
//             {theme.direction === "rtl" ? (
//               <ChevronRightIcon />
//             ) : (
//               <ChevronLeftIcon />
//             )}
//           </IconButton>
//         </DrawerHeader>
//         <List
//           className="ml-1"
//           sx={{
//             // selected and (selected + hover) states
//             "&& .Mui-selected, && .Mui-selected:hover": {
//               bgcolor: "rgb(0, 0, 255)",
//               "&, & .MuiListItemIcon-root": {
//                 color: "white",
//               },
//             },
//             // hover states
//             "& .MuiListItemButton-root:hover": {
//               bgcolor: "rgba(0, 0, 255, 0.1)",
//             },
//           }}
//         >
//           <Tooltip title="Dashboard" placement="right">
//             <div>
//               <Link href="/">
//                 <MyListItem
//                   title="Dashboard"
//                   open={open}
//                   icon={
//                     <EqualizerRoundedIcon className="text-[#6B788E] w-[28px] h-[28px]" />
//                   }
//                   iconFocused={
//                     <EqualizerRoundedIcon className="text-white w-[28px] h-[28px]" />
//                   }
//                   path="/dashboard"
//                 />
//               </Link>
//             </div>
//           </Tooltip>
//           <MyListItemExpandable
//             optionTitle="Transactions"
//             open={open}
//             icon={
//               <ReceiptOutlinedIcon className="text-[#6B788E] w-[28px] h-[28px]" />
//             }
//             iconFocused={
//               <ReceiptOutlinedIcon className="text-white w-[28px] h-[28px]" />
//             }
//             options={[
//               {
//                 title: "Transaction History",
//                 linkPath: "/transactions/transactionHistory",
//                 icon: (
//                   <ReceiptLongIcon className="text-[#6B788E] w-[20px] h-[20px]" />
//                 ),
//                 selectedIcon: (
//                   <ReceiptLongIcon className="text-blue-700 w-[20px] h-[20px]" />
//                 ),
//               },
//               {
//                 title: "Transaction Review",
//                 linkPath: "/transactions/transactionReview",
//                 icon: <RuleIcon className="text-[#6B788E] w-[20px] h-[20px]" />,
//                 selectedIcon: (
//                   <RuleIcon className="text-blue-700 w-[20px] h-[20px]" />
//                 ),
//               },
//             ]}
//             path="transactions"
//           />
//           {/* <Tooltip title="Transactions" placement="right">
//             <div>
//               <Link href="/transactions">
//                 <MyListItem
//                   title="Transactions"
//                   open={open}
//                   icon={
//                     <ReceiptOutlinedIcon className="text-[#6B788E] w-[28px] h-[28px]" />
//                   }
//                   iconFocused={
//                     <ReceiptOutlinedIcon className="text-white w-[28px] h-[28px]" />
//                   }
//                   path="/transaction"
//                 />
//               </Link>
//             </div>
//           </Tooltip> */}
//           <Tooltip title="Individuals" placement="right">
//             <div>
//               <Link href="/individuals">
//                 <MyListItem
//                   title="Individuals"
//                   open={open}
//                   icon={
//                     <SupervisorAccountOutlinedIcon className="text-[#6B788E] w-[28px] h-[28px]" />
//                   }
//                   iconFocused={
//                     <SupervisorAccountOutlinedIcon className="text-white w-[28px] h-[28px]" />
//                   }
//                   path="/individual"
//                 />
//               </Link>
//             </div>
//           </Tooltip>
//           <Tooltip title="Businesses" placement="right">
//             <div>
//               <Link href="/businesses">
//                 <MyListItem
//                   title="Businesses"
//                   open={open}
//                   icon={
//                     <WorkOutlineOutlinedIcon className="text-[#6B788E] w-[28px] h-[28px]" />
//                   }
//                   iconFocused={
//                     <WorkOutlineOutlinedIcon className="text-white w-[28px] h-[28px]" />
//                   }
//                   path="/business"
//                 />
//               </Link>
//             </div>
//           </Tooltip>
//           <Tooltip title="Accounts" placement="right">
//             <div>
//               <Link href="/accounts">
//                 <MyListItem
//                   title="Accounts"
//                   open={open}
//                   icon={
//                     <AccountBalanceWalletOutlinedIcon className="text-[#6B788E] w-[28px] h-[28px]" />
//                   }
//                   iconFocused={
//                     <AccountBalanceWalletOutlinedIcon className="text-white w-[28px] h-[28px]" />
//                   }
//                   path="/account"
//                 />
//               </Link>
//             </div>
//           </Tooltip>
//           <MyListItemExpandable
//             optionTitle="Compliance"
//             open={open}
//             icon={
//               <AssignmentTurnedInOutlinedIcon className="text-[#6B788E] w-[28px] h-[28px]" />
//             }
//             iconFocused={
//               <AssignmentTurnedInOutlinedIcon className="text-white w-6 h-6" />
//             }
//             options={[
//               {
//                 title: "OFAC",
//                 linkPath: "/compliance/ofac",
//                 icon: (
//                   <AdminPanelSettingsOutlinedIcon className="text-[#6B788E] w-[20px] h-[20px]" />
//                 ),
//                 selectedIcon: (
//                   <AdminPanelSettingsOutlinedIcon className="text-blue-700 w-[20px] h-[20px]" />
//                 ),
//               },
//             ]}
//             path="compliance"
//           />
//           <MyListItemExpandable
//             optionTitle="ACH"
//             open={open}
//             icon={
//               <PaymentsOutlinedIcon className="text-[#6B788E] w-[28px] h-[28px]" />
//             }
//             iconFocused={
//               <PaymentsOutlinedIcon className="text-white w-6 h-6" />
//             }
//             options={[
//               {
//                 title: "Settlement",
//                 linkPath: "/ach/settlement",
//                 icon: (
//                   <AccountBalanceOutlinedIcon className="text-[#6B788E] w-[20px] h-[20px]" />
//                 ),
//                 selectedIcon: (
//                   <AccountBalanceOutlinedIcon className="text-blue-700 w-[20px] h-[20px]" />
//                 ),
//               },
//               {
//                 title: "NOC",
//                 linkPath: "/ach/noc",
//                 icon: (
//                   <SyncProblemIcon className="text-[#6B788E] w-[20px] h-[20px]" />
//                 ),
//                 selectedIcon: (
//                   <SyncProblemIcon className="text-blue-700 w-[20px] h-[20px]" />
//                 ),
//               },
//               {
//                 title: "Processing",
//                 linkPath: "/ach/processing",
//                 icon: (
//                   <UploadFileIcon className="text-[#6B788E] w-[20px] h-[20px]" />
//                 ),
//                 selectedIcon: (
//                   <UploadFileIcon className="text-blue-700 w-[20px] h-[20px]" />
//                 ),
//               },
//               {
//                 title: "Return",
//                 linkPath: "/ach/return",
//                 icon: (
//                   <YoutubeSearchedForIcon className="text-[#6B788E] w-[20px] h-[20px]" />
//                 ),
//                 selectedIcon: (
//                   <YoutubeSearchedForIcon className="text-blue-700 w-[20px] h-[20px]" />
//                 ),
//               },
//             ]}
//             path="ach"
//           />
//           <MyListItemExpandable
//             optionTitle="Wire"
//             open={open}
//             icon={
//               <CableOutlinedIcon className="text-[#6B788E] w-[28px] h-[28px]" />
//             }
//             iconFocused={
//               <CableOutlinedIcon className="text-white w-[28px] h-[28px]" />
//             }
//             options={[
//               {
//                 title: "Processing",
//                 linkPath: "/wire/processing",
//                 icon: (
//                   <UploadFileIcon className="text-[#6B788E] w-[20px] h-[20px]" />
//                 ),
//                 selectedIcon: (
//                   <UploadFileIcon className="text-blue-700 w-[20px] h-[20px]" />
//                 ),
//               },
//             ]}
//             path="wire"
//           />
//           <MyListItemExpandable
//             optionTitle="Configurations"
//             open={open}
//             icon={
//               <BuildOutlinedIcon className="text-[#6B788E] w-[28px] h-[28px]" />
//             }
//             iconFocused={
//               <BuildOutlinedIcon className="text-white w-[28px] h-[28px]" />
//             }
//             options={[
//               {
//                 title: "Programs",
//                 linkPath: "/configuration/programs",
//                 icon: (
//                   <GridViewOutlinedIcon className="text-[#6B788E] w-[20px] h-[20px]" />
//                 ),
//                 selectedIcon: (
//                   <GridViewOutlinedIcon className="text-blue-700 w-[20px] h-[20px]" />
//                 ),
//               },
//               {
//                 title: "Products",
//                 linkPath: "/configuration/products",
//                 icon: (
//                   <Inventory2OutlinedIcon className="text-[#6B788E] w-[20px] h-[20px]" />
//                 ),
//                 selectedIcon: (
//                   <Inventory2OutlinedIcon className="text-blue-700 w-[20px] h-[20px]" />
//                 ),
//               },
//               {
//                 title: "Developers",
//                 linkPath: "/configuration/developers",
//                 icon: (
//                   <BadgeOutlinedIcon className="text-[#6B788E] w-[20px] h-[20px]" />
//                 ),
//                 selectedIcon: (
//                   <BadgeOutlinedIcon className="text-blue-700 w-[20px] h-[20px]" />
//                 ),
//               },
//               // {
//               //   title: "Card Management",
//               //   linkPath: "/configuration/cardmanagement",
//               //   icon: (
//               //     <PaymentRoundedIcon className="text-[#6B788E] w-[20px] h-[20px]" />
//               //   ),
//               //   selectedIcon: (
//               //     <PaymentRoundedIcon className="text-blue-700 w-[20px] h-[20px]" />
//               //   ),
//               // },
//               {
//                 title: "Forms",
//                 linkPath: "/configuration/forms",
//                 icon: (
//                   <QuestionAnswerOutlinedIcon className="text-[#6B788E] w-[20px] h-[20px]" />
//                 ),
//                 selectedIcon: (
//                   <QuestionAnswerOutlinedIcon className="text-blue-700 w-[20px] h-[20px]" />
//                 ),
//               },
//               // {
//               //   title: "Transaction Types",
//               //   linkPath: "/configuration/transactionTypes",
//               // },
//             ]}
//             path="configuration"
//           />
//           <MyListItemExpandable
//             optionTitle="Settings"
//             open={open}
//             icon={
//               <SettingsRoundedIcon className="text-[#6B788E] w-[28px] h-[28px]" />
//             }
//             iconFocused={
//               <SettingsRoundedIcon className="text-white w-[28px] h-[28px]" />
//             }
//             options={[
//               {
//                 title: "User Management",
//                 linkPath: "/settings/userManagement",
//                 icon: (
//                   <PersonAddAltOutlinedIcon className="text-[#6B788E] w-[20px] h-[20px]" />
//                 ),
//                 selectedIcon: (
//                   <PersonAddAltOutlinedIcon className="text-blue-700 w-[20px] h-[20px]" />
//                 ),
//               },
//               {
//                 title: "API Key",
//                 linkPath: "/settings/apikey",
//                 icon: (
//                   <KeyOutlinedIcon className="text-[#6B788E] w-[20px] h-[20px]" />
//                 ),
//                 selectedIcon: (
//                   <KeyOutlinedIcon className="text-blue-700 w-[20px] h-[20px]" />
//                 ),
//               },
//             ]}
//             path="setting"
//           />
//         </List>
//       </Drawer>
//       <Box
//         component="main"
//         style={{
//           height: "calc(100vh - 64px)",
//           marginTop: 64,
//         }}
//         sx={{ flexGrow: 1, p: 3 }}
//       >
//         {/* <DrawerHeader /> */}
//         <Box
//           sx={{ width: `calc(100% - ${open ? "100px" : "0px"})` }}
//           className="h-full"
//         >
//           {props.children}
//         </Box>
//       </Box>
//     </Box>
//   );
// }
