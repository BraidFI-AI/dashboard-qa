import ApiClient, { Method } from "../api/ApiClient";
import {
  ACHConfig,
  CreateDepositTokenProduct,
  CreateProduct,
  CreateStableCoinProduct,
  CreateVirtualFiatProduct,
  FundsAvailability,
  OnboardingConfig,
  Product,
  ProductTransactionVolume,
  UpdateFundsAvailability,
  UpdateProduct,
} from "../api/ApiTypes";

class ProductRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async fetchProducts() {
    const response = await this.apiClient.http<Product[]>(
      Method.GET,
      "/product"
    );
    return response;
  }

  public async fetchProductTransactionVolume(
    startDate: string,
    endDate: string,
    id?: string
  ) {
    const response = await this.apiClient.http<ProductTransactionVolume[]>(
      Method.GET,
      `/metric/key/product.transaction_type_daily.volume?start=${startDate}&end=${endDate}${
        id ? `&productId=${id}` : ""
      }`
    );
    return response;
  }

  public async fetchProductBalance(id: number) {
    const response = await this.apiClient.http<any>(
      Method.GET,
      `/product/${id}/balance`
    );
    return response;
  }

  public async fetchProductBalanceFromMetrics(id?: number) {
    const response = await this.apiClient.http<
      {
        created_at?: number | null;
        id?: number | null;
        product_id?: number | null;
        label?: string | null;
        program_id?: number | null;
        customer_id?: number | null;
        tenant_id?: string | null;
        value?: number | null;
      }[]
    >(Method.GET, `/metric/key/product.balance`);
    return response;
  }

  public async fetchProductDailyBalanceFromMetrics(id?: number) {
    const response = await this.apiClient.http<
      {
        created_at?: number | null;
        id?: number | null;
        product_id?: number | null;
        label?: string | null;
        program_id?: number | null;
        customer_id?: number | null;
        tenant_id?: string | null;
        value?: number | null;
      }[]
    >(Method.GET, `/metric/key/product.checkpoint.balance`);
    return response;
  }

  public async fetchOnboardingConfig(id: number) {
    const response = await this.apiClient.http<OnboardingConfig[]>(
      Method.GET,
      `/product/${id}/onboardingConfig`
    );
    return response;
  }

  public async uploadOnboardingConfigPdfTemplate(id: number, file: any) {
    try {
      const data = await this.apiClient.uploadFile(
        `/product/${id}/onboardingConfig/pdfTemplate`,
        file
      );

      return data;
    } catch (error) {
      throw error;
    }
  }

  public async uploadOnboardingConfigFeeSchedule(id: number, file: any) {
    try {
      const data = await this.apiClient.uploadFile(
        `/product/${id}/onboardingConfig/feeschedule`,
        file
      );

      return data;
    } catch (error) {
      throw error;
    }
  }

  public async uploadOnboardingConfigLogo(id: number, file: any) {
    try {
      const data = await this.apiClient.uploadFile(
        `/product/${id}/onboardingConfig`,
        file
      );

      return data;
    } catch (error) {
      throw error;
    }
  }

  public async fetchProduct(id: number) {
    const product = await this.apiClient.http<Product>(
      Method.GET,
      `/product/${id}`
    );

    return product;
  }

  public async createDepositTokenProduct(product: CreateDepositTokenProduct) {
    await this.apiClient.http<Product>(
      Method.POST,
      `/product/depositToken`,
      product
    );
  }

  public async createStableCoinProduct(product: CreateStableCoinProduct) {
    await this.apiClient.http<Product>(
      Method.POST,
      `/product/stablecoin`,
      product
    );
  }

  public async createOnboardingUrl(id: number, url: string) {
    try {
      await this.apiClient.http<Product>(
        Method.POST,
        `/product/${id}/onboardingConfig`,
        { onboardingUrl: url }
      );
    } catch (e) {
      throw e;
    }
  }

  public async createOnboardingConfig(id: number, url: string, hex: string) {
    try {
      await this.apiClient.http<Product>(
        Method.POST,
        `/product/${id}/onboardingConfig`,
        { onboardingUrl: url, buttonColor: hex }
      );
    } catch (e) {
      throw e;
    }
  }

  public async updateOnboardingConfigButtonColor(id: number, hex: string) {
    try {
      await this.apiClient.http<Product>(
        Method.PATCH,
        `/product/${id}/onboardingConfig`,
        hex
      );
    } catch (e) {
      throw e;
    }
  }

  public async createProduct(product: CreateProduct) {
    return await this.apiClient.http<Product>(Method.POST, `/product`, product);
  }

  public async updateProduct(id: number, product: UpdateProduct) {
    await this.apiClient.http<Product>(Method.PUT, `/product/${id}`, product);
  }

  public async updateAchConfig(id: number, achConfig: ACHConfig) {
    await this.apiClient.http<Product>(
      Method.PUT,
      `/product/${id}/achConfig`,
      achConfig
    );
  }

  public async updateFundsAvailability(
    id: number,
    fundsAvailability: UpdateFundsAvailability
  ) {
    await this.apiClient.http<any>(
      Method.PUT,
      `/product/${id}/fundsAvailability`,
      fundsAvailability
    );
  }

  public async fetchProductIdsList() {
    const products = await this.apiClient.http<Product[]>(
      Method.GET,
      `/product`
    );

    const productIds: { id: string; name: string }[] = [];
    products.map((product: Product) => {
      if (product.id != null) {
        productIds.push({
          id: product.id.toString(),
          name: product.productName ?? "",
        });
      }
    });

    return productIds;
  }

  public async fetchACHConfig(id: number) {
    const achConfig = await this.apiClient.http<ACHConfig>(
      Method.GET,
      `/product/${id}/achConfig`
    );

    return achConfig;
  }

  public async fetchFundsAvailability(id: number) {
    const achConfig = await this.apiClient.http<FundsAvailability>(
      Method.GET,
      `/product/${id}/fundsAvailability`
    );

    return achConfig;
  }
}

export default ProductRepo;
