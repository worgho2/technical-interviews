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
import worgho2.consents.application.exceptions.ConsentNotFoundException;

/**
 * This class handles the {@link ConsentNotFoundException} and returns a 404
 * response
 */
@Produces
@Singleton
@Requires(classes = {ConsentNotFoundException.class, ExceptionHandler.class})
public class ConsentNotFoundExceptionHandler implements ExceptionHandler<ConsentNotFoundException, HttpResponse> {

    private static final Logger logger = LoggerFactory.getLogger(ConsentNotFoundExceptionHandler.class);
    private final ErrorResponseProcessor<?> errorResponseProcessor;

    public ConsentNotFoundExceptionHandler(ErrorResponseProcessor<?> errorResponseProcessor) {
        this.errorResponseProcessor = errorResponseProcessor;
    }

    @Override
    public HttpResponse handle(HttpRequest request, ConsentNotFoundException exception) {
        logger.warn("{}", exception.getMessage());

        return errorResponseProcessor.processResponse(
                ErrorContext
                        .builder(request)
                        .cause(exception)
                        .errorMessage(exception.getMessage())
                        .build(),
                HttpResponse.notFound()
        );
    }

}
