package worgho2.consents.application.usecases;

import java.util.EnumSet;
import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;
import worgho2.consents.application.exceptions.ConsentNotFoundException;
import worgho2.consents.domain.Consent;
import worgho2.consents.domain.ConsentPermission;
import worgho2.consents.domain.ConsentStatus;
import worgho2.consents.infrastructure.MemoryConsentRepository;

@MicronautTest
public class UpdateConsentTest {

    MemoryConsentRepository memoryConsentRepository;
    UpdateConsent updateConsent;

    @BeforeEach
    public void beforeEach() {
        memoryConsentRepository = new MemoryConsentRepository();
        updateConsent = new UpdateConsent(memoryConsentRepository);
    }

    @Test
    public void testExecuteWhenConsentExists() {
        Consent existingConsent = memoryConsentRepository.addTestRecord(
                null,
                EnumSet.of(ConsentPermission.READ_DATA),
                ConsentStatus.AWAITING_AUTHORISATION,
                null,
                null
        );
        List<ConsentPermission> permissions = List.of(
                ConsentPermission.READ_DATA,
                ConsentPermission.WRITE_DATA
        );
        ConsentStatus status = ConsentStatus.AUTHORISED;

        Mono<Consent> output = updateConsent.execute(
                existingConsent.getConsentId(),
                permissions,
                status
        );

        StepVerifier
                .create(output)
                .assertNext(consent -> {
                    Assertions.assertEquals(consent.getConsentId(), existingConsent.getConsentId());
                    Assertions.assertEquals(
                            consent.getPermissions(),
                            EnumSet.of(ConsentPermission.READ_DATA, ConsentPermission.WRITE_DATA)
                    );
                    Assertions.assertEquals(consent.getStatus(), ConsentStatus.AUTHORISED);
                    Assertions.assertNotNull(consent.getMeta());
                })
                .expectComplete()
                .verify();
    }

    @Test
    public void testExecuteWhenConsentDoesNotExist() {
        String consentId = "non-existent-consent-id";
        List<ConsentPermission> permissions = List.of(
                ConsentPermission.READ_DATA,
                ConsentPermission.WRITE_DATA
        );
        ConsentStatus status = ConsentStatus.AUTHORISED;

        Mono<Consent> output = updateConsent.execute(consentId, permissions, status);

        StepVerifier
                .create(output)
                .expectError(ConsentNotFoundException.class)
                .verify();
    }
}
