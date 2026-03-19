package axioma.intranet_axioma.repository;

import axioma.intranet_axioma.model.Noticia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticiaRepository extends JpaRepository<Noticia, Long> {
    
}
