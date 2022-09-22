
export function isExcluded(url, excludeRoutes) {
    return excludeRoutes.some(route => {
        const pattern = new RegExp(`${route}?.`);
        // console.log(route, url);
        return pattern.test(url);
    });
}