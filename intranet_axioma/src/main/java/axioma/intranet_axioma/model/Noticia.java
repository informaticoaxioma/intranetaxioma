package axioma.intranet_axioma.model;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "noticias")
@Data
@NoArgsConstructor
@AllArgsConstructor
public  class Noticia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titular;
    private String categorias;

    @Column(columnDefinition = "TEXT")
    private String textoNoticia;

    private LocalDate fecha;
    private String imagen;
    private String autor;
    
}
