import ApiClient from "@/core/api/ApiClient";
import { Business, Product, Program } from "@/core/api/ApiTypes";
import BusinessRepo from "@/core/repos/BusinessRepo";
import ClearSightRepo from "@/core/repos/clear_sight_repo";
import ProductRepo from "@/core/repos/ProductRepo";
import ProgramRepo from "@/core/repos/ProgramRepo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const apiClient = ApiClient.getInstance();
const clearSightRepo = new ClearSightRepo(apiClient);
const programRepo = new ProgramRepo(apiClient);
const productRepo = new ProductRepo(apiClient);
const businessRepo = new BusinessRepo(apiClient);

interface ClearSigntState {
  data: "loading" | string | {};
}

const initialState: ClearSigntState = {
  data: "loading",
};

const ClearSightSlice = createSlice({
  name: "ClearSightSlice",
  initialState,
  reducers: {
    setInitialOFACState(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchClearSightData.pending, (state, action) => {
      state.data = "loading";
    });
    builder.addCase(fetchClearSightData.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});
export const fetchClearSightData = createAsyncThunk(
  "ClearSightSlice/fetchClearSightData",
  async () => {
    try {
      const clearSight = {
        name: "root",
        id: "root",
        onClickLink: null,
        children: [] as any,
      };

      const programs: Program[] = await programRepo.fetchPrograms();

      // put each program in the clearSight object in children array
      programs.forEach((program) => {
        clearSight.children.push({
          name: program.name,
          id: program.id,
          onClickLink: `/configuration/programs/${program.id}`,
          children: [],
        });
      });

      const products: Product[] = await productRepo.fetchProducts();

      // put each product in the clearSight object in children array of the program
      products.forEach((product) => {
        const programIndex = programs.findIndex(
          (program) => program.id === product.programId
        );
        clearSight.children[programIndex].children.push({
          name: product.productName,
          id: product.id,
          onClickLink: `/configuration/products/${product.id}`,
          children: [],
        });
      });

      // Fetch all businesses using pagination
      const businesses: Business[] = [];
      let pageNumber = 0;
      let hasNextPage = true;

      while (hasNextPage) {
        const response = await businessRepo.fetchBusinessesPaginated(
          500,
          pageNumber,
          {
            createdAtStart: undefined,
            createdAtEnd: undefined,
            name: undefined,
            productName: undefined,
            status: undefined,
          }
        );
        businesses.push(...response.content);
        hasNextPage = !response.last;
        pageNumber++;
      }

      // put each business in the clearSight object in children array of the product
      businesses.forEach((business) => {
        const programId = products.find(
          (prod) => prod.id === business.productId
        )?.programId;

        if (programId != null) {
          const programIndex = clearSight.children.findIndex(
            (d: any) => d.id === programId
          );

          const productIndex = clearSight.children[
            programIndex
          ].children.findIndex((d: any) => d.id === business.productId);

          clearSight.children[programIndex].children[
            productIndex
          ].children.push({
            name: business.name,
            onClickLink: `/businesses/${business.id}`,
          });
        }
      });

      console.log("clearSight data", clearSight);

      return clearSight;
    } catch (e: any) {
      return `Error fetching clearSight data ${generateErrorMessage(e)}`;
    }
  }
);

export default ClearSightSlice;
export const { setInitialOFACState } = ClearSightSlice.actions;
