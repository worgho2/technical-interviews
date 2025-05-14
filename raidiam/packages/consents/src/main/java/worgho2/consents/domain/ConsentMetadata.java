package worgho2.consents.domain;

import java.util.Date;

import io.micronaut.core.annotation.Creator;
import io.micronaut.serde.annotation.Serdeable;

/**
 * Class that represents the request metadata of a consent.
 */
@Serdeable
public class ConsentMetadata {

    private final Date requestDateTime;

    @Creator
    public ConsentMetadata(Date requestDateTime) {
        this.requestDateTime = requestDateTime;
    }

    public Date getRequestDateTime() {
        return requestDateTime;
    }
}
