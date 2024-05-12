package com.mytech.mainservice.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import lombok.extern.slf4j.Slf4j;
import org.apache.hc.client5.http.ssl.TrustAllStrategy;
import org.apache.hc.core5.ssl.SSLContextBuilder;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

import javax.net.ssl.SSLContext;

@Configuration
@Slf4j
public class ELSConfig extends ElasticsearchConfiguration {

    @Value("${env.elasticsearch_pass}")
    private String password;
    @Value("${env.elasticsearch_host_and_port}")
    private String hostAndPort;

    @Override
    public ClientConfiguration clientConfiguration() {
        if (hostAndPort.contains("elastic")) {
            return ClientConfiguration.builder()
                    .connectedTo(hostAndPort)
                    .withBasicAuth("elastic", password)
                    .build();
        }
        return ClientConfiguration.builder()
                .connectedTo(hostAndPort)
                .usingSsl(buildSSLContext())
                .withBasicAuth("elastic", password)
                .build();
    }

    private static SSLContext buildSSLContext() {
        try {
            return new SSLContextBuilder().loadTrustMaterial(null, TrustAllStrategy.INSTANCE).build();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


}
