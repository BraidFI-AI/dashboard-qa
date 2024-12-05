"use client";

import {
  DataGridPro,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid-pro";
import MyTableToolbar from "./MyTableToolbar";
import React from "react";
import { useSelector } from "react-redux";
// import { drawerWidth } from "../Drawer/MyDrawer";
import {
  pageSizeOptions,
  pageSizeOptionsType,
  paginationPageSize,
} from "@/core/constants";
import { Box, Button } from "@mui/material";
import AspectRatioRoundedIcon from "@mui/icons-material/AspectRatioRounded";

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
      onRowClick={handleRowClick}
      onCellClick={handleCellClick}
      disableRowSelectionOnClick
      disableColumnMenu={true}
      className="overflow-hidden"
      sx={{
        "& .MuiDataGrid-columnHeaderTitle": {
          textOverflow: "clip",
          whiteSpace: "break-spaces",
          lineHeight: 1,
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
        overflow: "auto",
      }}
      slots={{
        toolbar: () => (
          <GridToolbarContainer className="flex flex-row justify-between bg-[#F4F5F7]">
            <Box>
              {hideColumnsButton == false && (
                <GridToolbarColumnsButton
                  slotProps={{ button: { className: "text-[#12A7FF]" } }}
                />
              )}
              {hideFilterButton == false && (
                <GridToolbarFilterButton
                  slotProps={{ button: { className: "text-[#12A7FF]" } }}
                />
              )}
              {hideDensityButton == false && (
                <GridToolbarDensitySelector
                  slotProps={{ button: { className: "text-[#12A7FF]" } }}
                />
              )}
              {toggleExpand && (
                <Button
                  onClick={toggleExpand}
                  className="text-[#12A7FF]"
                  style={{ letterSpacing: 0 }}
                >
                  <AspectRatioRoundedIcon
                    fontSize="small"
                    sx={{ marginRight: "10px" }}
                  />
                  {expand ? "EXPAND" : "COLLAPSE"}
                </Button>
              )}
            </Box>
            <Box>
              {hideSearch == false && <GridToolbarQuickFilter />}
              {exp && (
                <GridToolbarExport
                  printOptions={{ disableToolbarButton: true }}
                  slotProps={{ button: { className: "text-[#12A7FF]" } }}
                />
              )}
            </Box>
          </GridToolbarContainer>
        ),
      }}
      // slotProps={{
      //   toolbar: {
      //     expand: expand,
      //     toggleExpand: toggleExpand,
      //     exp: exp,
      //     hideColumnsButton: hideColumnsButton,
      //     hideFilterButton: hideFilterButton,
      //     hideDensityButton: hideDensityButton,
      //     hideSearch: hideSearch,
      //   },
      // }}
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
