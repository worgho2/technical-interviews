package worgho2.consents.application.usecases;

import java.util.EnumSet;
import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;
import worgho2.consents.domain.Consent;
import worgho2.consents.domain.ConsentPermission;
import worgho2.consents.domain.ConsentStatus;
import worgho2.consents.infrastructure.MemoryConsentRepository;

@MicronautTest
public class CreateConsentTest {

    MemoryConsentRepository memoryConsentRepository;
    CreateConsent createConsent;

    @BeforeEach
    public void beforeEach() {
        memoryConsentRepository = new MemoryConsentRepository();
        createConsent = new CreateConsent(memoryConsentRepository);
    }

    @Test
    public void testExecuteWithValidData() {
        String userId = "XXXXXXX";
        List<ConsentPermission> permissions = List.of(
                ConsentPermission.READ_DATA,
                ConsentPermission.DELETE_DATA,
                ConsentPermission.WRITE_DATA
        );
        ConsentStatus status = ConsentStatus.AWAITING_AUTHORISATION;

        Mono<Consent> output = createConsent.execute(userId, permissions, status);

        StepVerifier
                .create(output)
                .assertNext(consent -> {
                    Assertions.assertNotNull(consent);
                    Assertions.assertNotNull(consent.getConsentId());
                    Assertions.assertEquals(userId, consent.getUserId());
                    EnumSet<ConsentPermission> consentPermissions = EnumSet.allOf(ConsentPermission.class);
                    Assertions.assertEquals(consentPermissions, consent.getPermissions());
                    Assertions.assertEquals(status, consent.getStatus());
                    Assertions.assertNotNull(consent.getCreatedAt());
                    Assertions.assertNotNull(consent.getUpdatedAt());
                    Assertions.assertNotNull(consent.getMeta());
                    StepVerifier
                            .create(memoryConsentRepository.findById(consent.getConsentId()))
                            .assertNext(storedConsent -> {
                                Assertions.assertNotNull(storedConsent);
                                Assertions.assertEquals(consent.getConsentId(), storedConsent.getConsentId());
                            })
                            .expectComplete()
                            .verify();
                })
                .expectComplete()
                .verify();
    }

    @Test
    public void testExecuteWithInvalidStatus() {
        String userId = "XXXXXXX";
        List<ConsentPermission> permissions = List.of(ConsentPermission.READ_DATA);
        ConsentStatus status = ConsentStatus.AUTHORISED;

        Mono<Consent> output = createConsent.execute(userId, permissions, status);

        StepVerifier
                .create(output)
                .expectError(IllegalArgumentException.class)
                .verify();
    }
}
