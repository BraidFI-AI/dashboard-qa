import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import AspectRatioRoundedIcon from "@mui/icons-material/AspectRatioRounded";
import React from "react";

type MyTableToolbarProps = {
  expand?: boolean;
  toggleExpand?: any;
  exp?: boolean;
  hideColumnsButton?: boolean;
  hideFilterButton?: boolean;
  hideDensityButton?: boolean;
  hideSearch?: boolean;
};

const MyTableToolbar: React.FC<MyTableToolbarProps> = ({
  expand,
  toggleExpand,
  exp = false,
  hideColumnsButton = false,
  hideFilterButton = false,
  hideDensityButton = false,
  hideSearch = false,
}) => {
  return (
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
  );
};

export default MyTableToolbar;
