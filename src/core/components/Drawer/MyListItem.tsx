"use client";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MyText from "../Text/Text";
import { useCallback, useEffect } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { setTitle } from "@/redux/slices/AppSlice";
import { usePathname } from "next/navigation";
import Badge from "@mui/material/Badge";

type MyListItemProps = {
  name: string;
  path: string;
  selected: string;
  setSelected: any;
  icon: any;
  iconFocused: any;
  subitem?: boolean;
  expandable?: boolean;
  expanded?: boolean;
  badge?: { val: "loading" | string | number; retry: any };
};

const MyListItem: React.FC<MyListItemProps> = ({
  name,
  selected,
  setSelected,
  icon,
  iconFocused,
  subitem = false,
  expandable = false,
  expanded,
  path,
  badge,
}) => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const getNameCallback = useCallback(() => {
    if (name.includes(".")) {
      return name.split(".")[1];
    } else {
      return name;
    }
  }, [name]);

  const iseSelectedCallback = useCallback(() => {
    if (name == "Dashboard" && pathname == "/") {
      return true;
    } else {
      return pathname.includes(path);
    }
  }, [pathname, name, path]);

  useEffect(() => {
    if (iseSelectedCallback()) {
      dispatch(setTitle(getNameCallback()));
    }
  }, [dispatch, iseSelectedCallback, getNameCallback]);

  return (
    <ListItem
      key={getNameCallback()}
      disablePadding
      sx={{
        backgroundColor: subitem
          ? "transparent"
          : iseSelectedCallback()
          ? "#12A7FF"
          : "transparent",
        borderTopLeftRadius: "4px",
        borderBottomLeftRadius: "4px",
        marginY: "4px",
        height: "40px",
      }}
    >
      <ListItemButton
        className="flex flex-row justify-between"
        sx={{
          height: "40px",
          borderTopLeftRadius: "4px",
          borderBottomLeftRadius: "4px",
        }}
        onClick={() => {
          // if (!expandable) {
          //   setSelected(name);
          // }
        }}
      >
        <div className="flex flex-row">
          {badge != null ? (
            <div className="flex flex-row">
              <Badge
                badgeContent={
                  badge.val == "loading" ? (
                    "..."
                  ) : typeof badge.val == "string" ? (
                    <div
                      onClick={(event: any) => {
                        event.stopPropagation();
                        event.preventDefault();
                        if (
                          badge.val != "loading" &&
                          typeof badge.val == "string"
                        ) {
                          dispatch(badge.retry());
                        }
                      }}
                    >
                      Reload
                    </div>
                  ) : (
                    badge.val
                  )
                }
                color="error"
              >
                {iseSelectedCallback() ? iconFocused : icon}
              </Badge>

              <div className="w-[33px] h-full" />
            </div>
          ) : (
            <ListItemIcon>
              {iseSelectedCallback() ? iconFocused : icon}
            </ListItemIcon>
          )}
          <MyText
            white={iseSelectedCallback() ? true : false}
            size="md"
            primary={subitem && iseSelectedCallback() ? true : false}
          >
            {getNameCallback()}
          </MyText>
        </div>
        {expandable &&
          (expanded ? (
            <ExpandLess
              className={`${
                iseSelectedCallback() ? "text-white" : "text-[#6B788E]"
              }`}
            />
          ) : (
            <ExpandMore
              className={`${
                iseSelectedCallback() ? "text-white" : "text-[#6B788E]"
              }`}
            />
          ))}
      </ListItemButton>
    </ListItem>
  );
};

export default MyListItem;
