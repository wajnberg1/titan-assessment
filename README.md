For step 1 use the curl 
curl -X GET http://localhost:8080/api/images?number=1

Unfortunately the API at https://pixabay.com/api/ returns a 400 error for some reason

For step 2 use the curl
 curl -X POST http://localhost:8080/orders -H "Content-Type: application/json" -d '{
    "email": "user@example.com",
    "fullName": "John Doe",
    "fullAddress": "1234 Main St, Anytown, USA",
    "imageUrls": ["http://example.com/image1.jpg", "http://example.com/image2.jpg"],
    "frameColor": "black",
    "user": "60c72b2f5f1b2c001f5c9e65"
}'

You need  to install MongoDB first

For step 3 use the curl 
curl -X GET http://localhost:8080/orders/user?userId=60c72b2f5f1b2c001f5c9e65