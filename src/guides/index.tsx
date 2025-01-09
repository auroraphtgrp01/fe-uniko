import { accountSource } from "@/guides/account-source.guide";
import { common } from "@/guides/common.guide";
import { expenditureFund } from "@/guides/expenditure-fund.guide";
import { expenditureFundDetail } from "@/guides/expenditureFundDetails.guide";
import { overview } from "@/guides/overview.guide";
import { profile } from "@/guides/profile.guide";
import { trackerTransaction } from "@/guides/tracker-transaction.guide";
import { transaction } from "@/guides/transaction.guide";

export interface Step {
    icon: JSX.Element;
    title: string;
    content: JSX.Element;
    selector: string;
    side: "top" | "right" | "bottom" | "left";
    showControls: boolean;
    pointerPadding?: number;
    pointerRadius?: number;
}

export interface Tour {
    tour: string;
    steps: Step[];
}

export const steps = [
    accountSource,
    common,
    expenditureFund,
    expenditureFundDetail,
    overview,
    profile,
    trackerTransaction,
    transaction
]
