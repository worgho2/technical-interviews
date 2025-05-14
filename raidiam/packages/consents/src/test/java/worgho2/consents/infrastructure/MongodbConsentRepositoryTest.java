package worgho2.consents.infrastructure;

import java.util.EnumSet;

import org.bson.types.ObjectId;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import jakarta.inject.Inject;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;
import worgho2.consents.domain.Consent;
import worgho2.consents.domain.ConsentPermission;
import worgho2.consents.domain.ConsentStatus;

@MicronautTest
public class MongodbConsentRepositoryTest {

    @Inject
    MongodbConsentRepository repository;

    @Test
    public void testSave() {
        String userId = "XXX";
        EnumSet<ConsentPermission> permissions = EnumSet.allOf(ConsentPermission.class);
        ConsentStatus status = ConsentStatus.AWAITING_AUTHORISATION;
        Consent consent = Consent.create(userId, permissions, status);

        Mono<String> output = repository.save(consent);

        StepVerifier
                .create(output)
                .assertNext(id -> {
                    Assertions.assertNotNull(id);
                })
                .expectComplete()
                .verify();
    }

    @Test
    void testFindByIdWhenConsentExists() {
        String userId = "XXX";
        EnumSet<ConsentPermission> permissions = EnumSet.allOf(ConsentPermission.class);
        ConsentStatus status = ConsentStatus.AWAITING_AUTHORISATION;
        Consent consent = Consent.create(userId, permissions, status);
        String consentId = repository.save(consent).block();
        consent.setConsentId(consentId);

        Mono<Consent> output = repository.findById(consentId);

        StepVerifier
                .create(output)
                .assertNext(retrievedConsent -> {
                    Assertions.assertNotNull(retrievedConsent);
                    Assertions.assertEquals(retrievedConsent.getUserId(), consent.getUserId());
                    Assertions.assertEquals(retrievedConsent.getPermissions(), consent.getPermissions());
                    Assertions.assertEquals(retrievedConsent.getStatus(), consent.getStatus());
                    Assertions.assertEquals(retrievedConsent.getCreatedAt(), consent.getCreatedAt());
                    Assertions.assertEquals(retrievedConsent.getUpdatedAt(), consent.getUpdatedAt());
                })
                .expectComplete()
                .verify();
    }

    @Test
    public void testFindByIdWhenConsentDoesNotExist() {
        Mono<Consent> output = repository.findById("XXX");

        StepVerifier
                .create(output)
                .expectComplete()
                .verify();
    }

    @Test
    public void testUpdateWhenConsentExists() {
        String userId = "XXX";
        Consent consent = Consent.create(
                userId,
                EnumSet.allOf(ConsentPermission.class),
                ConsentStatus.AWAITING_AUTHORISATION
        );
        String consentId = repository.save(consent).block();
        consent.setConsentId(consentId);
        consent.update(
                EnumSet.of(ConsentPermission.READ_DATA),
                ConsentStatus.AUTHORISED
        );

        Mono<Boolean> output = repository.update(consent);

        StepVerifier
                .create(output)
                .assertNext(updated -> {
                    Assertions.assertTrue(updated);

                    StepVerifier
                            .create(repository.findById(consentId))
                            .assertNext(retrievedConsent -> {
                                Assertions.assertEquals(retrievedConsent.getPermissions(), consent.getPermissions());
                                Assertions.assertEquals(retrievedConsent.getStatus(), consent.getStatus());
                            })
                            .expectComplete()
                            .verify();
                })
                .expectComplete()
                .verify();
    }

    @Test
    public void testUpdateWhenConsentDoesNotExist() {
        String userId = "XXX";
        Consent consent = Consent.create(
                userId,
                EnumSet.allOf(ConsentPermission.class),
                ConsentStatus.AWAITING_AUTHORISATION
        );
        consent.setConsentId(new ObjectId().toHexString());

        Mono<Boolean> output = repository.update(consent);

        StepVerifier
                .create(output)
                .assertNext(updated -> {
                    Assertions.assertFalse(updated);
                })
                .expectComplete()
                .verify();
    }

    @Test
    public void testDeleteWhenConsentExists() {
        String userId = "XXX";
        Consent consent = Consent.create(
                userId,
                EnumSet.allOf(ConsentPermission.class),
                ConsentStatus.AWAITING_AUTHORISATION
        );
        String consentId = repository.save(consent).block();
        consent.setConsentId(consentId);

        Mono<Boolean> output = repository.delete(consentId);

        StepVerifier
                .create(output)
                .assertNext(deleted -> {
                    Assertions.assertTrue(deleted);

                    StepVerifier
                            .create(repository.findById(consentId))
                            .expectComplete()
                            .verify();
                })
                .expectComplete()
                .verify();
    }

    @Test
    public void testDeleteWhenConsentDoesNotExist() {
        String consentId = new ObjectId().toHexString();

        Mono<Boolean> output = repository.delete(consentId);

        StepVerifier
                .create(output)
                .assertNext(deleted -> {
                    Assertions.assertFalse(deleted);
                })
                .expectComplete()
                .verify();
    }
}
