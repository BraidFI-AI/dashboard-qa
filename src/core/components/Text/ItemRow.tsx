"use client";

import Box from "@mui/material/Box";
import MyText from "./Text";
import MyLinkText from "./LinkText";
import ItemRowHorizontal from "./ItemRowHorizontal";

interface LinkValue<T> {
  value: T | null | undefined;
  link: string;
}

interface FormItemValues {
  value?:
    | string
    | LinkValue<string>
    | number
    | LinkValue<number>
    | boolean
    | null
    | undefined;
  values?:
    | string[]
    | LinkValue<string>[]
    | number[]
    | LinkValue<number>[]
    | boolean[]
    | null
    | undefined;
}

type ExclusiveFormItemValues =
  | (FormItemValues & {
      value: NonNullable<FormItemValues["value"]>;
      values?: never;
    })
  | (FormItemValues & {
      value?: never;
      values: NonNullable<FormItemValues["values"]>;
    });

type FormItemProps = ExclusiveFormItemValues & {
  title: string;
  boxValues?: boolean;
  primary?: boolean;
  status?: boolean;
  horizontal?: boolean;
  horizontalNoSpace?: boolean;
};

const ItemRow: React.FC<FormItemProps> = ({
  title,
  primary,
  value,
  values,
  boxValues,
  status,
  horizontal = false,
  horizontalNoSpace = false,
}) => {
  return horizontal ? (
    <>
      <ItemRowHorizontal title={title} value={value?.toString() ?? ""} />
      {!horizontalNoSpace && <div className="h-3" />}
    </>
  ) : (
    <Box className={`flex flex-col pb-2`}>
      <div className={`pb-0 text-slate-700`}>
        <MyText size={`sm`}>{title}</MyText>
      </div>
      <div className={`break-all pb-[14px]`}>
        {typeof value !== "undefined" ? (
          value == null ? (
            <MyText status={status} size="md">
              {values}
            </MyText>
          ) : typeof value === "object" && "link" in value ? (
            <MyLinkText link={value.link}>{value.value}</MyLinkText>
          ) : (
            <MyText status={status} size="md" primary={primary}>
              {value}
            </MyText>
          )
        ) : typeof values != "undefined" ? (
          values === null ? (
            <MyText status={status} size="md">
              {values}
            </MyText>
          ) : values.length != 0 && typeof values[0] === "object" ? (
            <Box className="flex flex-row overflow-auto break-keep">
              {(values as LinkValue<string>[] | LinkValue<number>[]).map(
                (val: any, index: number) => {
                  return boxValues == true ? (
                    <Box key={index} className="pr-2">
                      <Box className="py-1 px-2 bg-slate-300 rounded-md">
                        <MyLinkText status={status} key={index} link={val.link}>
                          {val.value}
                        </MyLinkText>
                      </Box>
                    </Box>
                  ) : (
                    <Box key={index} className="pr-2">
                      <MyLinkText status={status} key={index} link={val.link}>
                        {val.value}
                      </MyLinkText>
                    </Box>
                  );
                }
              )}
            </Box>
          ) : (
            <Box className="flex flex-row overflow-auto break-keep scrollbar-hide">
              {(values as string[] | number[] | boolean[]).map(
                (val: any, index: number) => {
                  return boxValues == true ? (
                    <Box key={index} className="pr-2">
                      <Box className="py-1 px-2 bg-slate-300 rounded-md">
                        <MyText
                          status={status}
                          size="md"
                          key={index}
                          primary={primary}
                        >
                          {val}
                        </MyText>
                      </Box>
                    </Box>
                  ) : (
                    <Box key={index} className="pr-2">
                      <MyText
                        status={status}
                        size="md"
                        key={index}
                        primary={primary}
                      >
                        {val}
                      </MyText>
                    </Box>
                  );
                }
              )}
            </Box>
          )
        ) : (
          <MyText size="md">invalid</MyText>
        )}
      </div>
    </Box>
  );
};

// (
//   (value as string[]).map((val: string, index: number) => {
//     return (
//       <MyText key={index} size="md">
//         {val}
//       </MyText>
//     );
//   })
// )

export default ItemRow;
