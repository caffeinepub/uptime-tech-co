import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ChevronRight, Loader2, LogOut } from "lucide-react";
import { useState } from "react";
import type { Submission } from "../backend.d.ts";
import { useActor } from "../hooks/useActor";

const ADMIN_USERNAME = "daiyan018";
const ADMIN_HASH =
  "a9c7bfb74df32f63efb0deba44cc2bb6b40a3b41f6e8c8fdbae81fc8d5a17f5e";

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function formatTicket(id: bigint): string {
  return `#${String(Number(id)).padStart(4, "0")}`;
}

function formatDate(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [notes, setNotes] = useState("");
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const { data: submissions = [], isLoading } = useQuery<Submission[]>({
    queryKey: ["submissions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSubmissions();
    },
    enabled: !!actor && !isFetching && loggedIn,
  });

  const updateNotesMutation = useMutation({
    mutationFn: async ({
      ticketId,
      notesText,
    }: { ticketId: bigint; notesText: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateNotes(ticketId, notesText);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      const hash = await sha256(password);
      if (username === ADMIN_USERNAME && hash === ADMIN_HASH) {
        setLoggedIn(true);
      } else {
        setLoginError("Invalid username or password.");
      }
    } finally {
      setLoggingIn(false);
    }
  };

  const handleSelectRow = (sub: Submission) => {
    setSelected(sub);
    setNotes(sub.notes);
  };

  const handleSaveNotes = () => {
    if (!selected) return;
    updateNotesMutation.mutate({
      ticketId: selected.ticketId,
      notesText: notes,
    });
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-[#1a2236] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <a href="/" className="inline-block mb-8">
              <span className="text-xl font-sans">
                <span className="wordmark-sync">Sync</span>
                <span className="wordmark-to">TO</span>
                <span className="wordmark-tech"> Tech</span>
              </span>
            </a>
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-white/40 text-sm mt-1">
              Sign in to view submissions
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label
                htmlFor="username"
                className="text-white/60 text-sm mb-1.5 block"
              >
                Username
              </Label>
              <Input
                id="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                placeholder="Username"
                autoComplete="username"
                data-ocid="admin.username.input"
              />
            </div>
            <div>
              <Label
                htmlFor="password"
                className="text-white/60 text-sm mb-1.5 block"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                placeholder="Password"
                autoComplete="current-password"
                data-ocid="admin.password.input"
              />
            </div>
            {loginError && (
              <p className="text-red-400 text-sm" data-ocid="admin.error_state">
                {loginError}
              </p>
            )}
            <Button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-[#F2922B] hover:bg-[#F2922B]/90 text-[#1a2236] font-bold h-11"
              data-ocid="admin.login.submit_button"
            >
              {loggingIn ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a2236] text-white">
      {/* Header */}
      <header className="border-b border-white/5 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="text-white/40 hover:text-white transition-colors"
            data-ocid="admin.home.link"
          >
            <ArrowLeft size={18} />
          </a>
          <span className="text-sm font-semibold text-white">Admin Portal</span>
        </div>
        <button
          type="button"
          onClick={() => setLoggedIn(false)}
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
          data-ocid="admin.logout.button"
        >
          <LogOut size={16} />
          Logout
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {selected ? (
          /* Detail view */
          <div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors"
              data-ocid="admin.back.button"
            >
              <ArrowLeft size={16} />
              Back to submissions
            </button>
            <div className="bg-white/5 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <span className="text-[#F2922B] font-bold text-lg">
                  {formatTicket(selected.ticketId)}
                </span>
                <Badge
                  variant="outline"
                  className="text-white/50 border-white/20"
                >
                  {selected.service}
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-white/30 text-xs uppercase tracking-widest mb-1">
                    Name
                  </p>
                  <p className="text-white">{selected.name}</p>
                </div>
                <div>
                  <p className="text-white/30 text-xs uppercase tracking-widest mb-1">
                    Organization
                  </p>
                  <p className="text-white">{selected.orgName || "—"}</p>
                </div>
                <div>
                  <p className="text-white/30 text-xs uppercase tracking-widest mb-1">
                    Email
                  </p>
                  <p className="text-white">{selected.email}</p>
                </div>
                <div>
                  <p className="text-white/30 text-xs uppercase tracking-widest mb-1">
                    Phone
                  </p>
                  <p className="text-white">{selected.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-white/30 text-xs uppercase tracking-widest mb-1">
                    Submitted
                  </p>
                  <p className="text-white">{formatDate(selected.timestamp)}</p>
                </div>
              </div>
              <div className="mb-8">
                <p className="text-white/30 text-xs uppercase tracking-widest mb-2">
                  Message
                </p>
                <div className="bg-white/5 rounded-xl p-5 text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </div>
              </div>
              <div>
                <p className="text-white/30 text-xs uppercase tracking-widest mb-2">
                  Notes
                </p>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 resize-none"
                  rows={4}
                  placeholder="Add internal notes…"
                  data-ocid="admin.notes.textarea"
                />
                <Button
                  onClick={handleSaveNotes}
                  disabled={updateNotesMutation.isPending}
                  className="mt-3 bg-[#F2922B] hover:bg-[#F2922B]/90 text-[#1a2236] font-bold"
                  data-ocid="admin.notes.save_button"
                >
                  {updateNotesMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save Notes"
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* List view */
          <div>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold">Contact Submissions</h1>
              <span className="text-white/40 text-sm">
                {submissions.length} total
              </span>
            </div>
            {isLoading ? (
              <div
                className="flex items-center justify-center py-20"
                data-ocid="admin.loading_state"
              >
                <Loader2 className="h-8 w-8 animate-spin text-[#F2922B]" />
              </div>
            ) : submissions.length === 0 ? (
              <div
                className="text-center py-20 text-white/30"
                data-ocid="admin.empty_state"
              >
                <p className="text-lg">No submissions yet</p>
                <p className="text-sm mt-1">
                  They'll appear here once someone fills out the contact form.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {submissions.map((sub, i) => (
                  <button
                    type="button"
                    key={Number(sub.ticketId)}
                    onClick={() => handleSelectRow(sub)}
                    className="w-full bg-white/5 hover:bg-white/10 rounded-xl px-6 py-4 flex items-center gap-4 text-left transition-colors group"
                    data-ocid={`admin.submission.item.${i + 1}`}
                  >
                    <span className="text-[#F2922B] font-bold text-sm w-16 shrink-0">
                      {formatTicket(sub.ticketId)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {sub.name}
                      </p>
                      <p className="text-white/40 text-sm truncate">
                        {sub.email}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-white/40 border-white/10 text-xs shrink-0 hidden sm:flex"
                    >
                      {sub.service}
                    </Badge>
                    <span className="text-white/30 text-xs shrink-0 hidden md:block">
                      {formatDate(sub.timestamp)}
                    </span>
                    <ChevronRight
                      size={16}
                      className="text-white/20 group-hover:text-white/60 transition-colors shrink-0"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
