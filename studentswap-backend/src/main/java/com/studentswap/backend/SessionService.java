package com.studentswap.backend;
import com.studentswap.backend.entity.*;
import com.studentswap.backend.repository.*;
import org.springframework.stereotype.Service;
import java.security.*;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;
@Service
public class SessionService {
 private final UserSessionRepository sessions; private final AppUserRepository users;
 private final SecureRandom random=new SecureRandom();
 public SessionService(UserSessionRepository s,AppUserRepository u){sessions=s;users=u;}
 public String hash(String token){try {byte[] b=MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8));return HexFormat.of().formatHex(b);}catch(Exception ex){throw new IllegalStateException(ex);}}
 public String issue(Long id){byte[] bytes=new byte[32];random.nextBytes(bytes);String token=Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);UserSession s=new UserSession();s.setTokenHash(hash(token));s.setUserId(id);s.setExpiresAt(LocalDateTime.now().plusDays(7));sessions.save(s);return token;}
 public Optional<AppUser> fromToken(String token){if(token==null||token.isBlank())return Optional.empty();return sessions.findById(hash(token)).filter(s->s.getExpiresAt().isAfter(LocalDateTime.now())).flatMap(s->users.findById(s.getUserId()));}
 public void revoke(String token){if(token!=null)sessions.deleteById(hash(token));}
}
