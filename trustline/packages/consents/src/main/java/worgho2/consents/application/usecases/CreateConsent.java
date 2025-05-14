package worgho2.consents.application.usecases;

import java.util.Date;
import java.util.EnumSet;
import java.util.List;

import io.micronaut.validation.Validated;
import jakarta.inject.Singleton;
import jakarta.validation.constraints.NotNull;
import reactor.core.publisher.Mono;
import worgho2.consents.application.ConsentRepository;
import worgho2.consents.domain.Consent;
import worgho2.consents.domain.ConsentMetadata;
import worgho2.consents.domain.ConsentPermission;
import worgho2.consents.domain.ConsentStatus;

/**
 * Use case class that creates a new consent entity and persisting it to the
 * ConsentRepository.
 *
 * It maps the received permissions list to an enumSet in order to ensure that
 * the permissions are unique.
 *
 * @see ConsentRepository
 */
@Singleton
@Validated
public class CreateConsent {

    private final ConsentRepository consentRepository;

    public CreateConsent(ConsentRepository consentRepository) {
        this.consentRepository = consentRepository;
    }

    public Mono<Consent> execute(
            @NotNull String userId,
            @NotNull List<ConsentPermission> permissions,
            @NotNull ConsentStatus status
    ) {

        return Mono.defer(() -> {
            try {
                EnumSet<ConsentPermission> permissionSet = EnumSet.noneOf(ConsentPermission.class);
                permissionSet.addAll(permissions);

                Consent consent = Consent.create(userId, permissionSet, status);

                return consentRepository
                        .save(consent)
                        .map(consentId -> {
                            consent.setConsentId(consentId);
                            ConsentMetadata consentMetadata = new ConsentMetadata(new Date());
                            consent.setMeta(consentMetadata);
                            return consent;
                        });
            } catch (IllegalArgumentException e) {
                return Mono.error(e);
            }
        });
    }
}
