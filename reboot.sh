# cd app && yarn build && cd ../;
docker-compose down;

docker-compose up -d --build;
docker-compose logs -f;
