set -x #echo on

yarn
yarn build

docker build . -t us-west1-docker.pkg.dev/zerok-dev/zerok-dashboard/zerok-next-dashboard:dev-v1
docker push us-west1-docker.pkg.dev/zerok-dev/zerok-dashboard/zerok-next-dashboard:dev-v1

# kubectl apply -k ./k8s-v1

podname=$(kubectl get pod -n zkcloud --no-headers -o custom-columns=":metadata.name" | grep zerok-next-dashboard-v1)
echo "Deleting pod: " $podname
kubectl delete pod $podname -n zkcloud


