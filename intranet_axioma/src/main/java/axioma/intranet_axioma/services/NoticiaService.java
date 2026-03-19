package axioma.intranet_axioma.services;

import axioma.intranet_axioma.model.Noticia;
import axioma.intranet_axioma.repository.NoticiaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NoticiaService {
    private final NoticiaRepository noticiaRepository;

    public NoticiaService(NoticiaRepository noticiaRepository) {
        this.noticiaRepository = noticiaRepository;
    }
    public List<Noticia> listar() {
        return noticiaRepository.findAll();
    }

    public Noticia guardar(Noticia noticia) {
        return noticiaRepository.save(noticia);
    }

    public Optional<Noticia> buscarPorId(Long id) {
        return noticiaRepository.findById(id);
    }

    public void eliminar(Long id) {
        noticiaRepository.deleteById(id);
    }
    
}
