package worgho2.consents.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.micronaut.core.order.Ordered;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.annotation.RequestFilter;
import io.micronaut.http.annotation.ServerFilter;
import io.micronaut.http.filter.ServerFilterPhase;

/**
 * Class responsible for logging incoming requests
 */
@ServerFilter("/**")
public class LoggingMiddleware implements Ordered {

    private static final Logger logger = LoggerFactory.getLogger(LoggingMiddleware.class);

    @RequestFilter
    public void filterRequest(HttpRequest<?> request) {
        logger.trace(
                "{} {} {} {} {} {}",
                request.getSslSession().isPresent() ? "HTTPS" : "HTTP",
                request.getMethod(),
                request.getPath(),
                request.getHttpVersion(),
                request.getContentLength(),
                request.getHeaders().getValue("Host")
        );
    }

    @Override
    public int getOrder() {
        return ServerFilterPhase.TRACING.order();
    }
}
