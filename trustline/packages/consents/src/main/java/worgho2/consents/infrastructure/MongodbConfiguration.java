package worgho2.consents.infrastructure;

import io.micronaut.context.annotation.ConfigurationProperties;

/**
 * Class that holds the configuration for the MongoDB. The database uri is
 * handled by the MongoClient.
 */
@ConfigurationProperties("mongodbConfiguration")
public interface MongodbConfiguration {

    String getDatabaseName();

    String getCollectionName();
}
