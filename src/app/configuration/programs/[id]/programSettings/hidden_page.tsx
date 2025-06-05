// "use client";

// import { Program } from "@/core/api/ApiTypes";
// import { useAppDispatch } from "@/redux/store/store";
// import React, { useEffect, useState } from "react";
// import { SubmitHandler, useForm } from "react-hook-form";
// import Box from "@mui/material/Box";
// import Divider from "@mui/material/Divider";
// import CircularProgress from "@mui/material/CircularProgress";
// import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
// import MyText from "@/core/components/Text/Text";
// import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
// import { CreateProgram } from "@/core/api/ApiTypes";
// import MyBlueButton from "@/core/components/Button/MyBlueButton";
// import { enqueueSnackbar } from "notistack";
// import { fetchProgram, updateProgram } from "@/redux/slices/ProgramSlice";
// import { setTitle } from "@/redux/slices/AppSlice";
// import MyExpandableButton from "@/core/components/Button/MyExpandableButton";
// import BaseUrlSettings from "./components/BaseUrlSettings";

// const programTypeMappings = (type: string) => {
//   if (type === "GOVERNMENT") {
//     return "Government";
//   } else if (type === "FINANCIAL_INSTITUTION") {
//     return "Financial Institution";
//   } else if (type === "CORPORATION") {
//     return "Corporation";
//   } else {
//     return "Other";
//   }
// };

// const programMappings = (type: string) => {
//   if (type === "Government") {
//     return "GOVERNMENT";
//   } else if (type === "Financial Institution") {
//     return "FINANCIAL_INSTITUTION";
//   } else if (type === "Corporation") {
//     return "CORPORATION";
//   } else {
//     return "OTHER";
//   }
// };

// const Settings = () => {
//   const dispatch = useAppDispatch();
//   const [submitting, setSubmitting] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [program, setProgram] = useState<Program | null>(null);

//   const [expandDetails, toggleExpandDetails] = useState(false);
//   const [expandBaseUrl, toggleExpandBaseUrl] = useState(false);

//   useEffect(() => {
//     setLoading(true);
//     dispatch(setTitle("Program"));
//     dispatch(fetchProgram(parseInt(params.id))).then((data: any) => {
//       if (data.payload) {
//         setProgram(data.payload);
//         dispatch(setTitle(data.payload.name));
//       }
//       setLoading(false);
//     });
//   }, [dispatch, params.id]);

//   const {
//     formState: { errors, submitCount, isSubmitted, isValid },
//     control,
//     handleSubmit,
//   } = useForm<CreateProgram>();
//   const onSubmit: SubmitHandler<CreateProgram> = (data: CreateProgram) => {
//     data = { ...data, type: programMappings(data.type) };

//     console.log(data);

//     setSubmitting(true);

//     dispatch(updateProgram({ id: parseInt(params.id), program: data })).then(
//       () => {
//         //   setRefresh(true);
//         enqueueSnackbar("Program updated successfully!", {
//           variant: "success",
//         });
//         setSubmitting(false);
//       }
//     );
//   };

//   useEffect(() => {
//     if (isSubmitted && !isValid) {
//       enqueueSnackbar("Invalid Fields", { variant: "error" });
//     }
//   }, [submitCount, isSubmitted, isValid]);

//   return loading ? (
//     <div className="flex flex-col items-center justify-center pt-10">
//       <CircularProgress></CircularProgress>
//       <div>Loading Prouct Details...</div>
//     </div>
//   ) : program == null ? (
//     <MyText size="md">Program Not found</MyText>
//   ) : (
//     <div>
//       <div className="w-1/3">
//         <MyExpandableButton
//           title="Program Settings"
//           expand={expandDetails}
//           toggleExpand={toggleExpandDetails}
//         />
//         <Divider />
//       </div>
//       <div className="pb-4"></div>
//       {expandDetails && (
//         <form onSubmit={handleSubmit(onSubmit)} className="pb-6">
//           <Box className="flex flex-col w-1/3">
//             <MyText>Program name</MyText>
//             <MyControlledTextField
//               name="name"
//               displayName="Program Name"
//               control={control}
//               errors={errors}
//               rules={
//                 submitting
//                   ? { required: false }
//                   : {
//                       required: true,
//                     }
//               }
//               value={program.name}
//             />
//             <Box className="pb-4"></Box>
//             <MyText>Is Active</MyText>
//             <MyControlledAutocomplete
//               name="isActive"
//               displayName="Is Active"
//               control={control}
//               errors={errors}
//               options={["True", "False"]}
//               rules={
//                 submitting
//                   ? { required: false }
//                   : {
//                       required: true,
//                     }
//               }
//               value={
//                 program.isActive
//                   ? program.isActive.toString()[0].toUpperCase() +
//                     program.isActive.toString().slice(1)
//                   : ""
//               }
//             />
//             <Box className="pb-4"></Box>
//             <MyText>Type</MyText>
//             <MyControlledAutocomplete
//               name="type"
//               displayName="Program Type"
//               control={control}
//               errors={errors}
//               options={[
//                 "Government",
//                 "Financial Institution",
//                 "Corporation",
//                 "Other",
//               ]}
//               rules={
//                 submitting
//                   ? { required: false }
//                   : {
//                       required: true,
//                     }
//               }
//               value={programTypeMappings(program.type ? program.type : "")}
//             />
//             <Box className="pb-8"></Box>
//             <Box className="w-40">
//               <MyBlueButton type="submit" submitting={submitting}>
//                 Update Program
//               </MyBlueButton>
//             </Box>
//           </Box>
//           <div className="pb-4"></div>
//         </form>
//       )}
//       <div className="w-1/3">
//         <MyExpandableButton
//           title="Base Url Settings"
//           expand={expandBaseUrl}
//           toggleExpand={toggleExpandBaseUrl}
//         />
//         <Divider />
//         <div className="pb-4"></div>
//         {expandBaseUrl && <BaseUrlSettings program={program} />}
//       </div>
//     </div>
//   );
// };

// export default Settings;
