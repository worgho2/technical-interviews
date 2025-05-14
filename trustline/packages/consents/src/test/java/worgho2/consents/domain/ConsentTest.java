package worgho2.consents.domain;

import java.util.Date;
import java.util.EnumSet;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import io.micronaut.test.extensions.junit5.annotation.MicronautTest;

@MicronautTest
public class ConsentTest {

    @Test
    public void testCreateWhenInputIsValid() {
        Consent consent = Consent.create(
                "userId",
                EnumSet.of(ConsentPermission.READ_DATA),
                ConsentStatus.AWAITING_AUTHORISATION
        );

        Assertions.assertNull(consent.getConsentId());
        Assertions.assertEquals("userId", consent.getUserId());
        Assertions.assertEquals(
                EnumSet.of(ConsentPermission.READ_DATA),
                consent.getPermissions()
        );
        Assertions.assertEquals(ConsentStatus.AWAITING_AUTHORISATION, consent.getStatus());
        Assertions.assertNotNull(consent.getCreatedAt());
        Assertions.assertNotNull(consent.getUpdatedAt());
        Assertions.assertNull(consent.getMeta());
    }

    @Test
    public void testCreateWhenStatusIsNotAwaitingAuthorisation() {
        IllegalArgumentException exception = Assertions.assertThrows(
                IllegalArgumentException.class,
                () -> Consent.create(
                        "userId",
                        EnumSet.of(ConsentPermission.READ_DATA),
                        ConsentStatus.AUTHORISED
                )
        );

        Assertions.assertEquals(
                "Cannot create consent with status other than AWAITING_AUTHORISATION",
                exception.getMessage()
        );
    }

    @Test
    public void testRestoreWhenInputIsValid() {
        Date createdAt = new Date();
        Date updatedAt = new Date();

        Consent consent = Consent.restore(
                "consentId",
                "userId",
                EnumSet.allOf(ConsentPermission.class),
                ConsentStatus.AUTHORISED,
                createdAt,
                updatedAt
        );

        Assertions.assertEquals("consentId", consent.getConsentId());
        Assertions.assertEquals("userId", consent.getUserId());
        Assertions.assertEquals(
                EnumSet.allOf(ConsentPermission.class),
                consent.getPermissions()
        );
        Assertions.assertEquals(ConsentStatus.AUTHORISED, consent.getStatus());
        Assertions.assertNotNull(consent.getCreatedAt());
        Assertions.assertNotNull(consent.getUpdatedAt());
        Assertions.assertNull(consent.getMeta());
    }

    @Test
    public void testSetConsentIdWhenConsentIdWasAlreadySet() {
        Consent consent = Consent.create(
                "userId",
                EnumSet.of(ConsentPermission.READ_DATA),
                ConsentStatus.AWAITING_AUTHORISATION
        );

        consent.setConsentId("ConsentId");

        IllegalStateException exception = Assertions.assertThrows(
                IllegalStateException.class,
                () -> consent.setConsentId("consentId")
        );

        Assertions.assertEquals("Cannot change consentId", exception.getMessage());
    }
}
