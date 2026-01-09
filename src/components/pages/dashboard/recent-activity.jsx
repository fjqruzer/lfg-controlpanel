"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
} from "@/components/ui";
import {
  UserPlusIcon,
  CalendarDaysIcon,
  MapPinIcon,
  TicketIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { getUserAvatarUrl } from "@/lib/imageUrl";
import {
  getAdminUsers,
} from "@/services/adminUserService";
import { getAdminEvents } from "@/services/adminEventService";
import { getAdminVenues } from "@/services/adminVenueService";
import { getAdminTickets } from "@/services/adminTicketService";
import { getAdminDocuments } from "@/services/adminDocumentService";
import { getAdminTeams } from "@/services/adminTeamService";
import { getAdminCoaches } from "@/services/adminCoachService";
import { getAuditLogs } from "@/services/adminAuditService";

/**
 * Recent Activity Component
 * Aggregates recent activities across all entity types based on existing routes
 */
export function RecentActivity({ limit = 20, showHeader = true }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRecentActivity = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Fetch recent items from all entity types in parallel
        const [
          auditLogsResult,
          recentUsersResult,
          recentEventsResult,
          recentVenuesResult,
          recentTicketsResult,
          recentDocumentsResult,
          recentTeamsResult,
          recentCoachesResult,
        ] = await Promise.allSettled([
          getAuditLogs({ per_page: limit }),
          getAdminUsers({ per_page: 5, sort_by: "created_at", sort_order: "desc" }),
          getAdminEvents({ per_page: 5, sort_by: "created_at", sort_order: "desc" }),
          getAdminVenues({ per_page: 5, sort_by: "created_at", sort_order: "desc" }),
          getAdminTickets({ per_page: 5, sort_by: "created_at", sort_order: "desc" }),
          getAdminDocuments({ per_page: 5, sort_by: "created_at", sort_order: "desc" }),
          getAdminTeams({ per_page: 5 }),
          getAdminCoaches({ per_page: 5 }),
        ]);

        const allActivities = [];

        // Process audit logs if available
        if (auditLogsResult.status === "fulfilled" && auditLogsResult.value?.data) {
          auditLogsResult.value.data.forEach((log) => {
            allActivities.push({
              id: `audit-${log.id}`,
              type: log.action || log.type || "audit",
              entity_type: log.entity_type,
              entity_id: log.entity_id,
              title: getAuditLogTitle(log),
              description: getAuditLogDescription(log),
              icon: getAuditLogIcon(log),
              color: getAuditLogColor(log),
              timestamp: log.created_at || log.timestamp,
              link: getAuditLogLink(log),
              user: log.user || log.admin || log.actor,
            });
          });
        }

        // Process recent users
        if (recentUsersResult.status === "fulfilled") {
          const users = Array.isArray(recentUsersResult.value?.data)
            ? recentUsersResult.value.data
            : Array.isArray(recentUsersResult.value)
            ? recentUsersResult.value
            : [];
          
          users.slice(0, 3).forEach((user) => {
            allActivities.push({
              id: `user-${user.id}`,
              type: "user_registration",
              entity_type: "user",
              entity_id: user.id,
              title: "New User Registration",
              description: `${user.first_name || ""} ${user.last_name || ""} (@${user.username || user.email?.split("@")[0] || "user"}) just registered`,
              icon: UserPlusIcon,
              color: "text-blue-500",
              timestamp: user.created_at,
              link: `/dashboard/users/${user.id}`,
              user: user,
            });
          });
        }

        // Process recent events
        if (recentEventsResult.status === "fulfilled") {
          const events = Array.isArray(recentEventsResult.value?.data)
            ? recentEventsResult.value.data
            : Array.isArray(recentEventsResult.value)
            ? recentEventsResult.value
            : [];
          
          events.slice(0, 3).forEach((event) => {
            allActivities.push({
              id: `event-${event.id}`,
              type: "event_created",
              entity_type: "event",
              entity_id: event.id,
              title: "Event Created",
              description: `${event.name || "New Event"}${event.venue ? ` at ${event.venue.name}` : ""}${event.date ? ` - ${new Date(event.date).toLocaleDateString()}` : ""}`,
              icon: CalendarDaysIcon,
              color: "text-green-500",
              timestamp: event.created_at,
              link: `/dashboard/events/${event.id}`,
            });
          });
        }

        // Process recent venues with verification status
        if (recentVenuesResult.status === "fulfilled") {
          const venues = Array.isArray(recentVenuesResult.value?.data)
            ? recentVenuesResult.value.data
            : Array.isArray(recentVenuesResult.value)
            ? recentVenuesResult.value
            : [];
          
          venues.slice(0, 3).forEach((venue) => {
            if (venue.verified_at) {
              allActivities.push({
                id: `venue-verified-${venue.id}`,
                type: "venue_verified",
                entity_type: "venue",
                entity_id: venue.id,
                title: "Venue Verified",
                description: `${venue.name || "Venue"} verified and now active`,
                icon: CheckCircleIcon,
                color: "text-green-500",
                timestamp: venue.verified_at,
                link: `/dashboard/venues/${venue.id}`,
              });
            } else if (venue.created_at) {
              allActivities.push({
                id: `venue-${venue.id}`,
                type: "venue_submitted",
                entity_type: "venue",
                entity_id: venue.id,
                title: "New Venue Submission",
                description: `${venue.name || "Venue"} submitted for verification`,
                icon: MapPinIcon,
                color: "text-purple-500",
                timestamp: venue.created_at,
                link: `/dashboard/venues/${venue.id}`,
              });
            }
          });
        }

        // Process recent tickets
        if (recentTicketsResult.status === "fulfilled") {
          const tickets = Array.isArray(recentTicketsResult.value?.data)
            ? recentTicketsResult.value.data
            : Array.isArray(recentTicketsResult.value)
            ? recentTicketsResult.value
            : [];
          
          tickets.slice(0, 3).forEach((ticket) => {
            const isResolved = ticket.status === "resolved" || ticket.resolved_at;
            allActivities.push({
              id: `ticket-${ticket.id}`,
              type: isResolved ? "ticket_resolved" : "ticket_created",
              entity_type: "ticket",
              entity_id: ticket.id,
              title: isResolved ? "Support Ticket Resolved" : "Support Ticket Created",
              description: `Ticket #${ticket.id || ticket.ticket_number}: ${ticket.subject || ticket.title || "Support request"}`,
              icon: TicketIcon,
              color: isResolved ? "text-green-500" : "text-orange-500",
              timestamp: ticket.resolved_at || ticket.created_at,
              link: `/dashboard/tickets/${ticket.id}`,
            });
          });
        }

        // Process recent documents with verification status
        if (recentDocumentsResult.status === "fulfilled") {
          const documents = Array.isArray(recentDocumentsResult.value?.data)
            ? recentDocumentsResult.value.data
            : Array.isArray(recentDocumentsResult.value)
            ? recentDocumentsResult.value
            : [];
          
          documents.slice(0, 3).forEach((doc) => {
            if (doc.verified_at) {
              allActivities.push({
                id: `doc-verified-${doc.id}`,
                type: "document_verified",
                entity_type: "document",
                entity_id: doc.id,
                title: "Document Verified",
                description: `${doc.document_name || "Document"} for ${doc.entity_name || doc.user?.username || "entity"} verified`,
                icon: CheckCircleIcon,
                color: "text-green-500",
                timestamp: doc.verified_at,
                link: `/dashboard/documents/${doc.id}`,
              });
            } else if (doc.rejected_at) {
              allActivities.push({
                id: `doc-rejected-${doc.id}`,
                type: "document_rejected",
                entity_type: "document",
                entity_id: doc.id,
                title: "Document Rejected",
                description: `${doc.document_name || "Document"} for ${doc.entity_name || doc.user?.username || "entity"} rejected`,
                icon: XCircleIcon,
                color: "text-red-500",
                timestamp: doc.rejected_at,
                link: `/dashboard/documents/${doc.id}`,
              });
            } else if (doc.created_at) {
              allActivities.push({
                id: `doc-${doc.id}`,
                type: "document_uploaded",
                entity_type: "document",
                entity_id: doc.id,
                title: "Document Uploaded",
                description: `${doc.document_name || "New document"} uploaded for ${doc.entity_name || doc.user?.username || "entity"}`,
                icon: DocumentTextIcon,
                color: "text-blue-500",
                timestamp: doc.created_at,
                link: `/dashboard/documents/${doc.id}`,
              });
            }
          });
        }

        // Process recent teams with verification status
        if (recentTeamsResult.status === "fulfilled") {
          const teams = Array.isArray(recentTeamsResult.value?.data)
            ? recentTeamsResult.value.data
            : Array.isArray(recentTeamsResult.value)
            ? recentTeamsResult.value
            : [];
          
          teams.slice(0, 2).forEach((team) => {
            if (team.verified_at) {
              allActivities.push({
                id: `team-verified-${team.id}`,
                type: "team_verified",
                entity_type: "team",
                entity_id: team.id,
                title: "Team Verified",
                description: `${team.name || "Team"} verified${team.creator ? ` by ${team.creator.username || team.creator.email?.split("@")[0]}` : ""}`,
                icon: CheckCircleIcon,
                color: "text-green-500",
                timestamp: team.verified_at,
                link: `/dashboard/teams/${team.id}`,
              });
            } else if (team.created_at) {
              allActivities.push({
                id: `team-${team.id}`,
                type: "team_created",
                entity_type: "team",
                entity_id: team.id,
                title: "Team Registered",
                description: `${team.name || "Team"} registered${team.sport ? ` (${team.sport.name || team.sport})` : ""}`,
                icon: UserGroupIcon,
                color: "text-blue-500",
                timestamp: team.created_at,
                link: `/dashboard/teams/${team.id}`,
              });
            }
          });
        }

        // Process recent coaches with verification status
        if (recentCoachesResult.status === "fulfilled") {
          const coaches = Array.isArray(recentCoachesResult.value?.data)
            ? recentCoachesResult.value.data
            : Array.isArray(recentCoachesResult.value)
            ? recentCoachesResult.value
            : [];
          
          coaches.slice(0, 2).forEach((coach) => {
            const user = coach.user || {};
            if (coach.verified_at || coach.is_verified) {
              allActivities.push({
                id: `coach-verified-${coach.id}`,
                type: "coach_verified",
                entity_type: "coach",
                entity_id: coach.id,
                title: "Coach Verified",
                description: `${user.first_name || ""} ${user.last_name || ""} (@${user.username || user.email?.split("@")[0] || "coach"}) verified as coach`,
                icon: CheckCircleIcon,
                color: "text-green-500",
                timestamp: coach.verified_at || coach.updated_at,
                link: `/dashboard/coaches/${coach.id}`,
                user: user,
              });
            } else if (coach.created_at) {
              allActivities.push({
                id: `coach-${coach.id}`,
                type: "coach_registered",
                entity_type: "coach",
                entity_id: coach.id,
                title: "Coach Registered",
                description: `${user.first_name || ""} ${user.last_name || ""} (@${user.username || user.email?.split("@")[0] || "coach"}) registered as coach`,
                icon: AcademicCapIcon,
                color: "text-blue-500",
                timestamp: coach.created_at,
                link: `/dashboard/coaches/${coach.id}`,
                user: user,
              });
            }
          });
        }

        // Sort all activities by timestamp (most recent first) and limit
        const sortedActivities = allActivities
          .filter((a) => a.timestamp)
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, limit);

        setActivities(sortedActivities);
      } catch (err) {
        console.error("Failed to load recent activity:", err);
        setError(err.message || "Failed to load recent activity");
      } finally {
        setLoading(false);
      }
    };

    loadRecentActivity();
  }, [limit]);

  // Helper functions for audit logs
  function getAuditLogTitle(log) {
    const action = log.action?.toLowerCase() || "";
    const entityType = log.entity_type?.toLowerCase() || "";
    
    if (action.includes("approve") || action.includes("verify")) {
      return `${entityType ? entityType.charAt(0).toUpperCase() + entityType.slice(1) : "Entity"} Approved`;
    }
    if (action.includes("reject")) {
      return `${entityType ? entityType.charAt(0).toUpperCase() + entityType.slice(1) : "Entity"} Rejected`;
    }
    if (action.includes("reset")) {
      return `${entityType ? entityType.charAt(0).toUpperCase() + entityType.slice(1) : "Verification"} Reset`;
    }
    if (action.includes("create") || action.includes("register")) {
      return `New ${entityType ? entityType.charAt(0).toUpperCase() + entityType.slice(1) : "Entity"} Created`;
    }
    if (action.includes("ban")) {
      return "User Banned";
    }
    if (action.includes("unban")) {
      return "User Unbanned";
    }
    return log.action || "Activity";
  }

  function getAuditLogDescription(log) {
    const entityName = log.entity_name || log.entity?.name || log.entity?.username || `Entity #${log.entity_id || ""}`;
    const actor = log.user?.username || log.admin?.username || log.actor?.username || "Admin";
    
    const action = log.action?.toLowerCase() || "";
    if (action.includes("approve") || action.includes("verify")) {
      return `${entityName} verified by ${actor}`;
    }
    if (action.includes("reject")) {
      return `${entityName} rejected by ${actor}`;
    }
    if (action.includes("reset")) {
      return `Verification reset for ${entityName} by ${actor}`;
    }
    if (action.includes("ban")) {
      return `${entityName} banned by ${actor}`;
    }
    
    return log.description || log.message || `${entityName} - ${log.action || "activity"}`;
  }

  function getAuditLogIcon(log) {
    const action = log.action?.toLowerCase() || "";
    if (action.includes("approve") || action.includes("verify")) return CheckCircleIcon;
    if (action.includes("reject")) return XCircleIcon;
    if (action.includes("reset")) return ArrowPathIcon;
    if (action.includes("ban")) return ExclamationTriangleIcon;
    if (action.includes("user")) return UserPlusIcon;
    if (action.includes("event")) return CalendarDaysIcon;
    if (action.includes("venue")) return MapPinIcon;
    if (action.includes("ticket")) return TicketIcon;
    if (action.includes("document")) return DocumentTextIcon;
    if (action.includes("team")) return UserGroupIcon;
    if (action.includes("coach")) return AcademicCapIcon;
    return ClockIcon;
  }

  function getAuditLogColor(log) {
    const action = log.action?.toLowerCase() || "";
    if (action.includes("approve") || action.includes("verify")) return "text-green-500";
    if (action.includes("reject")) return "text-red-500";
    if (action.includes("reset")) return "text-amber-500";
    if (action.includes("ban")) return "text-red-500";
    return "text-blue-500";
  }

  function getAuditLogLink(log) {
    const entityType = log.entity_type?.toLowerCase();
    const entityId = log.entity_id;
    
    if (!entityType || !entityId) return null;
    
    const routeMap = {
      user: `/dashboard/users/${entityId}`,
      users: `/dashboard/users/${entityId}`,
      event: `/dashboard/events/${entityId}`,
      events: `/dashboard/events/${entityId}`,
      venue: `/dashboard/venues/${entityId}`,
      venues: `/dashboard/venues/${entityId}`,
      ticket: `/dashboard/tickets/${entityId}`,
      tickets: `/dashboard/tickets/${entityId}`,
      document: `/dashboard/documents/${entityId}`,
      documents: `/dashboard/documents/${entityId}`,
      team: `/dashboard/teams/${entityId}`,
      teams: `/dashboard/teams/${entityId}`,
      coach: `/dashboard/coaches/${entityId}`,
      coaches: `/dashboard/coaches/${entityId}`,
    };
    
    return routeMap[entityType] || null;
  }

  function formatTimestamp(timestamp) {
    if (!timestamp) return "Just now";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  }

  if (loading) {
    return (
      <Card className="border border-blue-gray-50">
        <CardBody className="p-6">
          <Typography variant="small" className="text-blue-gray-500">
            Loading recent activity...
          </Typography>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border border-blue-gray-50">
        <CardBody className="p-6">
          <Typography variant="small" className="text-red-500">
            {error}
          </Typography>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="border border-blue-gray-50 flex flex-col" style={{ maxHeight: showHeader ? "600px" : "none" }}>
      {showHeader && (
        <CardHeader className="m-0 p-4 bg-transparent shadow-none border-b border-blue-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h6" color="blue-gray">
                Recent Activity
              </Typography>
              <Typography variant="small" className="text-blue-gray-600">
                Latest activities across all entities
              </Typography>
            </div>
          </div>
        </CardHeader>
      )}
      <CardBody className={`p-4 ${showHeader ? "pt-0" : ""} flex flex-col overflow-hidden`}>
        {activities.length === 0 ? (
          <Typography variant="small" className="text-blue-gray-400 text-center py-4">
            No recent activity
          </Typography>
        ) : (
          <div className="overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-blue-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-blue-gray-300">
            {activities.map((activity, key) => {
              const Icon = activity.icon;
              const ActivityContent = (
                <div
                  className={`flex items-start gap-4 py-3 cursor-pointer hover:bg-blue-gray-50 rounded-lg px-2 transition-colors`}
                >
                  <div
                    className={`relative p-1 ${
                      key !== activities.length - 1
                        ? "after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] after:h-4/6"
                        : ""
                    }`}
                  >
                    <div className="relative">
                      {activity.user && (activity.type === "user_registration" || activity.type === "coach_registered" || activity.type === "coach_verified") ? (
                        <Avatar
                          src={getUserAvatarUrl(activity.user)}
                          alt={activity.user.username || "User"}
                          size="sm"
                          variant="circular"
                        />
                      ) : (
                        <div className="p-2 rounded-full bg-blue-gray-100 flex items-center justify-center">
                          <Icon className={`w-4 h-4 ${activity.color}`} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="block font-medium"
                        >
                          {activity.title}
                        </Typography>
                        <Typography
                          as="span"
                          variant="small"
                          className="text-xs font-normal text-blue-gray-600 block mt-1"
                        >
                          {activity.description}
                        </Typography>
                      </div>
                      <Typography
                        variant="small"
                        className="text-xs text-blue-gray-400 whitespace-nowrap flex-shrink-0"
                      >
                        {formatTimestamp(activity.timestamp)}
                      </Typography>
                    </div>
                    {activity.link && (
                      <Chip
                        size="sm"
                        variant="ghost"
                        value="View"
                        className="mt-2 text-[10px]"
                        color="blue-gray"
                      />
                    )}
                  </div>
                </div>
              );

              return activity.link ? (
                <Link key={activity.id} href={activity.link}>
                  {ActivityContent}
                </Link>
              ) : (
                <div key={activity.id}>{ActivityContent}</div>
              );
            })}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

export default RecentActivity;
