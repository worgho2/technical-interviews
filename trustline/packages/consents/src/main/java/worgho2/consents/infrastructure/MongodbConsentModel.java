package worgho2.consents.infrastructure;

import java.util.Date;
import java.util.EnumSet;
import java.util.List;

import org.bson.codecs.pojo.annotations.BsonCreator;
import org.bson.codecs.pojo.annotations.BsonId;
import org.bson.codecs.pojo.annotations.BsonProperty;
import org.bson.types.ObjectId;

import io.micronaut.core.annotation.Creator;
import io.micronaut.core.annotation.ReflectiveAccess;
import io.micronaut.serde.annotation.Serdeable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import worgho2.consents.domain.Consent;
import worgho2.consents.domain.ConsentPermission;
import worgho2.consents.domain.ConsentStatus;

/**
 * Class that represents a consent database model. Even though it seems
 * redundant, it belongs to the infrastructure layer and should reflect the data
 * structure present in the database. It also has support for mapping the
 * database model to the domain model and vice versa.
 */
@ReflectiveAccess
@Serdeable
public class MongodbConsentModel {

    @NotBlank
    @BsonId
    private final ObjectId id;

    @NotBlank
    @BsonProperty("userId")
    private final String userId;

    @NotNull
    @BsonProperty("permissions")
    private final List<String> permissions;

    @NotBlank
    @BsonProperty("status")
    private final String status;

    @NotNull
    @BsonProperty("createdAt")
    private final Date createdAt;

    @NotNull
    @BsonProperty("updatedAt")
    private final Date updatedAt;

    /**
     * Constructor for the MongodbConsentModel class. This constructor is used
     * by the MongoDB codec to create a new instance of the class, due to the
     * Creator and BsonCreator annotations.
     *
     * @param id
     * @param userId
     * @param permissions
     * @param status
     * @param createdAt
     * @param updatedAt
     */
    @Creator
    @BsonCreator
    public MongodbConsentModel(
            @NotBlank @BsonId ObjectId id,
            @NotBlank @BsonProperty("userId") String userId,
            @NotNull @BsonProperty("permissions") List<String> permissions,
            @NotBlank @BsonProperty("status") String status,
            @NotNull @BsonProperty("createdAt") Date createdAt,
            @NotNull @BsonProperty("updatedAt") Date updatedAt
    ) {
        this.id = id;
        this.userId = userId;
        this.permissions = permissions;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    /**
     * Static factory method to create a new MongodbConsentModel instance from a
     * Consent entity. It is also resposible for generating new ids when
     * necessary.
     *
     * @param consent
     * @return A new MongodbConsentModel instance
     */
    public static MongodbConsentModel fromEntity(Consent consent) {
        ObjectId id = consent.getConsentId() != null
                ? new ObjectId(consent.getConsentId())
                : new ObjectId();

        return new MongodbConsentModel(
                id,
                consent.getUserId(),
                consent.getPermissions().stream().map(Enum::name).toList(),
                consent.getStatus().name(),
                consent.getCreatedAt(),
                consent.getUpdatedAt()
        );
    }

    /**
     * Method to convert the MongodbConsentModel instance to a Consent entity.
     *
     * @return A Consent entity mapped from the MongodbConsentModel instance
     */
    public Consent toEntity() {
        EnumSet<ConsentPermission> permissionSet = EnumSet.noneOf(ConsentPermission.class);

        for (String permission : this.permissions) {
            permissionSet.add(ConsentPermission.valueOf(permission));
        }

        return Consent.restore(
                this.id.toHexString(),
                this.userId,
                permissionSet,
                ConsentStatus.valueOf(this.status),
                this.createdAt,
                this.updatedAt
        );
    }

    public ObjectId getId() {
        return id;
    }

    @NotBlank
    public String getUserId() {
        return userId;
    }

    @NotNull
    public List<String> getPermissions() {
        return permissions;
    }

    @NotBlank
    public String getStatus() {
        return status;
    }

    @NotNull
    public Date getCreatedAt() {
        return createdAt;
    }

    @NotNull
    public Date getUpdatedAt() {
        return updatedAt;
    }
}
