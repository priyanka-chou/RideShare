RideShare Auth ka complete flow

Sabse pehle humne database banaya:

MySQL
│
├── users
├── pending_users
├── otp_verifications
├── rides
├── bookings
└── ratings

 Authentication ke liye mainly:
users
pending_users
otp_verifications


1️⃣ authRepository.js — Database layer
Sabse pehle humne:
repositories/authRepository.js
banaya.

Iska kaam sirf MySQL se baat karna hai.

Example:

findUserByEmail(email)

Database mein:

SELECT * FROM users WHERE email = ?

ya:

createPendingUser(...)

Database mein:

INSERT INTO pending_users ...

Repository ko business logic nahi pata
Repository ko bas ye pata hai:
"Database mein kya query chalani hai?"



2️⃣authService.js — Business Logic 
  Uske baad humne:
  services/authService.js
banaya.
Ye repository ke functions ko use karta hai.

registerUser()
     ↓
findUserByEmail()
      ↓
bcrypt.hash()
      ↓
createPendingUser()
      ↓
generateOtp()
      ↓
saveOtp()
      ↓
sendEmail()

Yahan actual business logic hai.

Service decide karta hai:

User already exist karta hai?
OTP bhejna hai?
Password hash karna hai?
User ko pending mein rakhna hai?


3️⃣ utils — Chhote reusable kaam
Service ke andar hume kuch reusable utilities chahiye thi:

utils/
├── generateOtp.js
├── sendEmail.js
├── asyncHandler.js
└── apiResponse.js

generateOtp.js

OTP banata hai:

583214
sendEmail.js

Brevo ke through OTP email karta hai:

Backend
   ↓
Brevo
   ↓
User Email
apiResponse.js

Successful response ka common format:

{
    "success": true,
    "message": "...",
    "data": null
}

asyncHandler.js
Controller ke asynchronous errors ko:

catch(next)
ke through Express error handling system mein bhejta hai.


4️⃣ authController.js — HTTP layer
Phir service ko directly route se connect karne ke bajay humne:
controllers/authController.js
banaya.

Controller ka kaam:
Request
   ↓
req.body
   ↓
Service
   ↓
Response
Example:

const result = await authService.registerUser(req.body);

Successful hua:

successResponse(...)

Error hua:

asyncHandler
    ↓
next(error)

Controller mein SQL ya bcrypt nahi hai. ✅



5️⃣ authRoutes.js — Endpoint
Phir controller ko route se connect kiya:

routes/authRoutes.js

Register:

router.post(
    "/register",
    registerValidation,
    validateRequest,
    register
);

Ab URL:

POST /api/auth/register



6️⃣ Validation — Route ke andar sabse pehle
Ye bahut important hai.

Request aayi:

POST /api/auth/register

Sabse pehle:

registerValidation

chalega.

Check:

name      → required
email     → valid email?
password  → minimum 6?
role      → user/rider?

Agar validation fail:
Request
   ↓
registerValidation ❌
   ↓
validateRequest
   ↓
400 Response

Controller tak request nahi jayegi.


7️⃣ validateRequest.js

express-validator errors ko check karta hai:

const errors = validationResult(req);

Agar errors hain:

400

response.

Agar errors nahi:

next();

Aur request controller tak jayegi.



8️⃣ AppError + errorMiddleware

Yahan tumhara important question tha.

Agar validation pass ho gayi:

Validation ✅
   ↓
Controller
   ↓
Service

Lekin service mein problem:

throw new AppError(
    "Email already registered",
    409
);

to:

AppError
   ↓
asyncHandler
   ↓
next(error)
   ↓
errorMiddleware

Aur errorMiddleware response dega:
{
    "success": false,
    "message": "Email already registered"
}



Ab complete picture

Ye sabse important diagram hai. Isko yaad kar lo:

                 CLIENT / POSTMAN
                        │
                        │
                        ▼
              POST /api/auth/register
                        │
                        ▼
                 authRoutes.js
                        │
                        ▼
              registerValidation
                        │
                 ┌──────┴──────┐
                 │             │
              Invalid        Valid
                 │             │
                 ▼             ▼
          validateRequest   Controller
                 │             │
                 │             ▼
                 │       asyncHandler
                 │             │
                 │             ▼
                 │      authService.js
                 │             │
                 │             ▼
                 │     authRepository.js
                 │             │
                 │             ▼
                 │           MySQL
                 │
                 ▼
              Error


authService
    │
    ├── bcrypt
    ├── JWT
    ├── generateOtp
    ├── sendEmail
    │
    └── authRepository
             ↓
           MySQL


❌ Error ka complete flow
Validation error:
Client
 ↓
Route
 ↓
Validation ❌
 ↓
validateRequest
 ↓
400


Service/business error:
Client
 ↓
Route
 ↓
Validation ✅
 ↓
Controller
 ↓
Service
 ↓
AppError ❌
 ↓
asyncHandler
 ↓
next(error)
 ↓
errorMiddleware
 ↓
Response


Unexpected database error:
MySQL ❌
 ↓
Repository
 ↓
Service
 ↓
Controller
 ↓
asyncHandler
 ↓
errorMiddleware
 ↓
500



Ek line mein pura architecture
Route
 ↓
Validation
 ↓
Controller
 ↓
Service
 ↓
Repository
 ↓
Database


Aur supporting components:

asyncHandler → Error ko errorMiddleware tak bhejta hai
AppError     → Structured error banata hai
errorMiddleware → Error ka final HTTP response deta hai
successResponse  → Success ka standard response deta hai
utils            → Reusable helper functions



REGISTER
   ↓
Pending User
   ↓
OTP
   ↓
Verify OTP
   ↓
Users


LOGIN
   ↓
Email + Password
   ↓
JWT Token


FORGOT PASSWORD
   ↓
Email
   ↓
Reset OTP
   ↓
Verify OTP
   ↓
Reset Token
   ↓
Reset Password







<!-- BOOKING SYSTEM  -->


Booking kiski hogi?
Booking ride ki hogi.


example: Rider ne ride create ki:

Rider: Rahul
From: Jabalpur
To: Bhopal
Date: 20 Sep
Time: 10 AM
Total Seats: 3
Available Seats: 3
Price: ₹250

ab koi normal user is ride ko dekhkar book karega.



::::: Kaun booking karega?
Humare users table mein: role = user



Available seat check
Suppose:

Total seats = 3
Available seats = 3

Priya books:
Available seats = 2

Another user books:
Available seats = 1

Third user books:
Available seats = 0

Ab fourth user booking karega:
❌ No seats available


Booking ke time kya-kya check hoga?
User jab booking karega, backend roughly ye checks karega:

1. Ride exist karti hai?
        ↓
2. Ride upcoming hai?
        ↓
3. User apni hi ride to book nahi kar raha?
        ↓
4. Available seats > 0?
        ↓
5. User ne pehle se ye ride book to nahi ki?
        ↓
6. Booking create
       ↓
7. available_seats = available_seats - 1







<!-- rating -->


RideShare Rating System

Ride complete hone ke baad passenger rider ko rating/review de sakta hai.

Example:

Rider: Rahul
Ride: Jabalpur → Bhopal
Passenger: Priya

Ride completed
       ↓
Priya gives:
⭐ ⭐ ⭐ ⭐ ⭐
Rating = 5
Review = "Good and safe ride"




Rating dene ke liye kya-kya zaroori hai?
User
 ↓
1. Ride exist karti hai?
 ↓
2. Ride COMPLETED hai?
 ↓
3. User ne us ride ki booking ki thi?
 ↓
4. Booking confirmed thi?
 ↓
5. User rider khud toh nahi hai?
 ↓
6. Is ride par pehle rating nahi di?
 ↓
7. Rating 1–5 ke beech hai
 ↓
8. Review optional hai
 ↓
Rating save ✅