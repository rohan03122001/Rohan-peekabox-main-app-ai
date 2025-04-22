PRICE FILTER:
    - GET /api/v1/users/stores/:storeId/products?priceSort=asc  // For lowest to highest price
    - GET /api/v1/users/stores/:storeId/products?priceSort=desc // For highest to lowest price

Distance Filter:
    - The new feature can be used with the following API endpoint:
    - GET /api/v1/users/stores/distance?latitude=25.123&longitude=55.456&radius=5
    - Parameters:
        - latitude: User's latitude (-90 to 90)
        - longitude: User's longitude (-180 to 180)
        - radius: Search radius in kilometers (default: 10)
        - page: Page number for pagination (default: 1)
        - limit: Number of results per page (default: 20)

Category And Collection Filters:
    -Get all products available for collection today
    GET /api/v1/users/products/collection?collectionDay=today

    - Get all products available for collection tomorrow
    GET /api/v1/users/products/collection?collectionDay=tomorrow

    - Get all grocery products available for collection today
    GET /api/v1/users/products/collection?collectionDay=today&category=GROCERY

    - Get all products available for collection on a specific day
    GET /api/v1/users/products/collection?collectionDay=MONDAY

    - Get products from a specific store available for collection today
    GET /api/v1/users/stores/:storeId/products?collectionDay=today

Favorites:
    - Add product to favorites
    - POST /api/v1/users/favourite/:productId

    - Get paginated favorites with full product details
    - GET /api/v1/users/favourites?page=1&limit=20

    - Remove product from favorites
    - DELETE /api/v1/users/favourite/:productId

    - Check if product is in favorites (for UI indicators)
    - GET /api/v1/users/favourite/:productId/check

    - Get count of favorites (for badges/indicators)
    - GET /api/v1/users/favourites/count

    - Clear all favorites
    - DELETE /api/v1/users/favourites/clear