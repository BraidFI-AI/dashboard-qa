"use client";

import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import MuiDrawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MyText from "../Text/Text";
import { useSelector } from "react-redux";
import Image from "next/image";
import { useAppDispatch } from "@/redux/store/store";
import { resetAppState } from "@/redux/slices/AppSlice";
import { signOut } from "aws-amplify/auth";
import MyListItem from "./MyListItem";
import MyExpandableListItem from "./MyListItemExpandable";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import SyncProblemIcon from "@mui/icons-material/SyncProblem";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import YoutubeSearchedForIcon from "@mui/icons-material/YoutubeSearchedFor";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Link from "next/link";
import CloseDrawerIcon from "./../../../../public/icons/close_drawer.svg";
import DashboardIcon from "./../../../../public/icons/dashboard";
import TransactionsIcon from "./../../../../public/icons/transactions";
import TransactionHistoryIcon from "./../../../../public/icons/transaction_history";
import TransactionReviewIcon from "./../../../../public/icons/transaction_review";
import IndividualsIcon from "./../../../../public/icons/individuals";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import BusinessesIcon from "./../../../../public/icons/businesses";
import AccountsIcon from "./../../../../public/icons/accounts";
import ComplianceIcon from "./../../../../public/icons/compliance";
import ACHIcon from "./../../../../public/icons/ach";
import WireIcon from "./../../../../public/icons/wire";
import ConfigurationIcon from "./../../../../public/icons/configuration";
import SettingsIcon from "./../../../../public/icons/settings";
import { usePathname } from "next/navigation";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import {
  ADMIN_OPS_ROLE,
  ADMIN_ROLE,
  DEVELOPER_OPS_ROLE,
  DEVELOPER_ROLE,
  SCROLLBAR_STYLE,
} from "@/core/constants";
import DrawerHeaderButtons from "./drawer_header_buttons";
import { fetchOpenAlertsCount } from "@/redux/slices/alerts_slice";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import ClientLogo from "../client_logo";
import PoweredByBraid from "../powered_by_braid";
import InsightsIcon from "@mui/icons-material/Insights";

const drawerWidth = 310;
const closedDrawerWidth = 80;

const openedMixin = (theme: any): any => ({
  width: drawerWidth,
  backgroundColor: "#F4F5F7",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: any): any => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: "#F4F5F7",
  overflowX: "hidden",
  width: `${closedDrawerWidth}px`,
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(!open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${closedDrawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function PersistentDrawerLeft(props: any) {
  const pathname = usePathname();
  const theme = useTheme();

  const dispatch = useAppDispatch();

  const username = useSelector((state: any) => state.app.username);

  const userType = useSelector((state: any) => state.app.userType);

  const openAlerts = useSelector((state: any) => state.alerts.openAlerts);

  const [open, setOpen] = React.useState(true);
  const title: string = useSelector((state: any) => state.app.title);
  const [selected, setSelcted] = React.useState<string>("Dashboard");

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const achOptions = [
    {
      name: "Processing",
      icon: <UploadFileIcon className="text-[#6B788E] w-[20px] h-[20px]" />,
      iconFocused: (
        <UploadFileIcon className="text-[#12A7FF] w-[20px] h-[20px]" />
      ),
      path: "/ach/processing",
    },
    {
      name: "Return",
      icon: (
        <YoutubeSearchedForIcon className="text-[#6B788E] w-[20px] h-[20px]" />
      ),
      iconFocused: (
        <YoutubeSearchedForIcon className="text-[#12A7FF] w-[20px] h-[20px]" />
      ),
      path: "/ach/return",
    },
    {
      name: "NOC",
      icon: <SyncProblemIcon className="text-[#6B788E] w-[20px] h-[20px]" />,
      iconFocused: (
        <SyncProblemIcon className="text-[#12A7FF] w-[20px] h-[20px]" />
      ),
      path: "/ach/noc",
    },
  ].filter((item) => item !== null);

  let settingsOptions = null;

  if (userType == ADMIN_ROLE || userType == DEVELOPER_ROLE) {
    settingsOptions = (
      <MyExpandableListItem
        name="Settings"
        path={"/settings"}
        selected={selected}
        setSelected={setSelcted}
        icon={<SettingsIcon />}
        iconFocused={<SettingsIcon focused={true} />}
        options={[
          {
            name: "User Management",
            icon: (
              <PersonAddAltOutlinedIcon className="text-[#6B788E] w-[20px] h-[20px]" />
            ),
            iconFocused: (
              <PersonAddAltOutlinedIcon className="text-[#12A7FF] w-[20px] h-[20px]" />
            ),
            path: "/settings/userManagement",
          },
          {
            name: "API Key",
            icon: (
              <KeyOutlinedIcon className="text-[#6B788E] w-[20px] h-[20px]" />
            ),
            iconFocused: (
              <KeyOutlinedIcon className="text-[#12A7FF] w-[20px] h-[20px]" />
            ),
            path: "/settings/apikey",
          },
        ]}
      />
    );
  }

  if (userType == ADMIN_ROLE || userType == ADMIN_OPS_ROLE) {
    achOptions.splice(1, 0, {
      name: "Settlement",
      icon: (
        <AccountBalanceOutlinedIcon className="text-[#6B788E] w-[20px] h-[20px]" />
      ),
      iconFocused: (
        <AccountBalanceOutlinedIcon className="text-[#12A7FF] w-[20px] h-[20px]" />
      ),
      path: "/ach/settlement",
    });
  }

  let wire = null;

  if (userType == ADMIN_ROLE || userType == ADMIN_OPS_ROLE) {
    wire = (
      <MyExpandableListItem
        name="Wire"
        path={"/wire"}
        selected={selected}
        setSelected={setSelcted}
        icon={<WireIcon />}
        iconFocused={<WireIcon focused={true} />}
        options={[
          {
            name: "Processing",
            icon: (
              <UploadFileIcon className="text-[#6B788E] w-[20px] h-[20px]" />
            ),
            iconFocused: (
              <UploadFileIcon className="text-[#12A7FF] w-[20px] h-[20px]" />
            ),
            path: "/wire/processing",
          },
          {
            name: "Settlement",
            icon: (
              <AccountBalanceOutlinedIcon className="text-[#6B788E] w-[20px] h-[20px]" />
            ),
            iconFocused: (
              <AccountBalanceOutlinedIcon className="text-[#12A7FF] w-[20px] h-[20px]" />
            ),
            path: "/wire/settlement",
          },
        ]}
      />
    );
  }

  const configurationOptions = [
    {
      name: "Products",
      icon: (
        <Inventory2OutlinedIcon className="text-[#6B788E] w-[20px] h-[20px]" />
      ),
      iconFocused: (
        <Inventory2OutlinedIcon className="text-[#12A7FF] w-[20px] h-[20px]" />
      ),
      path: "/configuration/products",
    },
    // {
    //   name: "Card Management",
    //   icon: (
    //     <PaymentRoundedIcon className="text-[#6B788E] w-[20px] h-[20px]" />
    //   ),
    //   iconFocused: (
    //     <PaymentRoundedIcon className="text-[#12A7FF] w-[20px] h-[20px]" />
    //   ),
    //   path: "/configuration/cardmanagement",
    // },
    // {
    //   name: "Forms",
    //   icon: (
    //     <QuestionAnswerOutlinedIcon className="text-[#6B788E] w-[20px] h-[20px]" />
    //   ),
    //   iconFocused: (
    //     <QuestionAnswerOutlinedIcon className="text-[#12A7FF] w-[20px] h-[20px]" />
    //   ),
    //   path: "/configuration/forms",
    // },
  ];

  if (userType == ADMIN_ROLE || userType == ADMIN_OPS_ROLE) {
    configurationOptions.splice(0, 0, {
      name: "Programs",
      icon: (
        <GridViewOutlinedIcon className="text-[#6B788E] w-[20px] h-[20px]" />
      ),
      iconFocused: (
        <GridViewOutlinedIcon className="text-[#12A7FF] w-[20px] h-[20px]" />
      ),
      path: "/configuration/programs",
    });
    configurationOptions.splice(0, 0, {
      name: "Developers",
      icon: <BadgeOutlinedIcon className="text-[#6B788E] w-[20px] h-[20px]" />,
      iconFocused: (
        <BadgeOutlinedIcon className="text-[#12A7FF] w-[20px] h-[20px]" />
      ),
      path: "/configuration/developers",
    });
    configurationOptions.splice(3, 0, {
      name: "ClearSight",
      icon: <InsightsIcon className="text-[#6B788E] w-[20px] h-[20px]" />,
      iconFocused: (
        <InsightsIcon className="text-[#12A7FF] w-[20px] h-[20px]" />
      ),
      path: "/configuration/clear_sight",
    });
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        color="inherit"
        className="h-[80px] shadow-none flex flex-row items-center"
      >
        <Toolbar className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-row items-center">
            <div className="w-[5px] h-[40px] bg-[#12A7FF] mr-[10px]" />
            <MyText variant="title" size="smd">
              {title}
            </MyText>
          </div>
          <div className="">
            <DrawerHeaderButtons />
          </div>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <div
          className={`h-full flex flex-col justify-between overflow-y-auto overflow-hidden scrollbar scrollbar-thumb-[#12A7FF] scrollbar-thumb-rounded-full scrollbar-track-[#F4F5F7]`}
        >
          <div>
            <DrawerHeader className={`flex flex-row justify-between`}>
              <div
                onClick={() => {
                  open ? handleDrawerClose() : handleDrawerOpen();
                }}
              >
                <ClientLogo width={open ? 186 : 63} />
              </div>
              {open && (
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === "ltr" ? (
                    <Image
                      src={CloseDrawerIcon}
                      alt="Close Drawer"
                      width={24}
                      height={24}
                    />
                  ) : (
                    <ChevronRightIcon />
                  )}
                </IconButton>
              )}
            </DrawerHeader>
            <div className="pl-2">
              <List>
                <Link href="/">
                  <MyListItem
                    name="Dashboard"
                    path={"/dashboard"}
                    selected={selected}
                    setSelected={setSelcted}
                    icon={<DashboardIcon />}
                    iconFocused={<DashboardIcon focused={true} />}
                  />
                </Link>
                <MyExpandableListItem
                  name="Alerts and Cases"
                  path={"/alerts-and-cases"}
                  selected={selected}
                  setSelected={setSelcted}
                  icon={<AnnouncementIcon className="text-[#6A788E] text-md" />}
                  iconFocused={
                    <AnnouncementIcon className="text-white text-md" />
                  }
                  options={[
                    {
                      name: "Alerts",
                      icon: (
                        <NotificationsNoneIcon className="text-[#6A788E]" />
                      ),
                      iconFocused: (
                        <NotificationsNoneIcon className="text-[#12A7FF]" />
                      ),
                      path: "/alerts-and-cases/alerts",
                      badge: {
                        val: openAlerts,
                        retry: fetchOpenAlertsCount,
                      },
                    },
                    {
                      name: "Cases",
                      icon: <WorkOutlineIcon className="text-[#6A788E]" />,
                      iconFocused: (
                        <WorkOutlineIcon className="text-[#12A7FF]" />
                      ),
                      path: "/alerts-and-cases/cases",
                    },
                  ]}
                />
                <MyExpandableListItem
                  name="Transactions"
                  path={"/transactions"}
                  selected={selected}
                  setSelected={setSelcted}
                  icon={<TransactionsIcon />}
                  iconFocused={<TransactionsIcon focused={true} />}
                  options={[
                    {
                      name: "Transaction History",
                      icon: <TransactionHistoryIcon />,
                      iconFocused: <TransactionHistoryIcon focused={true} />,
                      path: "/transactions/transactionHistory",
                    },
                    {
                      name: "Transaction Review",
                      icon: <TransactionReviewIcon />,
                      iconFocused: <TransactionReviewIcon focused={true} />,
                      path: "/transactions/transactionReview",
                    },
                  ]}
                />
                <Link href="/statements">
                  <MyListItem
                    path={"/statements"}
                    name="Statement"
                    selected={selected}
                    setSelected={setSelcted}
                    icon={
                      <DescriptionOutlinedIcon className="text-[#6B788E] w-[20px] h-[20px]" />
                    }
                    iconFocused={
                      <DescriptionOutlinedIcon className="text-white w-[20px] h-[20px]" />
                    }
                  />
                </Link>
                <Link href="/individuals">
                  <MyListItem
                    path={"/individuals"}
                    name="Individuals"
                    selected={selected}
                    setSelected={setSelcted}
                    icon={<IndividualsIcon />}
                    iconFocused={<IndividualsIcon focused={true} />}
                  />
                </Link>
                <Link href="/businesses">
                  <MyListItem
                    path={"/businesses"}
                    name="Businesses"
                    selected={selected}
                    setSelected={setSelcted}
                    icon={<BusinessesIcon />}
                    iconFocused={<BusinessesIcon focused={true} />}
                  />
                </Link>
                <Link href="/accounts">
                  <MyListItem
                    path={"/accounts"}
                    name="Accounts"
                    selected={selected}
                    setSelected={setSelcted}
                    icon={<AccountsIcon />}
                    iconFocused={<AccountsIcon focused={true} />}
                  />
                </Link>
                <MyExpandableListItem
                  name="Compliance"
                  path={"/compliance"}
                  selected={selected}
                  setSelected={setSelcted}
                  icon={<ComplianceIcon />}
                  iconFocused={<ComplianceIcon focused={true} />}
                  options={[
                    {
                      name: "OFAC",
                      icon: (
                        <AdminPanelSettingsOutlinedIcon className="text-[#6B788E] w-[20px] h-[20px]" />
                      ),
                      iconFocused: (
                        <AdminPanelSettingsOutlinedIcon className="text-[#12A7FF] w-[20px] h-[20px]" />
                      ),
                      path: "/compliance/ofac",
                    },
                    {
                      name: "314a",
                      icon: (
                        <UploadFileOutlinedIcon className="text-[#6B788E] w-[20px] h-[20px]" />
                      ),
                      iconFocused: (
                        <UploadFileOutlinedIcon className="text-[#12A7FF] w-[20px] h-[20px]" />
                      ),
                      path: "/compliance/314a",
                    },
                  ]}
                />
                <MyExpandableListItem
                  name="ACH"
                  path={"/ach"}
                  selected={selected}
                  setSelected={setSelcted}
                  icon={<ACHIcon />}
                  iconFocused={<ACHIcon focused={true} />}
                  options={achOptions}
                />
                {wire}
                <MyExpandableListItem
                  name="Configurations"
                  path={"/configuration"}
                  selected={selected}
                  setSelected={setSelcted}
                  icon={<ConfigurationIcon />}
                  iconFocused={<ConfigurationIcon focused={true} />}
                  options={configurationOptions}
                />
                {settingsOptions}
              </List>
            </div>
          </div>
          <div className="pl-2 pb-4">
            <Divider />
            <ListItem
              key={"Profile"}
              disablePadding
              sx={{
                borderTopLeftRadius: "4px",
                borderBottomLeftRadius: "4px",
                height: "40px",
              }}
            >
              <ListItemButton
                sx={{
                  height: "40px",
                  borderTopLeftRadius: "4px",
                  borderBottomLeftRadius: "4px",
                }}
              >
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary={username} />
              </ListItemButton>
            </ListItem>
            <ListItem
              key={"Logout"}
              disablePadding
              sx={{
                borderTopLeftRadius: "4px",
                borderBottomLeftRadius: "4px",
                height: "40px",
              }}
            >
              <ListItemButton
                onClick={() => {
                  dispatch(resetAppState());
                  signOut();
                }}
                sx={{
                  height: "40px",
                  borderTopLeftRadius: "4px",
                  borderBottomLeftRadius: "4px",
                }}
              >
                <ListItemIcon>
                  <LogoutOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary={"Logout"} />
              </ListItemButton>
            </ListItem>
            {open && (
              <div className="w-[300px] flex flex-row justify-end">
                <div className="pr-[10px]">
                  <PoweredByBraid />
                </div>
              </div>
            )}
          </div>
        </div>
      </Drawer>
      <Box
        component="main"
        className={
          "scrollbar scrollbar-thumb-[#12A7FF] scrollbar-thumb-rounded-full scrollbar-track-[#ffffff]"
        }
        sx={{
          flexGrow: 1,
          p: 3,
          height: "calc(100vh - 50px)",
          width: open
            ? `calc(100vw - ${drawerWidth}px)`
            : `calc(100vw - ${closedDrawerWidth}px)`,
        }}
      >
        <DrawerHeader />
        {props.children}
      </Box>
    </Box>
  );
}
