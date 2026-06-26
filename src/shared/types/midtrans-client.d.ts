declare module "midtrans-client" {
  class Snap {
    constructor(config: {
      isProduction: boolean;
      serverKey: string;
      clientKey: string;
    });

    createTransaction(
      parameter: Record<string, unknown>
    ): Promise<{
      token: string;
      redirect_url: string;
    }>;

    createTransactionToken(
      parameter: Record<string, unknown>
    ): Promise<string>;

    createTransactionRedirectUrl(
      parameter: Record<string, unknown>
    ): Promise<string>;
  }

  interface MidtransClient {
    Snap: typeof Snap;
    CoreApi: unknown;
    Iris: unknown;
    MidtransError: unknown;
    SnapBiConfig: unknown;
    SnapBi: unknown;
  }

  const midtransClient: MidtransClient;
  export default midtransClient;
}
