# ArtistrySocialNetwork

#BACKEND:
  - File SQL mới nhất trong database/DB.sql
  - API lấy ra 1 user: http://localhost:8060/api/main/user/get/05ce9cd0-def3-11ee-b0db-6045bd58a1e3
  - Thứ  tự run project:
      1. Server-Config
      2. Server-Registry
      3. Main/RealTime-Service
      4. Gateway-service
  - Open 1 api để không cần authentication:
      1. Mở  gateway-service/filter/RouteValidator.java và add endpoint vô list (endpoint trong này tính từ api/main(realtime)/...)
      2. Mở  main/realtime-service/config/AuthConfig.java và add endpoint vô list (endpoint trong này chỉ tính từ đường dẫn quy định trong @RequestMapping trong Controller)