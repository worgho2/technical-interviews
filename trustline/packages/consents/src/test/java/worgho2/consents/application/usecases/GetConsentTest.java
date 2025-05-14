package worgho2.consents.application.usecases;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;
import worgho2.consents.application.exceptions.ConsentNotFoundException;
import worgho2.consents.domain.Consent;
import worgho2.consents.infrastructure.MemoryConsentRepository;

@MicronautTest
public class GetConsentTest {

    MemoryConsentRepository memoryConsentRepository;
    GetConsent getConsent;

    @BeforeEach
    public void beforeEach() {
        memoryConsentRepository = new MemoryConsentRepository();
        getConsent = new GetConsent(memoryConsentRepository);
    }

    @Test
    public void testExecuteWhenConsentExists() {
        Consent existingConsent = memoryConsentRepository.addTestRecord(null, null, null, null, null);

        Mono<Consent> output = getConsent.execute(existingConsent.getConsentId());

        StepVerifier
                .create(output)
                .assertNext(consent -> {
                    Assertions.assertNotNull(consent);
                    Assertions.assertEquals(existingConsent.getConsentId(), consent.getConsentId());
                    Assertions.assertNotNull(consent.getMeta());
                })
                .expectComplete()
                .verify();
    }

    @Test
    public void testExecuteWhenConsentDoesNotExist() {
        String consentId = "non-existent-consent-id";

        Mono<Consent> output = getConsent.execute(consentId);

        StepVerifier
                .create(output)
                .expectError(ConsentNotFoundException.class)
                .verify();
    }
}
