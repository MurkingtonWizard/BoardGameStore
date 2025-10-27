"use client"
import { PageWrapper, StorePage } from "@/app/Components"

export default function Store() {
  return (
    <PageWrapper>
       {(props) => <StorePage {...props} />}
    </PageWrapper>
  );
}
