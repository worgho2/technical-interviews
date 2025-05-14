package worgho2.consents.controller;

import java.util.List;

import io.micronaut.core.annotation.Nullable;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Delete;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.PathVariable;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.Put;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import io.micronaut.validation.Validated;
import reactor.core.publisher.Mono;
import worgho2.consents.application.usecases.CreateConsent;
import worgho2.consents.application.usecases.DeleteConsent;
import worgho2.consents.application.usecases.GetConsent;
import worgho2.consents.application.usecases.UpdateConsent;
import worgho2.consents.domain.Consent;
import worgho2.consents.domain.ConsentPermission;
import worgho2.consents.domain.ConsentStatus;

/**
 * Controller for managing consents. It allows anonymous clients to create,
 * retrieve, update and delete consents.
 */
@Controller(value = "/consents")
@Validated
@Secured(SecurityRule.IS_ANONYMOUS)
public class ConsentController {

    private final CreateConsent createConsent;
    private final DeleteConsent deleteConsent;
    private final GetConsent getConsent;
    private final UpdateConsent updateConsent;

    public ConsentController(
            CreateConsent createConsent,
            DeleteConsent deleteConsent,
            GetConsent getConsent,
            UpdateConsent updateConsent
    ) {
        this.createConsent = createConsent;
        this.deleteConsent = deleteConsent;
        this.getConsent = getConsent;
        this.updateConsent = updateConsent;
    }

    @Post
    public Mono<HttpResponse<Consent>> createConsent(
            @Body("userId") String userId,
            @Body("permissions") List<ConsentPermission> permissions,
            @Body("status") @Nullable ConsentStatus status
    ) {
        return this.createConsent
                .execute(userId, permissions, status)
                .map(HttpResponse::created);
    }

    @Get("/{consentId}")
    public Mono<HttpResponse<Consent>> getConsent(
            @PathVariable("consentId") String consentId
    ) {
        return this.getConsent
                .execute(consentId)
                .map(HttpResponse::ok);
    }

    @Put("/{consentId}")
    public Mono<HttpResponse<Consent>> updateConsent(
            @PathVariable("consentId") String consentId,
            @Body("permissions") List<ConsentPermission> permissions,
            @Body("status") ConsentStatus status
    ) {
        return this.updateConsent
                .execute(consentId, permissions, status)
                .map(HttpResponse::ok);
    }

    @Delete("/{consentId}")
    public Mono<HttpResponse<?>> deleteConsent(
            @PathVariable("consentId") String consentId
    ) {
        return this.deleteConsent
                .execute(consentId)
                .thenReturn(HttpResponse.noContent());
    }
}
