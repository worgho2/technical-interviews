package worgho2.consents.application;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import reactor.core.publisher.Mono;
import worgho2.consents.domain.Consent;

/**
 * Port interface for the consent repository.
 */
public interface ConsentRepository {

    /**
     * Saves a consent to the persistence. The consentId must be unique.
     *
     * @param consent
     * @return The consentId of the saved consent.
     */
    Mono<String> save(@NotNull @Valid Consent consent);

    /**
     * Finds a consent by its consentId.
     *
     * @param consentId
     * @return A {@link Mono} containing the consent with the given consentId,
     * or an empty {@link Mono} if no consent with the given consentId exists.
     */
    Mono<Consent> findById(@NotBlank String consentId);

    /**
     * Updates a consent.
     *
     * @param consent
     * @return {@link Mono} containing a boolean indicating whether the consent
     * was found and updated.
     */
    Mono<Boolean> update(@NotNull @Valid Consent consent);

    /**
     * Deletes a consent by its consentId.
     *
     * @param consentId
     * @return A {@link Mono} containing a boolean indicating whether the
     * consent was found and deleted.
     */
    Mono<Boolean> delete(@NotBlank String consentId);
}
