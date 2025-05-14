package worgho2.consents.domain;

import java.util.Date;
import java.util.EnumSet;

import io.micronaut.core.annotation.Creator;
import io.micronaut.core.annotation.Nullable;
import io.micronaut.serde.annotation.Serdeable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

/**
 * Class that represents a consent entity. It should be insantiated only through
 * the static factory methods.
 */
@Serdeable
public class Consent {

    @Nullable
    private String consentId;

    @NotBlank
    private final String userId;

    @Size(min = 1, max = 3)
    private EnumSet<ConsentPermission> permissions;

    @NotNull
    private ConsentStatus status;

    @NotNull
    @PastOrPresent
    private final Date createdAt;

    @NotNull
    @PastOrPresent
    private Date updatedAt;

    @Nullable
    private ConsentMetadata meta;

    @Creator
    private Consent(
            String consentId,
            String userId,
            EnumSet<ConsentPermission> permissions,
            ConsentStatus status,
            Date createdAt,
            Date updatedAt,
            ConsentMetadata meta
    ) {
        this.consentId = consentId;
        this.userId = userId;
        this.permissions = permissions;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.meta = meta;
    }

    /**
     * Static factory method to create a new consent. After the entity is
     * persisted, the consentId must be set.
     *
     * @param userId
     * @param permissions
     * @param status
     * @return A new consent instance
     * @throws IllegalArgumentException
     */
    public static Consent create(
            String userId,
            EnumSet<ConsentPermission> permissions,
            ConsentStatus status
    ) throws IllegalArgumentException {
        final Date now = new Date();

        if (status != ConsentStatus.AWAITING_AUTHORISATION) {
            throw new IllegalArgumentException(
                    "Cannot create consent with status other than AWAITING_AUTHORISATION"
            );
        }

        return new Consent(
                null,
                userId,
                permissions,
                status,
                now,
                now,
                null
        );
    }

    /**
     * Static Factory method to restore a consent entity from a persistence
     * layer.
     *
     * @param consentId
     * @param userId
     * @param permissions
     * @param status
     * @param createdAt
     * @param updatedAt
     * @return A new consent instance
     */
    public static Consent restore(
            @NotBlank String consentId,
            String userId,
            EnumSet<ConsentPermission> permissions,
            ConsentStatus status,
            Date createdAt,
            Date updatedAt
    ) {
        return new Consent(
                consentId,
                userId,
                permissions,
                status,
                createdAt,
                updatedAt,
                null
        );
    }

    /**
     * Set the consentId after it has been persisted.
     *
     * @param consentId
     */
    public void setConsentId(String consentId) throws IllegalStateException {
        if (this.consentId != null) {
            throw new IllegalStateException("Cannot change consentId");
        }

        this.consentId = consentId;
    }

    public void setMeta(ConsentMetadata meta) {
        this.meta = meta;
    }

    /**
     * Update the consent requiring it to be also updated in the persistence.
     *
     * @param permissions
     * @param status
     */
    public void update(EnumSet<ConsentPermission> permissions, ConsentStatus status) {
        this.permissions = permissions;
        this.status = status;
        this.updatedAt = new Date();
    }

    public String getConsentId() {
        return consentId;
    }

    public String getUserId() {
        return userId;
    }

    public EnumSet<ConsentPermission> getPermissions() {
        return permissions;
    }

    public ConsentStatus getStatus() {
        return status;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public ConsentMetadata getMeta() {
        return meta;
    }
}
