import { UserDetail } from "@/components/pages/dashboard/user-detail";

export default function UserDetailPage({ params }) {
  const resolvedParams = params instanceof Promise ? null : params;
  const userId = resolvedParams?.id;
  
  return <UserDetail userId={userId} />;
}

