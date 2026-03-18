import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { adminGetConsultations } from "@/lib/actions/consultation";
import { Heart, Clock, CheckCircle2, MessageSquare } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  reviewed: "bg-blue-100 text-blue-700",
  responded: "bg-green-100 text-green-700",
  closed: "bg-stone-100 text-stone-600",
};

export default async function AdminConsultationsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    redirect("/login?redirect=/admin/consultations");
  }

  const consultations = await adminGetConsultations();
  const pending = consultations.filter((c) => c.status === "pending").length;

  return (
    <div className="flex h-screen bg-stone-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-stone-900">
              Health Consultations
            </h1>
            <p className="text-stone-500 text-sm">
              {consultations.length} total · {pending} pending review
            </p>
          </div>
          {pending > 0 && (
            <div className="flex items-center gap-2 bg-amber-100 text-amber-800 text-sm font-semibold px-4 py-2 rounded-full">
              <Clock className="w-4 h-4" />
              {pending} awaiting response
            </div>
          )}
        </div>

        {consultations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
            <Heart className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-500">No consultation requests yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {consultations.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-stone-900">{c.name}</h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          STATUS_STYLES[c.status] ?? ""
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                    <p className="text-sm text-stone-500">
                      {c.email}
                      {c.phone && ` · ${c.phone}`}
                      {c.age && ` · Age: ${c.age}`}
                      {c.gender && ` · ${c.gender}`}
                    </p>
                    <p className="text-xs text-stone-400 mt-1">
                      {new Date(c.createdAt).toLocaleString("en-NG")}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-stone-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                      Health Challenge
                    </p>
                    <p className="text-sm text-stone-700 leading-relaxed">
                      {c.healthChallenge}
                    </p>
                  </div>

                  {c.currentMedications && (
                    <div className="bg-stone-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                        Current Medications
                      </p>
                      <p className="text-sm text-stone-700">
                        {c.currentMedications}
                      </p>
                    </div>
                  )}

                  {c.allergies && (
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                      <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
                        ⚠ Allergies
                      </p>
                      <p className="text-sm text-stone-700">{c.allergies}</p>
                    </div>
                  )}

                  {c.response && (
                    <div className="bg-[#0f7a3a]/5 rounded-xl p-4 border border-[#0f7a3a]/15">
                      <p className="text-xs font-semibold text-[#0f7a3a] uppercase tracking-wider mb-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Practitioner Response
                      </p>
                      <p className="text-sm text-stone-700 leading-relaxed">
                        {c.response}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-stone-100 flex gap-2 flex-wrap">
                  <a
                    href={`mailto:${c.email}?subject=Re: Your Herbal Consultation Request&body=Dear ${c.name},%0A%0AThank you for reaching out to An-Nazeer Holistic Home.%0A%0A`}
                    className="inline-flex items-center gap-1.5 bg-[#0f7a3a] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#0a5c2c] transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Reply via Email
                  </a>
                  {c.phone && (
                    <a
                      href={`https://wa.me/${c.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${c.name}, this is An-Nazeer Holistic Home regarding your health consultation.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#25D366] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#22c35e] transition-colors"
                    >
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
