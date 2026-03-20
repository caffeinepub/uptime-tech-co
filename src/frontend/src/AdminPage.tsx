import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  Inbox,
  Loader2,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import type { Submission } from "./backend.d";

const ADMIN_USERNAME = "daiyan018";
const ADMIN_PASSWORD_HASH =
  "36b1dcbb12c2219649a242a24057189324c8625093458238d44a4cac4e7c7f3c";

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function formatTicketId(id: bigint): string {
  return `#${String(id).padStart(4, "0")}`;
}

function SyncTOWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-sans leading-none select-none ${className}`}>
      <span
        style={{
          fontWeight: 200,
          fontStyle: "italic",
          letterSpacing: "-0.02em",
          color: "white",
        }}
      >
        Sync
      </span>
      <span
        style={{
          fontWeight: 800,
          fontStyle: "normal",
          color: "#F2922B",
          letterSpacing: "-0.01em",
        }}
      >
        TO
      </span>
      <span
        style={{
          fontWeight: 400,
          fontStyle: "normal",
          color: "white",
          marginLeft: "0.18em",
        }}
      >
        Tech
      </span>
    </span>
  );
}

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Inner body — keyed by ticketId so state resets when a different submission is opened
function SubmissionModalBody({ sub }: { sub: Submission }) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState(sub.notes ?? "");
  const [saved, setSaved] = useState(false);

  const saveNotesMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      await actor.updateNotes(sub.ticketId, notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle
          className="text-xl font-semibold flex items-center gap-3"
          style={{ color: "white" }}
        >
          <span
            className="font-mono text-sm px-2 py-1 rounded"
            style={{ backgroundColor: "#2e3f5e", color: "#F2922B" }}
          >
            {formatTicketId(sub.ticketId)}
          </span>
          Submission Detail
        </DialogTitle>
      </DialogHeader>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-2">
        <div>
          <p
            className="text-xs uppercase tracking-wider mb-1"
            style={{ color: "#8899aa" }}
          >
            Name
          </p>
          <p style={{ color: "#e8edf2" }}>{sub.name}</p>
        </div>
        <div>
          <p
            className="text-xs uppercase tracking-wider mb-1"
            style={{ color: "#8899aa" }}
          >
            Organization
          </p>
          <p style={{ color: "#e8edf2" }}>{sub.orgName || "—"}</p>
        </div>
        <div>
          <p
            className="text-xs uppercase tracking-wider mb-1"
            style={{ color: "#8899aa" }}
          >
            Email
          </p>
          <a
            href={`mailto:${sub.email}`}
            style={{ color: "#F2922B" }}
            className="hover:underline text-sm"
          >
            {sub.email}
          </a>
        </div>
        <div>
          <p
            className="text-xs uppercase tracking-wider mb-1"
            style={{ color: "#8899aa" }}
          >
            Phone
          </p>
          <p style={{ color: "#e8edf2" }}>{sub.phone || "—"}</p>
        </div>
        <div>
          <p
            className="text-xs uppercase tracking-wider mb-1"
            style={{ color: "#8899aa" }}
          >
            Service
          </p>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: "#2e3f5e", color: "#F2922B" }}
          >
            {sub.service}
          </span>
        </div>
        <div>
          <p
            className="text-xs uppercase tracking-wider mb-1"
            style={{ color: "#8899aa" }}
          >
            Date
          </p>
          <p className="text-sm" style={{ color: "#c0ccd8" }}>
            {formatTimestamp(sub.timestamp)}
          </p>
        </div>
      </div>

      {/* Full Message */}
      <div className="mt-4">
        <p
          className="text-xs uppercase tracking-wider mb-2"
          style={{ color: "#8899aa" }}
        >
          Message
        </p>
        <div
          className="rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap"
          style={{
            backgroundColor: "#131e30",
            border: "1px solid #2e3f5e",
            color: "#e8edf2",
          }}
        >
          {sub.message}
        </div>
      </div>

      {/* Notes */}
      <div className="mt-4">
        <p
          className="text-xs uppercase tracking-wider mb-2"
          style={{ color: "#8899aa" }}
        >
          Admin Notes
        </p>
        <Textarea
          data-ocid="submissions.textarea"
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            setSaved(false);
          }}
          placeholder="Add your notes here…"
          className="min-h-[100px] text-sm focus-visible:ring-[#F2922B]"
          style={{
            backgroundColor: "#131e30",
            border: "1px solid #2e3f5e",
            color: "#e8edf2",
            resize: "vertical",
          }}
        />
        <div className="flex items-center gap-3 mt-2">
          <Button
            data-ocid="submissions.save_button"
            onClick={() => saveNotesMutation.mutate()}
            disabled={saveNotesMutation.isPending}
            className="font-semibold"
            style={{ backgroundColor: "#F2922B", color: "#1a2236" }}
          >
            {saveNotesMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {saveNotesMutation.isPending ? "Saving…" : "Save Note"}
          </Button>
          {saved && (
            <span
              data-ocid="submissions.success_state"
              className="flex items-center gap-1.5 text-sm"
              style={{ color: "#4ade80" }}
            >
              <CheckCircle2 className="w-4 h-4" />
              Saved!
            </span>
          )}
          {saveNotesMutation.isError && (
            <span
              data-ocid="submissions.error_state"
              className="flex items-center gap-1.5 text-sm"
              style={{ color: "#f87171" }}
            >
              <AlertCircle className="w-4 h-4" />
              Failed to save.
            </span>
          )}
        </div>
      </div>
    </>
  );
}

function SubmissionDetailModal({
  submission,
  open,
  onClose,
}: {
  submission: Submission | null;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent
        data-ocid="submissions.dialog"
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: "#1e2d46",
          border: "1px solid #2e3f5e",
          color: "white",
        }}
      >
        {submission && (
          <SubmissionModalBody
            key={String(submission.ticketId)}
            sub={submission}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function SubmissionsTable({ submissions }: { submissions: Submission[] }) {
  const sorted = [...submissions].sort((a, b) =>
    b.timestamp > a.timestamp ? 1 : b.timestamp < a.timestamp ? -1 : 0,
  );
  const [selected, setSelected] = useState<Submission | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  function openDetail(sub: Submission) {
    setSelected(sub);
    setModalOpen(true);
  }

  function closeDetail() {
    setModalOpen(false);
    setTimeout(() => setSelected(null), 300);
  }

  if (sorted.length === 0) {
    return (
      <div
        data-ocid="submissions.empty_state"
        className="flex flex-col items-center justify-center py-24 gap-4"
        style={{ color: "#8899aa" }}
      >
        <Inbox className="w-12 h-12 opacity-40" />
        <p className="text-lg font-medium">No submissions yet</p>
        <p className="text-sm">Contact form submissions will appear here.</p>
      </div>
    );
  }

  return (
    <>
      <SubmissionDetailModal
        submission={selected}
        open={modalOpen}
        onClose={closeDetail}
      />
      <div
        className="overflow-x-auto rounded-xl"
        style={{ border: "1px solid #2e3f5e" }}
      >
        <Table data-ocid="submissions.table">
          <TableHeader>
            <TableRow
              style={{ borderColor: "#2e3f5e", backgroundColor: "#1e2d46" }}
            >
              <TableHead style={{ color: "#8899aa" }}>Ticket #</TableHead>
              <TableHead style={{ color: "#8899aa" }}>Name</TableHead>
              <TableHead style={{ color: "#8899aa" }}>Organization</TableHead>
              <TableHead style={{ color: "#8899aa" }}>Email</TableHead>
              <TableHead style={{ color: "#8899aa" }}>Phone</TableHead>
              <TableHead style={{ color: "#8899aa" }}>Service</TableHead>
              <TableHead style={{ color: "#8899aa" }}>Message</TableHead>
              <TableHead style={{ color: "#8899aa" }}>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((sub, i) => (
              <TableRow
                key={`${sub.email}-${String(sub.timestamp)}`}
                data-ocid={`submissions.row.${i + 1}`}
                style={{ borderColor: "#2e3f5e", cursor: "pointer" }}
                className="hover:bg-[#1e2d46] transition-colors"
                onClick={() => openDetail(sub)}
              >
                <TableCell>
                  <span
                    className="font-mono text-xs px-2 py-0.5 rounded"
                    style={{ backgroundColor: "#2e3f5e", color: "#F2922B" }}
                  >
                    {formatTicketId(sub.ticketId)}
                  </span>
                </TableCell>
                <TableCell style={{ color: "#e8edf2" }} className="font-medium">
                  {sub.name}
                </TableCell>
                <TableCell style={{ color: "#c0ccd8" }}>
                  {sub.orgName || "—"}
                </TableCell>
                <TableCell>
                  <a
                    href={`mailto:${sub.email}`}
                    style={{ color: "#F2922B" }}
                    className="hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {sub.email}
                  </a>
                </TableCell>
                <TableCell style={{ color: "#c0ccd8" }}>
                  {sub.phone || "—"}
                </TableCell>
                <TableCell>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: "#2e3f5e", color: "#F2922B" }}
                  >
                    {sub.service}
                  </span>
                </TableCell>
                <TableCell
                  style={{ color: "#c0ccd8", maxWidth: "240px" }}
                  className="truncate"
                >
                  {sub.message.length > 60
                    ? `${sub.message.slice(0, 60)}…`
                    : sub.message}
                </TableCell>
                <TableCell
                  style={{ color: "#8899aa" }}
                  className="text-sm whitespace-nowrap"
                >
                  {formatTimestamp(sub.timestamp)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function LoginCard({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const hashedInput = await sha256(password);
    if (username === ADMIN_USERNAME && hashedInput === ADMIN_PASSWORD_HASH) {
      onLogin();
    } else {
      setError("Invalid username or password.");
    }
    setLoading(false);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#1a2236" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 flex flex-col gap-6"
        style={{ backgroundColor: "#222e47", border: "1px solid #2e3f5e" }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-3xl">
            <SyncTOWordmark />
          </span>
          <p
            className="text-xs tracking-widest uppercase"
            style={{ color: "#8899aa" }}
          >
            Admin Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="username" style={{ color: "#c0ccd8" }}>
              Username
            </Label>
            <Input
              id="username"
              data-ocid="admin.input"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                backgroundColor: "#1a2236",
                border: "1px solid #2e3f5e",
                color: "white",
              }}
              className="focus-visible:ring-[#F2922B]"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password" style={{ color: "#c0ccd8" }}>
              Password
            </Label>
            <Input
              id="password"
              data-ocid="admin.input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                backgroundColor: "#1a2236",
                border: "1px solid #2e3f5e",
                color: "white",
              }}
              className="focus-visible:ring-[#F2922B]"
              required
            />
          </div>

          {error && (
            <div
              data-ocid="admin.error_state"
              className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg"
              style={{ backgroundColor: "#3b1a1a", color: "#f87171" }}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <Button
            type="submit"
            data-ocid="admin.submit_button"
            disabled={loading}
            className="w-full font-semibold mt-1"
            style={{ backgroundColor: "#F2922B", color: "#1a2236" }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function AdminDashboard({ onSignOut }: { onSignOut: () => void }) {
  const { actor, isFetching } = useActor();

  const {
    data: submissions,
    isLoading,
    isError,
  } = useQuery<Submission[]>({
    queryKey: ["submissions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSubmissions();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1a2236" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
        style={{
          backgroundColor: "#1a2236",
          borderBottom: "1px solid #2e3f5e",
        }}
      >
        <div className="flex items-center gap-4">
          <SyncTOWordmark className="text-xl" />
          <span
            className="hidden sm:block text-sm font-medium px-3 py-1 rounded-full"
            style={{ backgroundColor: "#2e3f5e", color: "#8899aa" }}
          >
            Contact Submissions
          </span>
        </div>
        <Button
          variant="ghost"
          data-ocid="admin.secondary_button"
          onClick={onSignOut}
          className="flex items-center gap-2 text-sm"
          style={{ color: "#8899aa" }}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </header>

      {/* Main */}
      <main className="px-4 sm:px-8 py-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold" style={{ color: "white" }}>
            Admin — Contact Submissions
          </h1>
          <p className="text-sm mt-1" style={{ color: "#8899aa" }}>
            All inquiries submitted through the contact form. Click any row to
            view full details.
          </p>
        </div>

        {isLoading && (
          <div
            data-ocid="submissions.loading_state"
            className="flex items-center justify-center py-24 gap-3"
            style={{ color: "#8899aa" }}
          >
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading submissions…</span>
          </div>
        )}

        {isError && (
          <div
            data-ocid="submissions.error_state"
            className="flex items-center justify-center py-24 gap-3"
            style={{ color: "#f87171" }}
          >
            <AlertCircle className="w-6 h-6" />
            <span>Failed to load submissions. Please try refreshing.</span>
          </div>
        )}

        {!isLoading && !isError && submissions !== undefined && (
          <SubmissionsTable submissions={submissions} />
        )}
      </main>
    </div>
  );
}

export function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginCard onLogin={() => setIsLoggedIn(true)} />;
  }

  return <AdminDashboard onSignOut={() => setIsLoggedIn(false)} />;
}
