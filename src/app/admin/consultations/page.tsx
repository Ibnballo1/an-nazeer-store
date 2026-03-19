import { Metadata } from "next";
import { getConsultations } from "@/lib/actions/consultation";
import { StatusBadge } from "@/components/admin/status-badge";
import { ConsultationUpdater } from "./consultation-updater";
import { MessageSquare } from "lucide-react";

export const metadata: Metadata = { title: "Consultations — Admin" };

type Props = {
  searchParams: Promise<{ page?: string; status?: string }>;
};

export default async function AdminConsultationsPage({ searchParams }: Props) {
  const params = await searchParams;
  const result = await getConsultations({
    page: Number(params.page ?? 1),
    status: params.status,
  });

  const STATUS_TABS = ["all", "pending", "contacted", "scheduled", "completed"];

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-brand-green-light rounded-xl flex items-center justify-center">
          <MessageSquare className="h-5 w-5 text-brand-green" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Consultations</h1>
          <p className="text-muted-foreground text-sm">
            {result.total} total requests
          </p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
        {STATUS_TABS.map((s) => {
          const active = (params.status ?? "all") === s;
          return (
            <a
              key={s}
              href={
                s === "all"
                  ? "/admin/consultations"
                  : `/admin/consultations?status=${s}`
              }
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                active
                  ? "bg-brand-green text-white"
                  : "bg-white border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </a>
          );
        })}
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {result.data.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No consultation requests found.
          </div>
        ) : (
          result.data.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-border p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">{req.name}</p>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">{req.email}</p>
                  {req.phone && (
                    <p className="text-xs text-muted-foreground">{req.phone}</p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(req.createdAt).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              {req.healthChallenge && (
                <p className="text-xs font-semibold text-muted-foreground mb-1">
                  {req.healthChallenge}
                </p>
              )}
              <p className="text-sm text-foreground/80 mb-4 leading-relaxed">
                {req.message}
              </p>

              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
                <span>
                  Current medications: <strong>{req.currentMedications}</strong>
                </span>
                {req.allergies && (
                  <span>
                    Allergies: <strong>{req.allergies}</strong>
                  </span>
                )}
              </div>

              {/* Status Updater */}
              <ConsultationUpdater
                id={req.id}
                currentStatus={req.status}
                currentNotes={req.adminNotes}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
