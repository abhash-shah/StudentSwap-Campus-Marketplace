
package com.studentswap.backend;

import java.io.IOException;
import java.util.List;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;

@Configuration
public class SecurityConfig {
    @Bean
    PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    UserDetailsService admin(
            @Value("${studentswap.admin.username:admin}") String username,
            @Value("${studentswap.admin.password}") String password,
            PasswordEncoder encoder) {

        return new InMemoryUserDetailsManager(
                User.withUsername(username)
                        .password(encoder.encode(password))
                        .roles("ADMIN")
                        .build()
        );
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:5174",
                "http://127.0.0.1:5175"
        ));

        config.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));

        config.setAllowedHeaders(List.of(
                "Authorization", "Content-Type"
        ));

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    @Bean
    SecurityFilterChain filter(
            HttpSecurity http,
            SessionService tokens) throws Exception {

        OncePerRequestFilter bearerFilter = new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(
                    HttpServletRequest request,
                    HttpServletResponse response,
                    FilterChain chain)
                    throws ServletException, IOException {

                String header = request.getHeader("Authorization");

                if (header != null
                        && header.startsWith("Bearer ")
                        && SecurityContextHolder.getContext()
                                .getAuthentication() == null) {

                    tokens.fromToken(header.substring(7)).ifPresent(user -> {
                        var authentication =
                                new UsernamePasswordAuthenticationToken(
                                        String.valueOf(user.getId()),
                                        null,
                                        List.of(new SimpleGrantedAuthority(
                                                "ROLE_STUDENT"
                                        ))
                                );

                        SecurityContextHolder.getContext()
                                .setAuthentication(authentication);
                    });
                }

                chain.doFilter(request, response);
            }
        };

        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                        "/api/health",
                        "/api/categories",
                        "/uploads/**"
                ).permitAll()

                .requestMatchers(HttpMethod.GET, "/api/listings")
                    .permitAll()

                .requestMatchers(
                        "/api/auth/register",
                        "/api/auth/login",
                        "/api/contact"
                ).permitAll()

                .requestMatchers("/api/admin/**")
                    .hasRole("ADMIN")

                .requestMatchers("/api/auth/**", "/api/messages/**")
                    .authenticated()

                .requestMatchers(
                        HttpMethod.POST,
                        "/api/listings",
                        "/api/upload-image"
                ).authenticated()

                .requestMatchers(HttpMethod.PUT, "/api/listings/**")
                    .authenticated()

                .requestMatchers(HttpMethod.DELETE, "/api/listings/**")
                    .authenticated()

                .anyRequest().denyAll()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, exception) -> {
                    response.setHeader("WWW-Authenticate", "");
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                })
            )
            .httpBasic(basic -> basic
                .authenticationEntryPoint((request, response, exception) -> {
                    response.setHeader("WWW-Authenticate", "");
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                })
            )
            .addFilterBefore(
                    bearerFilter,
                    BasicAuthenticationFilter.class
            );

        return http.build();
    }
}
