package worgho2.consents.infrastructure;

import java.util.Date;
import java.util.EnumSet;
import java.util.HashMap;

import org.bson.types.ObjectId;

import reactor.core.publisher.Mono;
import worgho2.consents.application.ConsentRepository;
import worgho2.consents.domain.Consent;
import worgho2.consents.domain.ConsentPermission;
import worgho2.consents.domain.ConsentStatus;

/**
 * In-memory implementation of the ConsentRepository interface.
 *
 * This class is used for testing purposes and requires a stateful runtime
 * environment.
 *
 * @see ConsentRepository
 */
public class MemoryConsentRepository implements ConsentRepository {

    private final HashMap<String, Consent> storage = new HashMap<>();

    /**
     * Helper method to add a test record to the repository.
     *
     * @param userId
     * @param permissions
     * @param status
     * @param createdAt
     * @param updatedAt
     * @return
     */
    public Consent addTestRecord(
            String userId,
            EnumSet<ConsentPermission> permissions,
            ConsentStatus status,
            Date createdAt,
            Date updatedAt
    ) {
        Consent consent = Consent.restore(
                new ObjectId().toHexString(),
                userId != null ? userId : new ObjectId().toHexString(),
                permissions != null ? permissions : EnumSet.allOf(ConsentPermission.class),
                status != null ? status : ConsentStatus.AWAITING_AUTHORISATION,
                createdAt != null ? createdAt : new Date(),
                updatedAt != null ? updatedAt : new Date()
        );

        storage.put(consent.getConsentId(), consent);

        return Consent.restore(
                consent.getConsentId(),
                consent.getUserId(),
                consent.getPermissions(),
                consent.getStatus(),
                consent.getCreatedAt(),
                consent.getUpdatedAt()
        );
    }

    @Override
    public Mono<String> save(Consent consent) {
        return Mono.fromCallable(() -> {
            String newId = new ObjectId().toHexString();
            storage.put(newId, consent);
            return newId;
        });
    }

    @Override
    public Mono<Consent> findById(String consentId) {
        return Mono.fromCallable(() -> storage.get(consentId));
    }

    @Override
    public Mono<Boolean> update(Consent consent) {
        return Mono.fromCallable(() -> {
            if (!storage.containsKey(consent.getConsentId())) {
                return false;
            }

            storage.put(consent.getConsentId(), consent);
            return true;
        });
    }

    @Override
    public Mono<Boolean> delete(String consentId) {
        return Mono.fromCallable(() -> {
            if (!storage.containsKey(consentId)) {
                return false;
            }

            storage.remove(consentId);
            return true;
        });
    }

}
