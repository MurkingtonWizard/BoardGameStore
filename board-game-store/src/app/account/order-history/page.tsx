"use client"
import { OrderHistoryPage, PageWrapper } from "@/app/Components";

export default function OrderHistory() {
    return (
        <PageWrapper>
            {(props) => <OrderHistoryPage {...props} />}
        </PageWrapper>
    );
}