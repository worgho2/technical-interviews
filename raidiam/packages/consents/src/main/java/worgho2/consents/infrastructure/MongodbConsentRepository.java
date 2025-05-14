package worgho2.consents.infrastructure;

import org.bson.BsonDocument;
import org.bson.BsonObjectId;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.mongodb.client.model.FindOneAndReplaceOptions;
import com.mongodb.reactivestreams.client.MongoClient;
import com.mongodb.reactivestreams.client.MongoCollection;

import io.micronaut.context.annotation.Requires;
import io.micronaut.core.annotation.NonNull;
import jakarta.inject.Singleton;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import reactor.core.publisher.Mono;
import worgho2.consents.application.ConsentRepository;
import worgho2.consents.domain.Consent;

/**
 * Adapter class implementing the ConsentRepository port using MongoDB.
 *
 * @see ConsentRepository
 */
@Requires(beans = {MongoClient.class})
@Singleton
public class MongodbConsentRepository implements ConsentRepository {

    private static final Logger logger = LoggerFactory.getLogger(MongodbConsentRepository.class);
    private final MongodbConfiguration mongodbConfiguration;
    private final MongoClient client;

    public MongodbConsentRepository(
            MongoClient client,
            MongodbConfiguration mongodbConfiguration
    ) {
        this.client = client;
        this.mongodbConfiguration = mongodbConfiguration;
    }

    @NonNull
    private MongoCollection<MongodbConsentModel> getCollection() {
        return client
                .getDatabase(this.mongodbConfiguration.getDatabaseName())
                .getCollection(
                        this.mongodbConfiguration.getCollectionName(),
                        MongodbConsentModel.class
                );
    }

    @Override
    public Mono<String> save(@NotNull @Valid Consent consent) {
        MongodbConsentModel document = MongodbConsentModel.fromEntity(consent);

        return Mono
                .from(this.getCollection().insertOne(document))
                .map(result -> document.getId().toHexString());
    }

    @Override
    public Mono<Consent> findById(@NotBlank String consentId) {
        if (!ObjectId.isValid(consentId)) {
            logger.warn("Invalid consentId: {}", consentId);
            return Mono.empty();
        }

        ObjectId objectId = new ObjectId(consentId);
        BsonDocument query = new BsonDocument("_id", new BsonObjectId(objectId));

        return Mono
                .from(this.getCollection().find(query).first())
                .mapNotNull(result -> result.toEntity());
    }

    @Override
    public Mono<Boolean> update(@NotNull @Valid Consent consent) {
        MongodbConsentModel document = MongodbConsentModel.fromEntity(consent);

        ObjectId objectId = new ObjectId(consent.getConsentId());
        BsonDocument query = new BsonDocument("_id", new BsonObjectId(objectId));

        FindOneAndReplaceOptions options = new FindOneAndReplaceOptions().upsert(false);

        return Mono
                .from(this.getCollection().findOneAndReplace(query, document, options))
                .map(result -> result != null)
                .defaultIfEmpty(false);
    }

    @Override
    public Mono<Boolean> delete(@NotBlank String consentId) {
        if (!ObjectId.isValid(consentId)) {
            logger.warn("Invalid consentId: {}", consentId);
            return Mono.just(false);
        }

        ObjectId objectId = new ObjectId(consentId);
        BsonDocument query = new BsonDocument("_id", new BsonObjectId(objectId));

        return Mono
                .from(this.getCollection().findOneAndDelete(query))
                .map(result -> result != null)
                .defaultIfEmpty(false);
    }
}
