import { baseApi } from "@/redux/api/baseApi";

export interface OverviewStats {
    total_members: number;
    total_members_change_pct: number;
    monthly_revenue: number;
    monthly_revenue_change_pct: number;
    active_this_week: number;
    active_this_week_pct_of_total: number;
    questions_answered_total: number;
}

export interface MonthlyRevenuePoint {
    label: string;
    year: number;
    month: number;
    amount: number;
}

export interface SubscriberGrowthPoint {
    label: string;
    year: number;
    month: number;
    count: number;
}

export interface TopQuestion {
    text: string;
    count: number;
}

export interface RecentSignup {
    id: string;
    full_name: string;
    email: string;
    date_joined: string;
    plan: string;
}

export interface OverviewResponse {
    stats: OverviewStats;
    revenue_overview: MonthlyRevenuePoint[];
    subscribers_growth: SubscriberGrowthPoint[];
    top_questions: TopQuestion[];
    recent_signups: RecentSignup[];
}

const overviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOverview: builder.query<OverviewResponse, void>({
            query: () => ({
                url: "/api/admin/overview/",
                method: "GET",
            }),
        }),
    }),
});

export const { useGetOverviewQuery } = overviewApi;