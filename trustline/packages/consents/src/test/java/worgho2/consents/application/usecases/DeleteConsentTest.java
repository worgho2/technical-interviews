package worgho2.consents.application.usecases;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;
import worgho2.consents.application.exceptions.ConsentNotFoundException;
import worgho2.consents.domain.Consent;
import worgho2.consents.infrastructure.MemoryConsentRepository;

@MicronautTest
public class DeleteConsentTest {

    MemoryConsentRepository memoryConsentRepository;
    DeleteConsent deleteConsent;

    @BeforeEach
    public void beforeEach() {
        memoryConsentRepository = new MemoryConsentRepository();
        deleteConsent = new DeleteConsent(memoryConsentRepository);
    }

    @Test
    public void testExecuteWhenConsentExists() {
        Consent existingConsent = memoryConsentRepository.addTestRecord(null, null, null, null, null);

        Mono<Void> output = deleteConsent.execute(existingConsent.getConsentId());

        StepVerifier
                .create(output)
                .expectComplete()
                .verify();

        StepVerifier
                .create(memoryConsentRepository.findById(existingConsent.getConsentId()))
                .expectComplete()
                .verify();
    }

    @Test
    public void testExecuteWhenConsentDoesNotExist() {
        String consentId = "non-existent-consent-id";

        Mono<Void> output = deleteConsent.execute(consentId);

        StepVerifier
                .create(output)
                .expectError(ConsentNotFoundException.class)
                .verify();
    }
}
