yarn build
yarn export

docker build . -t us-west1-docker.pkg.dev/zerok-dev/zerok-next-dashboard/zerok-dashboard:dev
docker push us-west1-docker.pkg.dev/zerok-dev/zerok-next-dashboard/zerok-next-dashboard:dev

kubectl apply -k ./k8s