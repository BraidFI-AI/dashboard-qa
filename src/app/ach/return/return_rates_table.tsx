"use client";

import { ReturnRate } from "@/core/api/ApiTypes";
import MyTable from "@/core/components/Table/MyTable";
import MyLinkText from "@/core/components/Text/LinkText";
import toPercentage from "@/core/utils/formatting_util";
import timestampToDate from "@/core/utils/timestampToDate";
import toDollarFormat from "@/core/utils/toDollarFormat";

interface ReturnRatesTableProps {
  returns: ReturnRate[];
  expand: boolean;
  setExpand: any;
}

const ReturnRatesTable: React.FC<ReturnRatesTableProps> = ({
  returns,
  expand,
  setExpand,
}) => {
  return (
    <MyTable
      // customId={() => uuidv4()}
      expand={expand}
      toggleExpand={
        setExpand
          ? () => {
              setExpand(expand ? false : true);
            }
          : undefined
      }
      handleRowClick={() => {}}
      columns={[
        {
          field: "name",
          headerName: "Name",
          flex: 1,
          minWidth: 200,
          renderCell: (params: any) => (
            <div>
              {
                <MyLinkText link={`/businesses/${params.row.customerId}`}>
                  {params.row.name}
                </MyLinkText>
              }
            </div>
          ),
          valueGetter: (params: any) => params.row.name,
        },
        {
          field: "unauthCount",
          headerName: "Unauthorized return",
          flex: 1,
          minWidth: 120,
        },
        {
          field: "adminCount",
          headerName: "Administrative return",
          flex: 1,
          minWidth: 120,
        },
        {
          field: "otherCount",
          headerName: "Other return",
          flex: 1,
          minWidth: 120,
        },
        {
          field: "totalReturn",
          headerName: "Total Return",
          flex: 1,
          minWidth: 120,
          renderCell: (params: any) => (
            <div>
              {params.row.unauthCount +
                params.row.adminCount +
                params.row.otherCount}
            </div>
          ),
          valueGetter: (params: any) =>
            params.row.unauthCount +
            params.row.adminCount +
            params.row.otherCount,
        },
        {
          field: "totalCount",
          headerName: "Total Origination",
          flex: 1,
          minWidth: 120,
        },
        {
          field: "unauthReturnRate",
          headerName: "Unauthized return rate",
          flex: 1,
          minWidth: 120,
          renderCell: (params: any) => (
            <div>{toPercentage(params.row.unauthReturnRate)}</div>
          ),
          valueGetter: (params: any) =>
            toPercentage(params.row.unauthReturnRate),
        },
        {
          field: "adminReturnRate",
          headerName: "Administrative return rate",
          flex: 1,
          minWidth: 120,
          renderCell: (params: any) => (
            <div>{toPercentage(params.row.adminReturnRate)}</div>
          ),
          valueGetter: (params: any) =>
            toPercentage(params.row.adminReturnRate),
        },
        {
          field: "totalReturnRate",
          headerName: "Total return rate",
          flex: 1,
          minWidth: 120,
          renderCell: (params: any) => (
            <div>{toPercentage(params.row.totalReturnRate)}</div>
          ),
          valueGetter: (params: any) =>
            toPercentage(params.row.totalReturnRate),
        },
      ]}
      rows={returns}
    />
  );
};

export default ReturnRatesTable;
