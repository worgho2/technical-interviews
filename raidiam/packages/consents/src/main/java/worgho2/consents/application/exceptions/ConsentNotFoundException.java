package worgho2.consents.application.exceptions;

/**
 * Exception thrown when a requested consent is not found.
 */
public class ConsentNotFoundException extends RuntimeException {

    public ConsentNotFoundException(String consentId) {
        super("Consent with id (" + consentId + ") not found");
    }
}
