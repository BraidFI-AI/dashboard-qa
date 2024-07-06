"use client";

import List from "@mui/material/List";
import Collapse from "@mui/material/Collapse";
import MyListItem from "./MyListItem";
import { useState } from "react";
import Link from "next/link";

type MyExpandableListItemProps = {
  name: string;
  path: string;
  selected: string;
  setSelected: any;
  icon: any;
  iconFocused: any;
  options: {
    name: string;
    icon: any;
    iconFocused: any;
    path: string;
    badge?: { val: "loading" | string | number; retry: any };
  }[];
};

const MyExpandableListItem: React.FC<MyExpandableListItemProps> = ({
  name,
  path,
  selected,
  setSelected,
  icon,
  iconFocused,
  options,
}) => {
  const [expand, setExpand] = useState(false);

  return (
    <>
      <div
        onClick={() => {
          setExpand(!expand);
        }}
      >
        <MyListItem
          expandable={true}
          expanded={expand}
          name={name}
          selected={selected}
          setSelected={setSelected}
          icon={icon}
          path={path}
          iconFocused={iconFocused}
        />
      </div>
      <Collapse in={expand} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <div className="pl-4">
            {options.map((item) => {
              return (
                <Link key={`${name}.${item.name}`} href={item.path}>
                  <MyListItem
                    subitem={true}
                    path={item.path}
                    name={item.name}
                    selected={selected}
                    setSelected={setSelected}
                    icon={item.icon}
                    iconFocused={item.iconFocused}
                    badge={item.badge}
                  />
                </Link>
              );
            })}
          </div>
        </List>
      </Collapse>
    </>
  );
};

export default MyExpandableListItem;
