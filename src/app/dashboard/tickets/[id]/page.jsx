import { TicketDetail } from "@/components/pages/dashboard/ticket-detail";

export default function TicketDetailPage({ params }) {
  const resolvedParams = params instanceof Promise ? null : params;
  const ticketId = resolvedParams?.id;
  
  return <TicketDetail ticketId={ticketId} />;
}

