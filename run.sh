go build -o how-you-doin

# TS build
cd client && npm ci && npm run build
cd ../

./how-you-doin