import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'http://localhost:8081', // URL ของ Keycloak
    realm: 'concert-affiliate',
    clientId: 'concert-backend',
    checkLoginIframe: false // ปิดการตรวจสอบ iframe เพื่อลดการใช้ Cookie
});

export default keycloak;