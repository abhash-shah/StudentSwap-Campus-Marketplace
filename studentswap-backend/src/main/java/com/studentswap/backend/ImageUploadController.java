package com.studentswap.backend;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5175", "http://localhost:5173", "http://127.0.0.1:5175", "http://127.0.0.1:5173"})
public class ImageUploadController {
    private static final long MAX_FILE_SIZE = 5L * 1024 * 1024;
    private static final Set<String> ALLOWED_TYPES = Set.of(
        "image/jpeg", "image/png", "image/webp", "image/gif"
    );

    @PostMapping(value = "/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Please choose an image."));
            }
            if (file.getSize() > MAX_FILE_SIZE) {
                return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                    .body(Map.of("error", "Image must be 5 MB or smaller."));
            }
            String contentType = file.getContentType();
            if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase())) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Only JPG, PNG, WEBP and GIF images are allowed."));
            }

            String extension = switch (contentType.toLowerCase()) {
                case "image/jpeg" -> ".jpg";
                case "image/png" -> ".png";
                case "image/webp" -> ".webp";
                case "image/gif" -> ".gif";
                default -> throw new IllegalArgumentException("Unsupported image type");
            };

            Path uploadDirectory = Path.of("uploads").toAbsolutePath().normalize();
            Files.createDirectories(uploadDirectory);
            String filename = UUID.randomUUID() + extension;
            Path destination = uploadDirectory.resolve(filename).normalize();
            if (!destination.startsWith(uploadDirectory)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid file path."));
            }
            file.transferTo(destination);

            String imageUrl = "http://localhost:8080/uploads/" + filename;
            return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
        } catch (IOException ex) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "The server could not save this image."));
        }
    }
}
