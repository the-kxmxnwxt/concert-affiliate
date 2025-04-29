FROM quay.io/keycloak/keycloak:24.0.1

ENV KEYCLOAK_ADMIN=admin
ENV KEYCLOAK_ADMIN_PASSWORD=admin123

RUN /opt/keycloak/bin/kc.sh build

CMD ["/opt/keycloak/bin/kc.sh", "start"]
