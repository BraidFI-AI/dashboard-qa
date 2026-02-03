"use client";

import { DataGridPro } from "@mui/x-data-grid-pro";
import MyTableToolbar from "./MyTableToolbar";
import React from "react";
import { useSelector } from "react-redux";
// import { drawerWidth } from "../Drawer/MyDrawer";
import {
  pageSizeOptions,
  pageSizeOptionsType,
  paginationPageSize,
} from "@/core/constants";
import { Box } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export type DataGridPaginationType = {
  rowCount: number;
  loading: boolean;
  paginationModel: {
    page: number;
    pageSize: typeof pageSizeOptionsType;
  };
  setPaginationModel: any;
};

type MyTableProps = {
  handleRowClick: any;
  handleCellClick?: any;
  columns: any;
  rows: any;
  apiRef?: any;
  customId?: any;
  expand?: any;
  toggleExpand?: any;
  sortModel?: any;
  exp?: boolean;
  pagination?: DataGridPaginationType;
  columnVisibilityModel?: any;
  hideColumnsButton?: boolean;
  hideFilterButton?: boolean;
  hideDensityButton?: boolean;
  hideSearch?: boolean;
  filterModel?: any;
  sizeOptions?: number[];
};

const UnsortedIcon = () => (
  <Box sx={{ display: "flex", flexDirection: "column", marginLeft: "4px" }}>
    <KeyboardArrowUpIcon
      sx={{ fontSize: "16px", marginBottom: "-8px", color: "#838386" }}
    />
    <KeyboardArrowDownIcon sx={{ fontSize: "16px", color: "#838386" }} />
  </Box>
);

const MyTable: React.FC<MyTableProps> = ({
  handleRowClick,
  handleCellClick,
  columns,
  rows,
  customId = null,
  expand,
  toggleExpand,
  sortModel,
  exp = false,
  pagination,
  columnVisibilityModel,
  hideColumnsButton = false,
  hideFilterButton = false,
  hideDensityButton = false,
  hideSearch = false,
  filterModel,
  sizeOptions = [100],
}) => {
  return (
    <DataGridPro
      /// need to enable pagination for pro (disabled in pro by default)
      pagination
      /// for pagination
      pageSizeOptions={sizeOptions}
      paginationMode={pagination ? "server" : "client"}
      paginationModel={pagination ? pagination.paginationModel : undefined}
      onPaginationModelChange={
        pagination
          ? (params) => {
              pagination.setPaginationModel(params.page, params.pageSize);
            }
          : undefined
      }
      rowCount={pagination ? pagination.rowCount : undefined}
      loading={pagination ? pagination.loading : undefined}
      /// ----------------
      getRowId={customId != null ? customId : null}
      getRowHeight={() => 40}
      disableColumnResize={false}
      onRowClick={handleRowClick}
      onCellClick={handleCellClick}
      disableRowSelectionOnClick
      disableColumnMenu={true}
      className="overflow-hidden"
      sx={{
        height: "auto",
        borderRadius: "6px",
        overflow: "hidden",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        "& .MuiDataGrid-columnHeaders": {
          minHeight: "37px !important",
          maxHeight: "37px !important",
        },
        "& .MuiDataGrid-footerContainer": {
          minHeight: "37px !important",
          maxHeight: "37px !important",
          alignItems: "center !important",
          overflow: "hidden !important",
        },
        "& .MuiTablePagination-toolbar": {
          minHeight: "37px !important",
          maxHeight: "37px !important",
          padding: "0 8px !important",
          overflow: "hidden !important",
        },
        "& .MuiTablePagination-displayedRows": {
          fontSize: "0.875rem !important",
          margin: "0 !important",
        },
        "& .MuiTablePagination-actions": {
          marginLeft: "8px !important",
        },
        "& .MuiTablePagination-actions .MuiIconButton-root": {
          padding: "4px !important",
        },
        "& .MuiDataGrid-columnHeader": {
          backgroundColor: "#F5F5F6",
          minHeight: "37px !important",
          maxHeight: "37px !important",
        },
        "& .MuiDataGrid-columnSeparator": {
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "col-resize",
        },
        "& .MuiDataGrid-columnHeaderTitle": {
          fontSize: "14px",
          fontWeight: 500,
          color: "#121216",
          textOverflow: "clip",
          whiteSpace: "break-spaces",
          lineHeight: 1,
        },
        "& .MuiDataGrid-sortIcon": {
          fontSize: "16px !important",
          opacity: "1 !important",
          color: "#121216",
        },
        "& .MuiDataGrid-columnHeader--sortable .MuiDataGrid-iconButtonContainer":
          {
            visibility: "visible !important",
            width: "auto !important",
          },
        "& .MuiDataGrid-columnHeader--sortable .MuiDataGrid-sortButton": {
          opacity: "1 !important",
          visibility: "visible !important",
        },
        "& .MuiDataGrid-cell": {
          padding: "8px 12px !important",
          fontSize: "0.875rem !important",
          minHeight: "40px !important",
          maxHeight: "40px !important",
          display: "flex !important",
          alignItems: "center !important",
        },
        "& .MuiDataGrid-row": {
          minHeight: "unset !important",
          maxHeight: "unset !important",
        },
        "& .MuiDataGrid-cell:focus": {
          outline: "none",
        },
        "& .MuiDataGrid-cell:focus-within": {
          outline: "none",
        },
        "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
          display: "none",
        },
        "& .my-grid .MuiDataGrid-window": {
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        },
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
        // "& .MuiDataGrid-cell": {
        //   textOverflow: "ellipsis",
        //   whiteSpace: "nowrap",
        //   overflow: "hidden",
        // },
        cursor: "pointer",
        // overflow: "auto",
      }}
      slots={{
        columnSortedAscendingIcon: KeyboardArrowUpIcon,
        columnSortedDescendingIcon: KeyboardArrowDownIcon,
        columnUnsortedIcon: UnsortedIcon,
        toolbar: () => (
          <MyTableToolbar
            expand={false}
            // toggleExpand={toggleExpand}
            exp={exp}
            hideColumnsButton={true}
            hideFilterButton={true}
            hideDensityButton={true}
            hideSearch={true}
          />
        ),
      }}
      columns={columns.map((column: any) => ({
        ...column,
        resizable: true,
      }))}
      rows={rows}
      initialState={{
        pagination: { paginationModel: { pageSize: sizeOptions[0] } },
        columns: {
          columnVisibilityModel: columnVisibilityModel,
        },
        filter: {
          filterModel: filterModel,
        },
        sorting: {
          sortModel: sortModel,
        },
      }}
    />
  );
};

export default MyTable;
