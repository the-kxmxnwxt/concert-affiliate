import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
	url: 'https://fail-between-arguments-handbook.trycloudflare.com', // URL ของ Keycloak
    realm: 'concert-affiliate',
    clientId: 'concert-backend',
    checkLoginIframe: false // ปิดการตรวจสอบ iframe เพื่อลดการใช้ Cookie
});

export default keycloak;
