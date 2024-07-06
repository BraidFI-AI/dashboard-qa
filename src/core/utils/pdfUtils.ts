// import { PDFCheckBox, PDFDocument, PDFTextField } from "pdf-lib";
// import { Business, Individual } from "../api/ApiTypes";

// export const generatePdf = async (
//   pdf: PDFDocument,
//   business: Business,
//   ubos?: Individual[]
// ) => {
//   // details fields
//   pdf = await setTextField(pdf, "bizName", business.name);
//   pdf = await setTextField(pdf, "dba", business.dba);
//   pdf = await setTextField(pdf, "bizType", business.businessEntityType);
//   pdf = await setTextField(pdf, "bizState", business.incorporationState);
//   pdf = await setTextField(pdf, "bizIdType", business.businessIdType);
//   pdf = await setTextField(pdf, "bizIdNumber", business.idNumber);
//   pdf = await setTextField(pdf, "bizFDate", business.formationDate.toString());
//   pdf = await setTextField(pdf, "bizWebsite", business.website);

//   // address fields
//   pdf = await setTextField(
//     pdf,
//     "addrLine1",
//     business.addresses?.[0]?.line1 ?? ""
//   );
//   pdf = await setTextField(
//     pdf,
//     "addrLine2",
//     business.addresses?.[0]?.line2 ?? ""
//   );
//   pdf = await setTextField(
//     pdf,
//     "addrCity",
//     business.addresses?.[0]?.city ?? ""
//   );
//   pdf = await setTextField(
//     pdf,
//     "addrState",
//     business.addresses?.[0]?.state ?? ""
//   );
//   pdf = await setTextField(pdf, "addrZip", business.addresses?.[0]?.zip ?? "");
//   pdf = await setTextField(pdf, "addrPhone", business.mobilePhone);

//   ubos?.forEach(async (ubo: any, index: number) => {
//     console.log(ubo, index);
//     pdf = await setTextField(pdf, `fName${index + 1}`, ubo.name);
//     pdf = await setTextField(pdf, `email${index + 1}`, ubo.ubo?.email);
//     pdf = await setTextField(pdf, `title${index + 1}`, ubo.ubo?.title);
//     pdf = await setTextField(pdf, `ownership${index + 1}`, ubo.ubo?.ownership);
//   });

//   // Additional Questions:
//   // Question 1: question1
//   // Question 2: question 2
//   // Question 3: question 3

//   return pdf;
// };

// async function setTextField(
//   pdfDoc: PDFDocument,
//   fieldName: string,
//   text: string,
//   fieldType = "text"
// ) {
//   const form = pdfDoc.getForm();

//   let field = form.getFieldMaybe(fieldName);

//   if (!field) {
//     console.log(`${fieldName} field does not exist!`);
//     return pdfDoc;
//   }

//   if (fieldType === "text" && field instanceof PDFTextField) {
//     field.setText(text);
//   } else if (fieldType === "check" && field instanceof PDFCheckBox) {
//     field.check();
//   } else {
//     console.log(`${fieldName} is not a ${fieldType} field!`);
//     return pdfDoc;
//   }

//   return pdfDoc;
// }
