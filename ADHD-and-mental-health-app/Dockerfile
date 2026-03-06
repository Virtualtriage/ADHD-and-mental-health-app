# ---------- Stage 1: Build React ----------
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    # install dependencies
    COPY package*.json ./
    RUN npm install
    
    # copy project files
    COPY . .
    
    # build react app
    RUN npm run build
    
    
    # ---------- Stage 2: Serve with Nginx ----------
    FROM nginx:alpine
    
    # remove default config
    RUN rm /etc/nginx/conf.d/default.conf
    
    # copy nginx config
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # copy build from builder stage
    COPY --from=builder /app/build /usr/share/nginx/html
    
    EXPOSE 80
    
    CMD ["nginx", "-g", "daemon off;"]