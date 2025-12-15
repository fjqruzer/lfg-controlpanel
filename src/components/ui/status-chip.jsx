import { Chip } from "./chip";

export function StatusChip({ status, type = "status" }) {
  const getStatusColor = (status, type) => {
    if (type === "booking") {
      return status === "Available" ? "green" : "gray";
    }
    
    if (type === "user") {
      return status === "Active" ? "green" : status === "Banned" ? "red" : "blue-gray";
    }
    
    if (type === "event") {
      switch (status) {
        case "upcoming": return "blue";
        case "ongoing": return "green";
        case "completed": return "blue-gray";
        case "cancelled": return "red";
        default: return "blue-gray";
      }
    }
    
    if (type === "document") {
      switch (status) {
        case "pending": return "amber";
        case "verified": return "green";
        case "rejected": return "red";
        default: return "blue-gray";
      }
    }
    
    if (type === "ticket") {
      switch (status) {
        case "open": return "blue";
        case "in_progress": return "amber";
        case "closed": return "green";
        default: return "blue-gray";
      }
    }
    
    // Default status type
    return status === "Active" ? "green" : "blue-gray";
  };

  return (
    <Chip
      variant="gradient"
      color={getStatusColor(status, type)}
      value={status.toLowerCase()}
      className="py-0.5 px-2 text-[11px] font-medium w-fit"
    />
  );
}

export default StatusChip;