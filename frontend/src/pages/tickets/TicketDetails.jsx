import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ticketService from "../../services/ticketService";

export default function TicketDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ticketData, commentsData, attachmentsData] = await Promise.all([
        ticketService.getTicketById(id),
        ticketService.getComments(id),
        ticketService.getAttachments(id),
      ]);
      setTicket(ticketData);
      setComments(commentsData);
      setAttachments(attachmentsData);
    } catch (err) {
      setError("Failed to load ticket details");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const comment = await ticketService.addComment(id, newComment);
      setComments([...comments, comment]);
      setNewComment("");
    } catch (err) {
      setError("Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await ticketService.deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      setError("Failed to delete comment");
    }
  };

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  const statusBadge = (status) => {
    const map = {
      OPEN: { bg: "#DBEAFE", color: "#1D4ED8" },
      IN_PROGRESS: { bg: "#FEF3C7", color: "#D97706" },
      RESOLVED: { bg: "#D1FAE5", color: "#065F46" },
      CLOSED: { bg: "#F1F5F9", color: "#64748B" },
      REJECTED: { bg: "#FEE2E2", color: "#DC2626" },
    };
    const style = map[status] || map["OPEN"];
    return {
      background: style.bg, color: style.color,
      padding: "6px 16px", borderRadius: "20px",
      fontSize: "13px", fontWeight: "600",
    };
  };

  const priorityBadge = (priority) => {
    const map = {
      HIGH: { bg: "#FEE2E2", color: "#DC2626" },
      MEDIUM: { bg: "#FEF3C7", color: "#D97706" },
      LOW: { bg: "#D1FAE5", color: "#065F46" },
    };
    const style = map[priority] || map["LOW"];
    return {
      background: style.bg, color: style.color,
      padding: "4px 12px", borderRadius: "20px",
      fontSize: "12px", fontWeight: "600",
    };
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "DM Sans, Segoe UI, sans-serif", color: "#64748B" }}>
        Loading ticket details...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "DM Sans, Segoe UI, sans-serif", color: "#DC2626" }}>
        Ticket not found
      </div>
    );
  }

  // ─── Styles ────────────────────────────────────────────────────
  const s = {
    page: { minHeight: "100vh", background: "#F0F4FF", fontFamily: "DM Sans, Segoe UI, sans-serif", padding: "32px" },
    backBtn: { background: "#F1F5F9", border: "none", borderRadius: "10px", padding: "8px 16px", fontSize: "13px", fontWeight: "600", color: "#64748B", cursor: "pointer", marginBottom: "20px" },
    grid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", maxWidth: "1100px", margin: "0 auto" },
    card: { background: "#fff", borderRadius: "20px", border: "1px solid #E2E8F0", overflow: "hidden" },
    cardHeader: { padding: "20px 24px", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between" },
    cardTitle: { fontSize: "16px", fontWeight: "700", color: "#1E293B" },
    cardBody: { padding: "24px" },
    infoRow: { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F1F5F9" },
    infoLabel: { fontSize: "13px", color: "#94A3B8", fontWeight: "500" },
    infoValue: { fontSize: "14px", color: "#1E293B", fontWeight: "600" },
    descBox: { background: "#F8FAFC", borderRadius: "12px", padding: "16px", fontSize: "14px", color: "#334155", lineHeight: "1.6" },
    commentInput: { display: "flex", gap: "8px", marginTop: "16px" },
    commentTextarea: { flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "14px", outline: "none", resize: "none", fontFamily: "inherit" },
    commentBtn: { background: "#1D4ED8", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 16px", fontSize: "13px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" },
    commentItem: { padding: "14px 0", borderBottom: "1px solid #F1F5F9" },
    commentHeader: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" },
    commentAvatar: { width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "10px" },
    commentAuthor: { fontSize: "13px", fontWeight: "600", color: "#1E293B" },
    commentDate: { fontSize: "11px", color: "#94A3B8" },
    commentText: { fontSize: "14px", color: "#475569", lineHeight: "1.5", marginLeft: "36px" },
    deleteCommentBtn: { background: "none", border: "none", color: "#EF4444", fontSize: "12px", cursor: "pointer", marginLeft: "auto", fontWeight: "600" },
    alert: { padding: "12px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: "500", marginBottom: "20px", background: "#FEE2E2", color: "#DC2626", border: "1px solid #FECACA" },
    attachmentImg: { width: "80px", height: "80px", borderRadius: "10px", objectFit: "cover", border: "1px solid #E2E8F0", cursor: "pointer" },
  };

  return (
    <div style={s.page}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>← Back</button>

        {error && <div style={s.alert}>{error}</div>}

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#1E293B", margin: 0 }}>
            Ticket #{ticket.id}
          </h1>
          <span style={statusBadge(ticket.status)}>{ticket.status?.replace("_", " ")}</span>
          <span style={priorityBadge(ticket.priority)}>{ticket.priority}</span>
        </div>

        <div style={s.grid}>
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Description */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <span style={s.cardTitle}>📝 Description</span>
              </div>
              <div style={s.cardBody}>
                <div style={s.descBox}>{ticket.description}</div>
              </div>
            </div>

            {/* Attachments */}
            {attachments.length > 0 && (
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <span style={s.cardTitle}>📎 Attachments</span>
                  <span style={{ fontSize: "13px", color: "#94A3B8" }}>{attachments.length} file(s)</span>
                </div>
                <div style={{ ...s.cardBody, display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {attachments.map(a => (
                    <div key={a.id} style={{ textAlign: "center" }}>
                      <img
                        src={`http://localhost:8080/api/uploads/tickets/${a.filePath?.split(/[/\\]/).pop()}`}
                        alt={a.fileName}
                        style={s.attachmentImg}
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                      <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px", maxWidth: "80px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {a.fileName}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resolution Notes */}
            {ticket.resolutionNotes && (
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <span style={s.cardTitle}>✅ Resolution Notes</span>
                </div>
                <div style={s.cardBody}>
                  <div style={s.descBox}>{ticket.resolutionNotes}</div>
                </div>
              </div>
            )}

            {/* Rejection Reason */}
            {ticket.rejectionReason && (
              <div style={{ ...s.card, border: "1px solid #FECACA" }}>
                <div style={{ ...s.cardHeader, background: "#FEF2F2" }}>
                  <span style={{ ...s.cardTitle, color: "#DC2626" }}>❌ Rejection Reason</span>
                </div>
                <div style={s.cardBody}>
                  <div style={{ ...s.descBox, background: "#FEF2F2" }}>{ticket.rejectionReason}</div>
                </div>
              </div>
            )}

            {/* Comments */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <span style={s.cardTitle}>💬 Comments ({comments.length})</span>
              </div>
              <div style={s.cardBody}>
                {comments.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#94A3B8", padding: "20px", fontSize: "14px" }}>
                    No comments yet
                  </div>
                ) : (
                  comments.map(c => (
                    <div key={c.id} style={s.commentItem}>
                      <div style={s.commentHeader}>
                        <div style={s.commentAvatar}>{getInitials(c.author?.name)}</div>
                        <span style={s.commentAuthor}>{c.author?.name}</span>
                        <span style={s.commentDate}>{formatDate(c.createdAt)}</span>
                        {c.author?.email === user?.email && (
                          <button style={s.deleteCommentBtn} onClick={() => handleDeleteComment(c.id)}>
                            Delete
                          </button>
                        )}
                      </div>
                      <div style={s.commentText}>{c.content}</div>
                    </div>
                  ))
                )}

                {/* Add Comment */}
                <div style={s.commentInput}>
                  <input
                    style={s.commentTextarea}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                  />
                  <button style={s.commentBtn} onClick={handleAddComment}>Send</button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column — Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={s.card}>
              <div style={s.cardHeader}>
                <span style={s.cardTitle}>📋 Details</span>
              </div>
              <div style={s.cardBody}>
                <div style={s.infoRow}>
                  <span style={s.infoLabel}>Category</span>
                  <span style={s.infoValue}>{ticket.category?.replace("_", " ")}</span>
                </div>
                <div style={s.infoRow}>
                  <span style={s.infoLabel}>Location</span>
                  <span style={s.infoValue}>{ticket.location}</span>
                </div>
                {ticket.resourceId && (
                  <div style={s.infoRow}>
                    <span style={s.infoLabel}>Resource ID</span>
                    <span style={s.infoValue}>{ticket.resourceId}</span>
                  </div>
                )}
                <div style={s.infoRow}>
                  <span style={s.infoLabel}>Created</span>
                  <span style={{ ...s.infoValue, fontSize: "13px" }}>{formatDate(ticket.createdAt)}</span>
                </div>
                <div style={s.infoRow}>
                  <span style={s.infoLabel}>Updated</span>
                  <span style={{ ...s.infoValue, fontSize: "13px" }}>{formatDate(ticket.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Reporter */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <span style={s.cardTitle}>👤 Reporter</span>
              </div>
              <div style={s.cardBody}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "14px" }}>
                    {getInitials(ticket.creator?.name)}
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#1E293B" }}>{ticket.creator?.name}</div>
                    <div style={{ fontSize: "12px", color: "#94A3B8" }}>{ticket.creator?.email}</div>
                  </div>
                </div>
                {ticket.contactPhone && (
                  <div style={{ ...s.infoRow, marginTop: "12px" }}>
                    <span style={s.infoLabel}>Phone</span>
                    <span style={s.infoValue}>{ticket.contactPhone}</span>
                  </div>
                )}
                {ticket.contactEmail && (
                  <div style={s.infoRow}>
                    <span style={s.infoLabel}>Email</span>
                    <span style={{ ...s.infoValue, fontSize: "13px" }}>{ticket.contactEmail}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Assigned Technician */}
            {ticket.assignedTechnician && (
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <span style={s.cardTitle}>🔧 Assigned Technician</span>
                </div>
                <div style={s.cardBody}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #059669, #10B981)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "14px" }}>
                      {getInitials(ticket.assignedTechnician?.name)}
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#1E293B" }}>{ticket.assignedTechnician?.name}</div>
                      <div style={{ fontSize: "12px", color: "#94A3B8" }}>{ticket.assignedTechnician?.email}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
