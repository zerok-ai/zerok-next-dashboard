set -x #echo on

# Check if the number of parameters is not equal to 2
if [ $# -ne 2 ]; then
    echo "Please provide exactly 2 parameters. Cluster and tag."
    exit 1
fi

yarn
yarn build

echo "Deploying to $1 cluster"

docker build . -t us-west1-docker.pkg.dev/zerok-dev/zerok-dashboard/$1/zerok-next-dashboard:$2
docker push us-west1-docker.pkg.dev/zerok-dev/zerok-dashboard/$1/zerok-next-dashboard:$2

# kubectl apply -k ./k8s

# ./killpod.sh

