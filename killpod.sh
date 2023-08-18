podname=$(kubectl get pod -n zkcloud --no-headers -o custom-columns=":metadata.name" | grep zerok-next-dashboard)
echo "Deleting pod: " $podname
kubectl delete pod $podname -n zkcloud
