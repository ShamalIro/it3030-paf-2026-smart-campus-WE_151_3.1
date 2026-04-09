package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.Ticket;
import com.smartcampus.backend.entity.TicketAttachment;
import com.smartcampus.backend.entity.TicketComment;
import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.enums.TicketCategory;
import com.smartcampus.backend.enums.TicketPriority;
import com.smartcampus.backend.enums.TicketStatus;
import com.smartcampus.backend.service.TicketCommentService;
import com.smartcampus.backend.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final TicketCommentService commentService;

    // ─── TICKET CRUD ──────────────────────────────────────────────────

    // POST /api/tickets — Create a new ticket (USER)
    @PostMapping
    public ResponseEntity<Ticket> createTicket(
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal String email) {

        Ticket ticket = Ticket.builder()
                .location(request.get("location"))
                .resourceId(request.get("resourceId"))
                .category(TicketCategory.valueOf(request.get("category")))
                .description(request.get("description"))
                .priority(TicketPriority.valueOf(request.get("priority")))
                .contactPhone(request.get("contactPhone"))
                .contactEmail(request.get("contactEmail"))
                .build();

        return ResponseEntity.ok(ticketService.createTicket(ticket, email));
    }

    // GET /api/tickets/my — Get current user's tickets
    @GetMapping("/my")
    public ResponseEntity<List<Ticket>> getMyTickets(
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(ticketService.getMyTickets(email));
    }

    // GET /api/tickets — Get all tickets (ADMIN)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    // GET /api/tickets/assigned — Get technician's assigned tickets
    @GetMapping("/assigned")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<List<Ticket>> getAssignedTickets(
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(ticketService.getAssignedTickets(email));
    }

    // GET /api/tickets/{id} — Get single ticket details
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    // ─── ADMIN ACTIONS ───────────────────────────────────────────────

    // PUT /api/tickets/{id}/assign — Assign a technician (ADMIN)
    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Ticket> assignTechnician(
            @PathVariable Long id,
            @RequestBody Map<String, Long> request) {
        return ResponseEntity.ok(
                ticketService.assignTechnician(id, request.get("technicianId")));
    }

    // PUT /api/tickets/{id}/reject — Reject a ticket (ADMIN)
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Ticket> rejectTicket(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(
                ticketService.rejectTicket(id, request.get("reason")));
    }

    // GET /api/tickets/technicians — Get all technicians (for admin assignment dropdown)
    @GetMapping("/technicians")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllTechnicians() {
        return ResponseEntity.ok(ticketService.getAllTechnicians());
    }

    // ─── TECHNICIAN ACTIONS ──────────────────────────────────────────

    // PUT /api/tickets/{id}/status — Update ticket status (TECHNICIAN)
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<Ticket> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal String email) {
        TicketStatus newStatus = TicketStatus.valueOf(request.get("status"));
        return ResponseEntity.ok(
                ticketService.updateStatus(id, newStatus, email));
    }

    // PUT /api/tickets/{id}/resolve — Resolve ticket (TECHNICIAN)
    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<Ticket> resolveTicket(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(
                ticketService.resolveTicket(id, request.get("resolutionNotes"), email));
    }

    // ─── ATTACHMENTS ─────────────────────────────────────────────────

    // POST /api/tickets/{id}/upload — Upload images
    @PostMapping("/{id}/upload")
    public ResponseEntity<List<TicketAttachment>> uploadAttachments(
            @PathVariable Long id,
            @RequestParam("files") MultipartFile[] files) {
        try {
            return ResponseEntity.ok(ticketService.uploadAttachments(id, files));
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload files: " + e.getMessage());
        }
    }

    // GET /api/tickets/{id}/attachments — Get attachments for a ticket
    @GetMapping("/{id}/attachments")
    public ResponseEntity<List<TicketAttachment>> getAttachments(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getAttachments(id));
    }

    // GET /api/tickets/attachments/{attachmentId}/download — Download attachment file
    @GetMapping("/attachments/{attachmentId}/download")
    public ResponseEntity<Resource> downloadAttachment(@PathVariable Long attachmentId) {
        try {
            // Get the attachment from repo via service
            TicketAttachment attachment = ticketService.getAttachments(0L).stream()
                    .filter(a -> a.getId().equals(attachmentId))
                    .findFirst()
                    .orElse(null);

            // Fallback: just try to find by ID directly
            if (attachment == null) {
                throw new RuntimeException("Attachment not found");
            }

            Path filePath = Paths.get(attachment.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"" + attachment.getFileName() + "\"")
                        .body(resource);
            } else {
                throw new RuntimeException("File not found on server");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error downloading file: " + e.getMessage());
        }
    }

    // ─── COMMENTS ────────────────────────────────────────────────────

    // POST /api/tickets/{id}/comments — Add comment
    @PostMapping("/{id}/comments")
    public ResponseEntity<TicketComment> addComment(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(
                commentService.addComment(id, request.get("content"), email));
    }

    // GET /api/tickets/{id}/comments — Get comments for a ticket
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<TicketComment>> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(commentService.getComments(id));
    }

    // DELETE /api/tickets/comments/{commentId} — Delete a comment
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal String email) {
        commentService.deleteComment(commentId, email);
        return ResponseEntity.noContent().build();
    }

    // PUT /api/tickets/comments/{commentId} — Update a comment
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<TicketComment> updateComment(
            @PathVariable Long commentId,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(
                commentService.updateComment(commentId, request.get("content"), email));
    }
}
