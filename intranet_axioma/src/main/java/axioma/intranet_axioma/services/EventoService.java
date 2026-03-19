package axioma.intranet_axioma.services;

import axioma.intranet_axioma.model.Evento;
import axioma.intranet_axioma.repository.EventoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventoService {

    private final EventoRepository eventoRepository;

    public EventoService(EventoRepository eventoRepository) {
        this.eventoRepository = eventoRepository;
    }


    public List<Evento> listar() {
        return eventoRepository.findAll();
    }

    public Evento guardar(Evento evento) {
        return eventoRepository.save(evento);
    }

    public Optional<Evento> buscarPorId(Long id) {
        return eventoRepository.findById(id);
    }

    public void eliminar(Long id) {
        eventoRepository.deleteById(id);
    }
}