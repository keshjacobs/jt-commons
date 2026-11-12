export declare const POINTS_PER_WITHDRAWAL_UNIT = 1000;
export declare const NAIRA_PER_WITHDRAWAL_UNIT = 20;
export declare const MIN_WITHDRAWAL_NAIRA = 20000;
export declare const getActiveCampaign: (at?: Date) => Promise<
  | (import("mongoose").Document<
      unknown,
      {},
      import("jt-models").IPointsCampaign
    > &
      import("jt-models").IPointsCampaign &
      Required<{
        _id: unknown;
      }>)
  | null
>;
export declare const calculateWithdrawal: (
  points: number,
  multiplier?: number,
) => {
  points: number;
  multiplier: number;
  nairaPerThousandPoints: number;
  amount: number;
  meetsMinimum: boolean;
};
export declare const getMinWithdrawalPoints: (multiplier?: number) => number;
