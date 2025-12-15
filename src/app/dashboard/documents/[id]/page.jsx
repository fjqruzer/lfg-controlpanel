'use client';
import React from "react";
import { useParams } from "next/navigation";
import { DocumentDetail } from "@/components/pages/dashboard";

export default function DocumentDetailPage() {
  const params = useParams();
  return <DocumentDetail documentId={params.id} />;
}

