package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.TicketComment;
import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.repository.TicketCommentRepository;
import com.smartcampus.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketCommentService {

    private final TicketCommentRepository commentRepository;
    private final UserRepository userRepository;

    // Add a comment to a ticket
    public TicketComment addComment(Long ticketId, String content, String email) {
        User author = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TicketComment comment = TicketComment.builder()
                .ticketId(ticketId)
                .author(author)
                .content(content)
                .build();

        return commentRepository.save(comment);
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
