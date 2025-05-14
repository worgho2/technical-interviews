package worgho2.consents.application.usecases;

import java.util.Date;

import jakarta.inject.Singleton;
import reactor.core.publisher.Mono;
import worgho2.consents.application.ConsentRepository;
import worgho2.consents.application.exceptions.ConsentNotFoundException;
import worgho2.consents.domain.Consent;
import worgho2.consents.domain.ConsentMetadata;

/**
 * Use case class that retrieves a consent. The consent must exist, otherwise an
 * {@link ConsentNotFoundException} exception returned.
 *
 * @see ConsentRepository
 */
@Singleton
public class GetConsent {

    private final ConsentRepository consentRepository;

    public GetConsent(ConsentRepository consentRepository) {
        this.consentRepository = consentRepository;
    }

    public Mono<Consent> execute(String consentId) {
        return this.consentRepository
                .findById(consentId)
                .switchIfEmpty(Mono.error(new ConsentNotFoundException(consentId)))
                .map(consent -> {
                    ConsentMetadata consentMetadata = new ConsentMetadata(new Date());
                    consent.setMeta(consentMetadata);
                    return consent;
                });
    }
}
