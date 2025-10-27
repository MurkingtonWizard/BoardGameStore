"use client"
import {LibraryPage, PageWrapper } from "@/app/Components";

export default function Library() {
  return (
      <PageWrapper>
         {(props) => <LibraryPage {...props} />}
      </PageWrapper>
  );
}
