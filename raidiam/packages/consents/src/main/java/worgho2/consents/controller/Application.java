package worgho2.consents.controller;

import io.micronaut.context.ApplicationContextBuilder;
import io.micronaut.context.ApplicationContextConfigurer;
import io.micronaut.context.annotation.ContextConfigurer;
import io.micronaut.core.annotation.NonNull;
import io.micronaut.runtime.Micronaut;

/**
 * Micronaut API main class
 */
public class Application {

    @ContextConfigurer
    public static class Configurer implements ApplicationContextConfigurer {

        @Override
        public void configure(@NonNull ApplicationContextBuilder builder) {
            builder.eagerInitSingletons(true);
        }
    }

    public static void main(String[] args) {
        Micronaut.run(Application.class, args);
    }
}
