set -x #echo on

yarn
yarn build

docker build . -t us-west1-docker.pkg.dev/zerok-dev/zerok-dashboard/zerok-next-dashboard:0.1.0
docker push us-west1-docker.pkg.dev/zerok-dev/zerok-dashboard/zerok-next-dashboard:0.1.0

# kubectl apply -k ./k8s

./killpod.sh

