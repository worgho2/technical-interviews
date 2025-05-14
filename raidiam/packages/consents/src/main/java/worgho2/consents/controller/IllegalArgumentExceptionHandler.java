package worgho2.consents.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.micronaut.context.annotation.Requires;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Produces;
import io.micronaut.http.server.exceptions.ExceptionHandler;
import io.micronaut.http.server.exceptions.response.ErrorContext;
import io.micronaut.http.server.exceptions.response.ErrorResponseProcessor;
import jakarta.inject.Singleton;

/**
 * This class handles the {@link IllegalArgumentException} and returns a 400
 * response
 */
@Produces
@Singleton
@Requires(classes = {IllegalArgumentException.class, ExceptionHandler.class})
public class IllegalArgumentExceptionHandler implements ExceptionHandler< IllegalArgumentException, HttpResponse> {

    private static final Logger logger = LoggerFactory.getLogger(IllegalArgumentExceptionHandler.class);
    private final ErrorResponseProcessor<?> errorResponseProcessor;

    public IllegalArgumentExceptionHandler(ErrorResponseProcessor<?> errorResponseProcessor) {
        this.errorResponseProcessor = errorResponseProcessor;
    }

    @Override
    public HttpResponse handle(HttpRequest request, IllegalArgumentException exception) {
        logger.warn("Validation error: {}", exception.getMessage(), exception);

        return errorResponseProcessor.processResponse(
                ErrorContext
                        .builder(request)
                        .cause(exception)
                        .errorMessage(exception.getMessage())
                        .build(),
                HttpResponse.badRequest()
        );
    }

}
