export async function waitForApi(page, endpoint, method = 'GET', status = 200) {
    return page.waitForResponse(response =>
        response.url().includes(endpoint) &&
        response.status() === status &&
        response.request().method() === method
    );
}