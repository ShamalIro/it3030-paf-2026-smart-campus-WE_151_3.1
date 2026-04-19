package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.TicketComment;
import com.smartcampus.backend.entity.Ticket;
import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.enums.NotificationType;
import com.smartcampus.backend.repository.TicketCommentRepository;
import com.smartcampus.backend.repository.TicketRepository;
import com.smartcampus.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketCommentService {

    private final TicketCommentRepository commentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // Add a comment to a ticket
    public TicketComment addComment(Long ticketId, String content, String email) {
        User author = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));

        TicketComment comment = TicketComment.builder()
                .ticketId(ticketId)
                .author(author)
                .content(content)
                .build();

        TicketComment savedComment = commentRepository.save(comment);

        if (ticket.getCreator() != null && !ticket.getCreator().getEmail().equals(email)) {
            String message = String.format(
                "New comment on Ticket #%d by %s",
                ticketId,
                author.getName());

            notificationService.createNotification(
                ticket.getCreator(),
                NotificationType.NEW_COMMENT,
                message);
        }

        return savedComment;
    }

    // Get all comments for a ticket
    public List<TicketComment> getComments(Long ticketId) {
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }

    // Delete a comment - only owner can delete
    public void deleteComment(Long commentId, String email) {
        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getAuthor().getEmail().equals(email)) {
            throw new RuntimeException("You can only delete your own comments");
        }

        commentRepository.delete(comment);
    }

    // Update a comment - only owner can edit
    public TicketComment updateComment(Long commentId, String newContent, String email) {
        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getAuthor().getEmail().equals(email)) {
            throw new RuntimeException("You can only edit your own comments");
        }

        comment.setContent(newContent);
        return commentRepository.save(comment);
    }
}
