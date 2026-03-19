package axioma.intranet_axioma.services;

import axioma.intranet_axioma.model.Documento;
import axioma.intranet_axioma.repository.DocumentoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DocumentoService {
    private final DocumentoRepository documentoRepository;

    public DocumentoService(DocumentoRepository documentoRepository) {
        this.documentoRepository = documentoRepository;
    }

    public List<Documento> listar() {
        return documentoRepository.findAll();
    }

    public Documento guardar(Documento documento) {
        return documentoRepository.save(documento);
    }

    public Optional<Documento> buscarPorId(Long id) {
        return documentoRepository.findById(id);
    }

    public void eliminar(Long id) {
        documentoRepository.deleteById(id);
    }
    
}
