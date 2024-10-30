import ApiClient from "@/core/api/ApiClient";
import {
  ACHConfig,
  ACHConfigWithStringDate,
  Counterparty,
  CreateDepositTokenProduct,
  CreateProduct,
  CreateStableCoinProduct,
  CreateVirtualFiatProduct,
  Product,
  UpdateFundsAvailability,
  UpdateProduct,
} from "@/core/api/ApiTypes";
import { PaginationStateType, paginationPageSize } from "@/core/constants";
import CounterpartyRepo from "@/core/repos/CounterpartyRepo";
import ProductRepo from "@/core/repos/ProductRepo";
import { momentToPSTString } from "@/core/utils/dateTimeUtil";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import timestampToDate from "@/core/utils/timestampToDate";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { enqueueSnackbar } from "notistack";

const apiClient = ApiClient.getInstance();
const productRepo: ProductRepo = new ProductRepo(apiClient);
const counterpartyRepo: CounterpartyRepo = new CounterpartyRepo(apiClient);

export type ProductCounterpartyType = "loading" | string | Counterparty[];

interface ProductState {
  products: "loading" | string | Product[];
  counterparties: ProductCounterpartyType;
  refreshProductsTable: boolean;
  counterpartyPagination: PaginationStateType;
}

const initialState: ProductState = {
  products: "loading",
  counterparties: "loading",
  refreshProductsTable: true,
  counterpartyPagination: {
    rowCount: 0,
    pageNumber: -1,
    loadingPage: false,
  },
};

const ProductSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setInitialProductState(state) {
      Object.assign(state, initialState);
    },
    setRefreshProductsTable(state, action) {
      state.refreshProductsTable = action.payload;
    },
    setProductCounterpartyPaginationPageNumber(state, action) {
      state.counterpartyPagination.pageNumber = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state, action) => {
      state.products = "loading";
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.products = action.payload;
    });
    builder.addCase(fetchProductCounterparties.pending, (state, action) => {
      if (state.counterpartyPagination.pageNumber == -1) {
        state.counterparties = "loading";
      }
      state.counterpartyPagination.loadingPage = true;
    });
    builder.addCase(fetchProductCounterparties.fulfilled, (state, action) => {
      if (typeof action.payload == "string") {
        state.counterparties = action.payload;
      } else {
        state.counterparties = action.payload.counterparties;
        state.counterpartyPagination.rowCount = action.payload.rowCount;
        state.counterpartyPagination.pageNumber = action.payload.pageNumber;
      }

      state.counterpartyPagination.loadingPage = false;
    });
  },
});

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async () => {
    try {
      const products = await productRepo.fetchProducts();
      console.log("products", products);
      return products;
    } catch (e: any) {
      return `Error fetching products ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchProductsNew = createAsyncThunk(
  "product/fetchProducts",
  async () => {
    try {
      const products = await productRepo.fetchProducts();
      console.log("products", products);
      return products;
    } catch (e: any) {
      return `Error fetching products ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchProductsTransactionVolume = createAsyncThunk(
  "product/fetchProductsTransactionVolume",
  async (inp: {
    developer: string;
    product: string;
    duration: "week" | "month" | "year";
  }) => {
    try {
      const endDate = moment();
      const startDate = endDate.clone().subtract(1, inp.duration);

      let data = await productRepo.fetchProductTransactionVolume(
        momentToPSTString(startDate, true),
        momentToPSTString(endDate, false),
        inp.product === "All" ? undefined : inp.product
      );

      if (data.length === 0) {
        return [];
      }

      if (inp.developer != "All") {
        data = data.filter((d) => d.tenant_id == inp.developer);
      }

      console.log("transactions volume data:", data);

      const format = inp.duration === "year" ? "YYYY-MM" : "YYYY-MM-DD";

      const groupedData = data.reduce((acc: any, curr: any) => {
        // Convert timestamp to date
        const date = moment(curr.created_at).format(format);
        const type = curr.label;
        let isDebit = curr.label.includes("Debit");
        if (curr.label?.toLowerCase()?.includes("originator")) {
          isDebit = isDebit ? false : true;
        }
        const volume = parseFloat(curr.value.toFixed(2));

        if (!acc[date]) {
          acc[date] = [];
        }

        const existingTypeIndex = acc[date].findIndex(
          (item: any) => item.type === type
        );

        if (existingTypeIndex !== -1) {
          acc[date][existingTypeIndex].volume += volume;
          acc[date][existingTypeIndex].volume = parseFloat(
            acc[date][existingTypeIndex].volume.toFixed(2)
          );
        } else {
          acc[date].push({
            date,
            type,
            volume,
            isDebit,
          });
        }

        return acc;
      }, {});

      const length =
        inp.duration === "week" ? 7 : inp.duration === "month" ? 31 : 12;
      const unit = inp.duration === "year" ? "months" : "days";

      const dates = Array.from({ length }, (_, i) =>
        moment().subtract(i, unit).format(format)
      ).reverse();

      dates.forEach((date) => {
        if (!groupedData[date]) {
          groupedData[date] = [
            {
              date,
              type: "",
              volume: 0,
              isDebit: false,
            },
          ];
        }
      });

      // Sort the data by date and then by volume within each date
      const grouping = Object.entries(groupedData)
        .sort(([dateA], [dateB]) => moment(dateB).diff(moment(dateA)))
        .map(([date, values]) => {
          return (values as any).sort((a: any, b: any) => b.volume - a.volume);
        })
        .flat();

      console.log("transactions volume:", grouping);

      return grouping;
    } catch (e: any) {
      return `Error fetching transactions volume ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchDailyProductBalanceData = createAsyncThunk(
  "product/fetchAllProductBalance",
  async () => {
    try {
      const metricData: {
        created_at?: number | null;
        id?: number | null;
        product_id?: number | null;
        label?: string | null;
        program_id?: number | null;
        customer_id?: number | null;
        tenant_id?: string | null;
        value?: number | null;
      }[] = await productRepo.fetchRootDailyBalanceFromMetrics(
        momentToPSTString(moment().subtract(1, "month"), true),
        momentToPSTString(moment(), false)
      );

      // sort by created_at in ascending order
      metricData.sort((a, b) => {
        return (a.created_at ?? 0) - (b.created_at ?? 0);
      });

      let chartData: {
        label: string;
        hover: string;
        value: number;
      }[] = [];

      metricData.forEach((d) => {
        chartData.push({
          label: d.tenant_id ?? "",
          hover: timestampToDate(d.created_at ?? 0, true),
          value: d.value ?? 0,
        });
      });

      console.log("root metric data:", chartData);

      return chartData;
    } catch (e: any) {
      return `Error fetching product daily balance ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchAllProductBalance = createAsyncThunk(
  "product/fetchAllProductBalance",
  async (developerId?: string | undefined) => {
    try {
      const data: {
        created_at?: number | null;
        id?: number | null;
        product_id?: number | null;
        label?: string | null;
        program_id?: number | null;
        customer_id?: number | null;
        tenant_id?: string | null;
        value?: number | null;
      }[] = await productRepo.fetchProductBalanceFromMetrics();

      // make value positive in case its negative
      data.forEach((d) => {
        if (d.value != null && d.value < 0) {
          d.value = Math.abs(d.value);
        }
      });

      let chartData = [];

      if (developerId) {
        chartData = data.filter((d) => d.tenant_id == developerId);
      } else {
        // group data based of tenant_id
        const groupedData = data.reduce((acc: any, curr: any) => {
          const tenantId = curr.tenant_id;
          if (!acc[tenantId]) {
            acc[tenantId] = [];
          }

          acc[tenantId].push(curr);

          return acc;
        }, {});

        console.log("grouped data:", groupedData);

        // sum up the balance for each tenant_id
        chartData = Object.entries(groupedData).map(
          ([tenantId, values]: any) => {
            const balance = values.reduce((acc: number, curr: any) => {
              return acc + curr.value;
            }, 0);

            return {
              label: tenantId,
              hover: balance,
              value: balance,
            };
          }
        );

        console.log("chart data:", chartData);
      }

      return chartData;
    } catch (e: any) {
      return `Error fetching product balance ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchProductBalance = createAsyncThunk(
  "product/fetchProductBalance",
  async (id: number) => {
    try {
      const balance = await productRepo.fetchProductBalance(id);
      console.log("product balance", balance);
      return balance;
    } catch (e: any) {
      return `Error fetching product balance ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchProductIdsList = createAsyncThunk(
  "product/fetchProductIdsList",
  async () => {
    try {
      const productIds = await productRepo.fetchProductIdsList();
      return productIds;
    } catch (e: any) {
      return `Error fetching products: ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchProductCounterparties = createAsyncThunk(
  "product/fetchProductCounterparties",
  async (data: { id: string; refresh?: boolean }, thunkApi: any) => {
    try {
      const counterparties = await counterpartyRepo.fetchCounterparties(
        data.id,
        paginationPageSize,
        data.refresh != null && data.refresh == true
          ? 0
          : thunkApi.getState().product.counterpartyPagination.pageNumber == -1
          ? 0
          : thunkApi.getState().product.counterpartyPagination.pageNumber
      );
      console.log("Product counterparties", counterparties);
      return {
        counterparties: counterparties.content,
        rowCount: counterparties.totalElements,
        pageNumber: counterparties.number,
      };
    } catch (e: any) {
      return `Error fetching counterparties ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchProduct = createAsyncThunk(
  "product/fetchProduct",
  async (productId: number) => {
    try {
      const product = await productRepo.fetchProduct(productId);
      console.log("product:", product);
      return product;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching product ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
      // enqueueSnackbar(`Error: ${e.message}`, { variant: "error" });
    }

    return null;
  }
);

export const fetchProductNew = createAsyncThunk(
  "product/fetchProduct",
  async (productId: number) => {
    try {
      const product = await productRepo.fetchProduct(productId);
      console.log("product:", product);
      return product;
    } catch (e: any) {
      return `Error fetching product ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchACHConfig = createAsyncThunk(
  "product/fetchACHConfig",
  async (productId: number) => {
    try {
      const achConfig = await productRepo.fetchACHConfig(productId);
      console.log("ach config:", achConfig);
      return achConfig;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching ACH config ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const uploadOnboardingConfigPdfTemplate = createAsyncThunk(
  "product/uploadOnboardingConfigPdfTemplate",
  async (data: { productId: number; file: File }) => {
    try {
      const file = new FormData();
      file.append("file", data.file);
      const achConfig = await productRepo.uploadOnboardingConfigPdfTemplate(
        data.productId,
        file
      );
      return achConfig;
    } catch (e: any) {
      enqueueSnackbar(
        `Error uploading pdf template ${generateErrorMessage(e)}`,
        {
          variant: "error",
          persist: true,
        }
      );
      return null;
    }
  }
);

export const uploadOnboardingConfigFeeSchedule = createAsyncThunk(
  "product/uploadOnboardingConfigFeeSchedule",
  async (data: { productId: number; file: File }) => {
    try {
      const file = new FormData();
      file.append("file", data.file);
      const achConfig = await productRepo.uploadOnboardingConfigFeeSchedule(
        data.productId,
        file
      );
      return achConfig;
    } catch (e: any) {
      enqueueSnackbar(
        `Error uploading fee schedule ${generateErrorMessage(e)}`,
        {
          variant: "error",
          persist: true,
        }
      );
    }

    return null;
  }
);

export const uploadOnboardingConfigLogo = createAsyncThunk(
  "product/uploadOnboardingConfigLogo",
  async (data: { productId: number; file: File }) => {
    try {
      const file = new FormData();
      file.append("file", data.file);
      const achConfig = await productRepo.uploadOnboardingConfigLogo(
        data.productId,
        file
      );
      return achConfig;
    } catch (e: any) {
      enqueueSnackbar(`Error uploading logo ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const createOnboardingUrl = createAsyncThunk(
  "product/createOnboardingUrl",
  async (data: { productId: number; url: string }) => {
    try {
      await productRepo.createOnboardingUrl(data.productId, data.url);
      enqueueSnackbar("Onboarding configuration created!", {
        variant: "success",
      });
    } catch (e: any) {
      enqueueSnackbar(
        `Error creating onboarding url ${generateErrorMessage(e)}`,
        {
          variant: "error",
          persist: true,
        }
      );
    }

    return null;
  }
);

export const createOnboardingConfig = createAsyncThunk(
  "product/createOnboardingConfig",
  async (data: { id: number; url: string; hex: string }) => {
    try {
      await productRepo.createOnboardingConfig(data.id, data.url, data.hex);
      enqueueSnackbar("Onboarding configuration created!", {
        variant: "success",
      });
    } catch (e: any) {
      enqueueSnackbar(`Error creating config ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const updateOnboardingConfigButtonColor = createAsyncThunk(
  "product/updateOnboardingConfigButtonColor",
  async (data: { productId: number; hex: string }) => {
    try {
      await productRepo.updateOnboardingConfigButtonColor(
        data.productId,
        data.hex
      );
      enqueueSnackbar("Onboarding app buttons color updated!", {
        variant: "success",
      });
    } catch (e: any) {
      enqueueSnackbar(
        `Error updating button color ${generateErrorMessage(e)}`,
        {
          variant: "error",
          persist: true,
        }
      );
    }

    return null;
  }
);

export const fetchFundsAvailability = createAsyncThunk(
  "product/fetchACHConfig",
  async (productId: number) => {
    try {
      const achConfig = await productRepo.fetchFundsAvailability(productId);
      return achConfig;
    } catch (e: any) {
      enqueueSnackbar(
        `Error fetching funds availability ${generateErrorMessage(e)}`,
        {
          variant: "error",
          persist: true,
        }
      );
    }

    return null;
  }
);

export const createDepositTokenProduct = createAsyncThunk(
  "product/createDepositTokenProduct",
  async (product: CreateDepositTokenProduct) => {
    try {
      await productRepo.createDepositTokenProduct(product);
    } catch (e: any) {
      enqueueSnackbar(`Error creating product ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const createStableCoinProduct = createAsyncThunk(
  "product/createStableCoinProduct",
  async (product: CreateStableCoinProduct) => {
    try {
      await productRepo.createStableCoinProduct(product);
    } catch (e: any) {
      enqueueSnackbar(`Error creating product ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (product: CreateProduct) => {
    try {
      return await productRepo.createProduct(product);
    } catch (e: any) {
      enqueueSnackbar(`Error creating product ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async (data: { id: number; product: UpdateProduct }) => {
    try {
      await productRepo.updateProduct(data.id, data.product);
    } catch (e: any) {
      enqueueSnackbar(`Error updating product ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }
  }
);

export const updateAchConfig = createAsyncThunk(
  "product/updateAchConfig",
  async (data: { id: number; achConfig: ACHConfig }) => {
    try {
      await productRepo.updateAchConfig(data.id, data.achConfig);
    } catch (e: any) {
      enqueueSnackbar(`Error updating ACH Config ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }
  }
);

export const fetchOnboardingConfig = createAsyncThunk(
  "product/fetchOnboardingConfig",
  async (id: number) => {
    try {
      const config = await productRepo.fetchOnboardingConfig(id);

      return config;
    } catch (e: any) {
      enqueueSnackbar(
        `Error fetching onboarding config ${generateErrorMessage(e)}`,
        {
          variant: "error",
          persist: true,
        }
      );
    }
  }
);

export const updateFundsAvailability = createAsyncThunk(
  "product/updateFundsAvailability",
  async (data: { id: number; fundsAvailability: UpdateFundsAvailability }) => {
    try {
      await productRepo.updateFundsAvailability(
        data.id,
        data.fundsAvailability
      );
    } catch (e: any) {
      enqueueSnackbar(
        `Error updating funds availability ${generateErrorMessage(e)}`,
        {
          variant: "error",
          persist: true,
        }
      );
    }
  }
);

export default ProductSlice;
export const {
  setRefreshProductsTable,
  setInitialProductState,
  setProductCounterpartyPaginationPageNumber,
} = ProductSlice.actions;
