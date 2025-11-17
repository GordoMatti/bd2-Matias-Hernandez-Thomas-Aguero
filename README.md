# Metalurgicos - Node (converted)

Proyecto generado automáticamente para el parcial integrador (API REST e-commerce) convertido de Spring Boot a Node/Express + Mongoose.

## Cómo usar

1. Copia `.env.sample` a `.env` y adapta:
   - MONGO_URI: URI de tu MongoDB (ej: mongodb://localhost:27017/metalurgicos)
   - JWT_SECRET: secreto para JWT
   - JWT_EXPIRES_IN: tiempo de expiración (ej: 1d)

2. Instala dependencias:
   ```
   npm install
   ```

3. Ejecuta:
   ```
   npm run dev
   ```

4. Pruébalo con Postman:
   - Endpoints básicos:
     - POST /api/usuarios -> register (body: name,email,password)
     - POST /api/usuarios/login -> login (body: email,password)
     - Protected routes requieren header: Authorization: Bearer <token>

5. Conectar con MongoDB Compass:
   - Abre MongoDB Compass y conecta usando `MONGO_URI` del `.env`.
   - Verás la base `metalurgicos` y las colecciones: users, products, categories, carts, orders, reviews.

## Rutas implementadas (resumen)
- /api/usuarios
- /api/productos
- /api/categorias
- /api/carrito
- /api/ordenes
- /api/resenas

Incluye uso de agregaciones ($lookup, $group, $avg), operadores de modificación ($set, $push, $pull), y protección JWT + middleware admin.

"# Bd2-Mati-Hernandez-Thomas-Aguero" 
