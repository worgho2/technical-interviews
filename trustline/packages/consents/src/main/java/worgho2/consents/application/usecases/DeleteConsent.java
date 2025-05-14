package worgho2.consents.application.usecases;

import jakarta.inject.Singleton;
import reactor.core.publisher.Mono;
import worgho2.consents.application.ConsentRepository;
import worgho2.consents.application.exceptions.ConsentNotFoundException;

/**
 * Use case class that deletes a consent. The consent must exist, otherwise an
 * {@link ConsentNotFoundException} exception returned.
 *
 * @see ConsentRepository
 */
@Singleton
public class DeleteConsent {

    private final ConsentRepository consentRepository;

    public DeleteConsent(ConsentRepository consentRepository) {
        this.consentRepository = consentRepository;
    }

    public Mono<Void> execute(String consentId) {
        return this.consentRepository
                .delete(consentId)
                .filter(deleted -> deleted)
                .switchIfEmpty(Mono.error(new ConsentNotFoundException(consentId)))
                .then();
    }
}
