package worgho2.consents.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bson.types.ObjectId;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import org.junit.jupiter.api.Test;

import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import worgho2.consents.domain.ConsentPermission;
import worgho2.consents.domain.ConsentStatus;

@MicronautTest
class ConsentControllerTest {

    @Test
    public void testCreateConsent(RequestSpecification spec) {
        Map<String, Object> body = new HashMap<>();
        body.put("userId", "123");
        body.put("permissions", List.of(ConsentPermission.READ_DATA));
        body.put("status", ConsentStatus.AWAITING_AUTHORISATION);

        spec
                .given().contentType(ContentType.JSON).body(body)
                .when().post("/consents")
                .then().contentType(ContentType.JSON).statusCode(201)
                .body("consentId", is(notNullValue()))
                .body("userId", is("123"))
                .body("permissions", is(equalTo(List.of(ConsentPermission.READ_DATA.toString()))))
                .body("status", is(ConsentStatus.AWAITING_AUTHORISATION.toString()))
                .body("createdAt", is(notNullValue()))
                .body("updatedAt", is(notNullValue()))
                .body("meta", is(notNullValue()));
    }

    @Test
    public void testCreateInvalidConsent(RequestSpecification spec) {
        Map<String, Object> body = new HashMap<>();
        body.put("permissions", List.of());
        body.put("status", ConsentStatus.AUTHORISED);

        spec
                .given().contentType(ContentType.JSON).body(body)
                .when().post("/consents")
                .then().contentType(ContentType.JSON).statusCode(400);
    }

    @Test
    public void testGetConsent(RequestSpecification spec) {
        Map<String, Object> body = new HashMap<>();
        body.put("userId", "123");
        body.put("permissions", List.of(ConsentPermission.READ_DATA));
        body.put("status", ConsentStatus.AWAITING_AUTHORISATION);

        String consentId = spec
                .given().contentType(ContentType.JSON).body(body)
                .when().post("/consents")
                .then().contentType(ContentType.JSON).statusCode(201)
                .extract().path("consentId");

        spec
                .given().contentType(ContentType.JSON)
                .when().get("/consents/" + consentId)
                .then().contentType(ContentType.JSON).statusCode(200)
                .body("consentId", is(consentId))
                .body("userId", is("123"))
                .body("permissions", is(equalTo(List.of(ConsentPermission.READ_DATA.toString()))))
                .body("status", is(equalTo(ConsentStatus.AWAITING_AUTHORISATION.toString())))
                .body("createdAt", is(notNullValue()))
                .body("updatedAt", is(notNullValue()))
                .body("meta", is(notNullValue()));
    }

    @Test
    public void testGetNonExistentConsent(RequestSpecification spec) {
        String consentId = new ObjectId().toHexString();
        spec
                .given().contentType(ContentType.JSON)
                .when().get("/consents/" + consentId)
                .then().statusCode(404);
    }

    @Test
    public void testUpdateConsent(RequestSpecification spec) {
        Map<String, Object> createBody = new HashMap<>();
        createBody.put("userId", "123");
        createBody.put("permissions", List.of(ConsentPermission.READ_DATA));
        createBody.put("status", ConsentStatus.AWAITING_AUTHORISATION);

        String consentId = spec
                .given().contentType(ContentType.JSON).body(createBody)
                .when().post("/consents")
                .then().contentType(ContentType.JSON).statusCode(201)
                .extract().path("consentId");

        Map<String, Object> updateBody = new HashMap<>();
        updateBody.put("permissions", List.of(
                ConsentPermission.READ_DATA,
                ConsentPermission.WRITE_DATA
        ));
        updateBody.put("status", ConsentStatus.AUTHORISED);

        spec
                .given().contentType(ContentType.JSON).body(updateBody)
                .when().put("/consents/" + consentId)
                .then().contentType(ContentType.JSON).statusCode(200)
                .body("consentId", is(consentId))
                .body("userId", is("123"))
                .body("permissions", is(equalTo(
                        List.of(
                                ConsentPermission.READ_DATA.toString(),
                                ConsentPermission.WRITE_DATA.toString()
                        )
                )))
                .body("status", is(equalTo(ConsentStatus.AUTHORISED.toString())))
                .body("createdAt", is(notNullValue()))
                .body("updatedAt", is(notNullValue()))
                .body("meta", is(notNullValue()));
    }

    @Test
    public void testUpdateNonExistentConsent(RequestSpecification spec) {
        String consentId = new ObjectId().toHexString();
        Map<String, Object> body = new HashMap<>();
        body.put("permissions", List.of(ConsentPermission.READ_DATA));
        body.put("status", ConsentStatus.REJECTED);

        spec
                .given().contentType(ContentType.JSON).body(body)
                .when().put("/consents/" + consentId)
                .then().statusCode(404);
    }

    @Test
    public void testUpdateInvalidConsent(RequestSpecification spec) {
        Map<String, Object> createBody = new HashMap<>();
        createBody.put("userId", "123");
        createBody.put("permissions", List.of(ConsentPermission.READ_DATA));
        createBody.put("status", ConsentStatus.AWAITING_AUTHORISATION);

        String consentId = spec
                .given().contentType(ContentType.JSON).body(createBody)
                .when().post("/consents")
                .then().contentType(ContentType.JSON).statusCode(201)
                .extract().path("consentId");

        Map<String, Object> updateBody = new HashMap<>();
        updateBody.put("permissions", List.of());
        updateBody.put("status", ConsentStatus.AUTHORISED);

        spec
                .given().contentType(ContentType.JSON).body(updateBody)
                .when().put("/consents/" + consentId)
                .then().contentType(ContentType.JSON).statusCode(400);
    }

    @Test
    public void testDeleteConsent(RequestSpecification spec) {
        Map<String, Object> body = new HashMap<>();
        body.put("userId", "123");
        body.put("permissions", List.of(ConsentPermission.READ_DATA));
        body.put("status", ConsentStatus.AWAITING_AUTHORISATION);

        String consentId = spec
                .given().contentType(ContentType.JSON).body(body)
                .when().post("/consents")
                .then().contentType(ContentType.JSON).statusCode(201)
                .extract().path("consentId");

        spec
                .given().contentType(ContentType.JSON)
                .when().delete("/consents/" + consentId)
                .then().statusCode(204);
    }

    @Test
    public void testDeleteNonExistentConsent(RequestSpecification spec) {
        String consentId = new ObjectId().toHexString();

        spec
                .given().contentType(ContentType.JSON)
                .when().delete("/consents/" + consentId)
                .then().statusCode(404);
    }
}
