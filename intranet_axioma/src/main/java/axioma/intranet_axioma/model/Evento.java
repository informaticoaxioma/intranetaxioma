package axioma.intranet_axioma.model;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "eventos")
@NoArgsConstructor
@AllArgsConstructor
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String tituloEvento;

    @Column(nullable = false)
    private LocalDate fechaEvento;

    private String tipo;
    private String ubicacion;

    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
}
