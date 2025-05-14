package worgho2.consents.application.usecases;

import java.util.Date;
import java.util.EnumSet;
import java.util.List;

import jakarta.inject.Singleton;
import reactor.core.publisher.Mono;
import worgho2.consents.application.ConsentRepository;
import worgho2.consents.application.exceptions.ConsentNotFoundException;
import worgho2.consents.domain.Consent;
import worgho2.consents.domain.ConsentMetadata;
import worgho2.consents.domain.ConsentPermission;
import worgho2.consents.domain.ConsentStatus;

/**
 * Use case class that updates a consent. The consent must exist, otherwise an
 * {@link ConsentNotFoundException} exception returned.
 *
 * @see ConsentRepository
 */
@Singleton
public class UpdateConsent {

    private final ConsentRepository consentRepository;

    public UpdateConsent(ConsentRepository consentRepository) {
        this.consentRepository = consentRepository;
    }

    public Mono<Consent> execute(
            String consentId,
            List<ConsentPermission> permissions,
            ConsentStatus status
    ) {
        return this.consentRepository
                .findById(consentId)
                .switchIfEmpty(Mono.error(new ConsentNotFoundException(consentId)))
                .map(consent -> {
                    EnumSet<ConsentPermission> permissionSet = EnumSet.noneOf(ConsentPermission.class);
                    permissionSet.addAll(permissions);

                    consent.update(permissionSet, status);
                    return consent;
                })
                .flatMap(
                        consent -> this.consentRepository
                                .update(consent)
                                .map(updatedConsent -> {
                                    ConsentMetadata consentMetadata = new ConsentMetadata(new Date());
                                    consent.setMeta(consentMetadata);
                                    return consent;
                                })
                );
    }
}
