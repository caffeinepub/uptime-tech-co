import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  Download,
  Loader2,
  LogOut,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import type { Submission } from "../backend.d.ts";
import { useActor } from "../hooks/useActor";

const ADMIN_USERNAME = "daiyan018";
// SHA-256 of "SyncTO2026NewChapter!"
const ADMIN_HASH =
  "36b1dcbb12c2219649a242a24057189324c8625093458238d44a4cac4e7c7f3c";

const SECURITY_Q_KEY = "syncto_security_q";
const SECURITY_A_KEY = "syncto_security_a";
const MAX_SUBMISSIONS = 500;
const WARN_THRESHOLD = 450;

const PRESET_QUESTIONS = [
  "What was the name of your first pet?",
  "What street did you grow up on?",
  "What was the make of your first car?",
  "What is your mother's maiden name?",
  "What city were you born in?",
];

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

function exportToCSV(submissions: Submission[]) {
  const headers = [
    "Ticket #",
    "Name",
    "Organization",
    "Email",
    "Phone",
    "Service",
    "Date",
    "Message",
    "Notes",
  ];
  const rows = submissions.map((sub) => [
    formatTicket(sub.ticketId),
    sub.name,
    sub.orgName || "",
    sub.email,
    sub.phone || "",
    sub.service,
    formatDate(sub.timestamp),
    sub.message.replace(/"/g, '""'),
    (sub.notes || "").replace(/"/g, '""'),
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `syncto-submissions-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

type AdminView = "login" | "setup_security" | "forgot" | "dashboard";

export default function AdminPage() {
  const [view, setView] = useState<AdminView>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [showForgotLink, setShowForgotLink] = useState(false);

  // Security question setup
  const [setupQuestion, setSetupQuestion] = useState(PRESET_QUESTIONS[0]);
  const [setupAnswer, setSetupAnswer] = useState("");
  const [setupSaving, setSetupSaving] = useState(false);

  // Forgot password
  const [forgotAnswer, setForgotAnswer] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotChecking, setForgotChecking] = useState(false);

  // Delete confirmation
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [exported, setExported] = useState(false);

  const [selected, setSelected] = useState<Submission | null>(null);
  const [notes, setNotes] = useState("");
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const storedQuestion = localStorage.getItem(SECURITY_Q_KEY);

  const { data: submissions = [], isLoading } = useQuery<Submission[]>({
    queryKey: ["submissions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSubmissions();
    },
    enabled: !!actor && !isFetching && view === "dashboard",
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

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      await actor.deleteAllSubmissions();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      setConfirmDelete(false);
      setExported(false);
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    setShowForgotLink(false);
    try {
      const hash = await sha256(password);
      if (username === ADMIN_USERNAME && hash === ADMIN_HASH) {
        if (!localStorage.getItem(SECURITY_Q_KEY)) {
          setView("setup_security");
        } else {
          setView("dashboard");
        }
      } else {
        setLoginError("Invalid username or password.");
        if (localStorage.getItem(SECURITY_Q_KEY)) {
          setShowForgotLink(true);
        }
      }
    } finally {
      setLoggingIn(false);
    }
  };

  const handleSaveSecurityQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupAnswer.trim()) return;
    setSetupSaving(true);
    try {
      const answerHash = await sha256(setupAnswer.trim().toLowerCase());
      localStorage.setItem(SECURITY_Q_KEY, setupQuestion);
      localStorage.setItem(SECURITY_A_KEY, answerHash);
      setView("dashboard");
    } finally {
      setSetupSaving(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotChecking(true);
    setForgotError("");
    try {
      const answerHash = await sha256(forgotAnswer.trim().toLowerCase());
      const storedHash = localStorage.getItem(SECURITY_A_KEY);
      if (answerHash === storedHash) {
        setView("dashboard");
      } else {
        setForgotError("Incorrect answer. Please try again.");
      }
    } finally {
      setForgotChecking(false);
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

  const handleExportCSV = () => {
    exportToCSV(submissions);
    setExported(true);
  };

  const count = submissions.length;
  const nearLimit = count >= WARN_THRESHOLD;
  const atLimit = count >= MAX_SUBMISSIONS;

  // --- Login screen ---
  if (view === "login") {
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
              <div data-ocid="admin.error_state">
                <p className="text-red-400 text-sm">{loginError}</p>
                {showForgotLink && (
                  <button
                    type="button"
                    onClick={() => {
                      setForgotAnswer("");
                      setForgotError("");
                      setView("forgot");
                    }}
                    className="text-[#F2922B] text-sm underline underline-offset-2 mt-1"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
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

  // --- Security question setup (first login) ---
  if (view === "setup_security") {
    return (
      <div className="min-h-screen bg-[#1a2236] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">
              Set Up Account Recovery
            </h1>
            <p className="text-white/40 text-sm mt-2">
              Choose a security question so you can recover access if you ever
              forget your password.
            </p>
          </div>
          <form onSubmit={handleSaveSecurityQuestion} className="space-y-4">
            <div>
              <Label className="text-white/60 text-sm mb-1.5 block">
                Security Question
              </Label>
              <select
                value={setupQuestion}
                onChange={(e) => setSetupQuestion(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2922B]/50"
              >
                {PRESET_QUESTIONS.map((q) => (
                  <option key={q} value={q} className="bg-[#1a2236]">
                    {q}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-white/60 text-sm mb-1.5 block">
                Your Answer
              </Label>
              <Input
                required
                value={setupAnswer}
                onChange={(e) => setSetupAnswer(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                placeholder="Enter your answer"
                autoComplete="off"
              />
              <p className="text-white/30 text-xs mt-1">
                Answer is case-insensitive.
              </p>
            </div>
            <Button
              type="submit"
              disabled={setupSaving || !setupAnswer.trim()}
              className="w-full bg-[#F2922B] hover:bg-[#F2922B]/90 text-[#1a2236] font-bold h-11"
            >
              {setupSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save & Continue"
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // --- Forgot password ---
  if (view === "forgot") {
    return (
      <div className="min-h-screen bg-[#1a2236] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <button
            type="button"
            onClick={() => setView("login")}
            className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to login
          </button>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Account Recovery</h1>
            <p className="text-white/40 text-sm mt-2">
              Answer your security question to regain access.
            </p>
          </div>
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div>
              <Label className="text-white/60 text-sm mb-1.5 block">
                Security Question
              </Label>
              <p className="text-white text-sm bg-white/5 rounded-md px-3 py-3 border border-white/10">
                {storedQuestion}
              </p>
            </div>
            <div>
              <Label className="text-white/60 text-sm mb-1.5 block">
                Your Answer
              </Label>
              <Input
                required
                value={forgotAnswer}
                onChange={(e) => setForgotAnswer(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                placeholder="Enter your answer"
                autoComplete="off"
              />
            </div>
            {forgotError && (
              <p className="text-red-400 text-sm">{forgotError}</p>
            )}
            <Button
              type="submit"
              disabled={forgotChecking || !forgotAnswer.trim()}
              className="w-full bg-[#F2922B] hover:bg-[#F2922B]/90 text-[#1a2236] font-bold h-11"
            >
              {forgotChecking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Verify & Access"
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // --- Dashboard ---
  return (
    <div className="min-h-screen bg-[#1a2236] text-white">
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
          onClick={() => {
            setView("login");
            setUsername("");
            setPassword("");
            setLoginError("");
            setShowForgotLink(false);
          }}
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
          data-ocid="admin.logout.button"
        >
          <LogOut size={16} />
          Logout
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {selected ? (
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
                  <p className="text-white">{selected.orgName || "\u2014"}</p>
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
                  <p className="text-white">{selected.phone || "\u2014"}</p>
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
                  placeholder="Add internal notes\u2026"
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
          <div>
            {/* Limit warning banner */}
            {nearLimit && (
              <div
                className="mb-6 rounded-xl px-5 py-4 flex items-start gap-3"
                style={{
                  backgroundColor: atLimit ? "#3b1a1a" : "#2e2510",
                  border: `1px solid ${atLimit ? "#f87171" : "#F2922B"}`,
                }}
              >
                <AlertTriangle
                  size={18}
                  className="shrink-0 mt-0.5"
                  style={{ color: atLimit ? "#f87171" : "#F2922B" }}
                />
                <div className="flex-1">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: atLimit ? "#f87171" : "#F2922B" }}
                  >
                    {atLimit
                      ? "Submission limit reached (500/500)"
                      : `Approaching submission limit (${count}/${MAX_SUBMISSIONS})`}
                  </p>
                  <p className="text-white/50 text-sm mt-0.5">
                    {atLimit
                      ? "New submissions are being dropped. Export your data and clear the queue below."
                      : "Export a CSV backup and clear old submissions to free up space."}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold">
                Contact Submissions
                <span className="text-white/30 text-base font-normal ml-3">
                  {count}/{MAX_SUBMISSIONS}
                </span>
              </h1>
              {count > 0 && (
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportCSV}
                    className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 flex items-center gap-2"
                    data-ocid="admin.export.button"
                  >
                    <Download size={14} />
                    Export CSV
                  </Button>
                  {(nearLimit || exported) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirmDelete(true)}
                      className="border-red-500/40 text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                      data-ocid="admin.clear.button"
                    >
                      <Trash2 size={14} />
                      Clear All
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Delete confirmation */}
            {confirmDelete && (
              <div
                className="mb-6 rounded-xl px-5 py-5"
                style={{
                  backgroundColor: "#1e1010",
                  border: "1px solid #f87171",
                }}
              >
                <p className="text-white font-semibold mb-1">
                  Delete all {count} submissions?
                </p>
                <p className="text-white/50 text-sm mb-4">
                  This cannot be undone. Make sure you've exported a CSV backup
                  first.
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    onClick={() => deleteAllMutation.mutate()}
                    disabled={deleteAllMutation.isPending}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold"
                  >
                    {deleteAllMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Yes, delete all"
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setConfirmDelete(false)}
                    className="text-white/50 hover:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

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
