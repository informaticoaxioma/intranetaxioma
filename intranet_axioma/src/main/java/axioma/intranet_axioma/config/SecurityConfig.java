package axioma.intranet_axioma.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // desactiva CSRF (útil para APIs)
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()   // 👉 TODAS LAS RUTAS SIN AUTORIZACIÓN
            );

        return http.build();
    }
}
